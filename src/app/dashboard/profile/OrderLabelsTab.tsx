import React, { useState, useEffect } from 'react';
import { Package, Truck, CreditCard, RefreshCw, Download, MapPin, Phone, Mail, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLabelAISuggestion } from './hooks/useLabelAISuggestion'

interface Order {
  id: string | number;
  bundle_count: number;
  label_count: number;
  amount_cents: number;
  status: string;
  created_at?: string;
  shipped_at?: string;
  receipt_url?: string;
}

interface LabelProduct {
  id: number;
  name: string;
  price?: number;
  price_cents?: number;
  rolls_per_bundle: number;
  labels_per_roll: number;
}

export default function OrderLabelsTab() {
  const [bundleCount, setBundleCount] = useState<number>(1);
  const [address1, setAddress1] = useState<string>('');
  const [address2, setAddress2] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingOrders, setFetchingOrders] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('demo'); // fallback to 'demo' if not found

  // Add duration options
  const durationOptions = [7, 14, 30, 60];
  const [customDays, setCustomDays] = useState<number | null>(null);
  const [days, setDays] = useState<number>(14);

  // Pass labelsPerDay to AI suggestion hook
  const [labelsPerDay, setLabelsPerDay] = useState<number>(80); // Default fallback
  const [labelsPerDayLoading, setLabelsPerDayLoading] = useState<boolean>(true);
  const [labelsPerDayError, setLabelsPerDayError] = useState<string | null>(null);

  // Add state for selected label product
  const [labelProducts, setLabelProducts] = useState<LabelProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const selectedProduct = labelProducts.find(p => p.id === selectedProductId) || labelProducts[0];
  const rollsPerBundle = selectedProduct?.rolls_per_bundle || 1;
  const labelsPerRoll = selectedProduct?.labels_per_roll || 1;
  const priceCents = selectedProduct?.price_cents ?? 0;
  // The AI should be told how many labels are in a roll (not a bundle)
  const goal = 'Suggest how many rolls to order (1 bundle = ' + rollsPerBundle + ' rolls, 1 roll = ' + labelsPerRoll + ' labels)';
  const { suggestion, loading: aiLoading, error: aiError, refetch } = useLabelAISuggestion({ usageData: { labelsPerDay, labelsPerRoll, days }, goal })
  const [aiOrderQty, setAiOrderQty] = useState<number | null>(null)

  // Calculate total rolls and labels for the AI
  const totalRolls = bundleCount * rollsPerBundle;
  const totalLabels = totalRolls * labelsPerRoll;
  const totalPrice = (bundleCount * priceCents) / 100;

  // Fetch user profile and order history on mount
  useEffect(() => {
    fetchOrders();
    const storedId = localStorage?.getItem('userid');
    if (storedId) setUserId(storedId);
    if (storedId) {
      fetch(`/api/profile?user_id=${storedId}`)
        .then(res => res.json())
        .then(data => {
          const p = data.profile || {};
          setAddress1(p.address_line1 || '');
          setAddress2(p.address_line2 || '');
          setCity(p.city || '');
          setState(p.state || '');
          setCountry(p.country || '');
          setPostalCode(p.postal_code || '');
          setPhone(p.phone || '');
          setEmail(p.email || '');
        })
        .catch(() => {});
      // Fetch print logs and calculate average labels per day
      setLabelsPerDayLoading(true);
      setLabelsPerDayError(null);
      fetch('/api/logs', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
      })
        .then(res => res.json())
        .then(data => {
          if (!data.logs || !Array.isArray(data.logs)) throw new Error('No logs');
          // Filter for print_label actions
          const printLogs = data.logs.filter((log: any) => log.action === 'print_label');
          if (printLogs.length === 0) {
            setLabelsPerDay(0); // no data, set to 0
            setLabelsPerDayLoading(false);
            return;
          }
          // Aggregate by date
          const usageByDate: Record<string, number> = {};
          printLogs.forEach((log: any) => {
            const date = new Date(log.timestamp).toISOString().split('T')[0];
            const qty = Number(log.details?.quantity) || 1;
            usageByDate[date] = (usageByDate[date] || 0) + qty;
          });
          // Get last 30 days
          const allDates = Object.keys(usageByDate).sort();
          const last30Dates = allDates.slice(-30);
          const total = last30Dates.reduce((sum, date) => sum + usageByDate[date], 0);
          const avg = last30Dates.length > 0 ? total / last30Dates.length : 0;
          setLabelsPerDay(Math.round(avg));
          setLabelsPerDayLoading(false);
        })
        .catch(err => {
          setLabelsPerDay(0);
          setLabelsPerDayLoading(false);
          setLabelsPerDayError('Could not load usage data');
        });
    }
  }, []);

  useEffect(() => {
    fetch('/api/label-products', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    })
      .then(res => res.json())
      .then(data => setLabelProducts(Array.isArray(data) ? data.map(p => ({ ...p, price_cents: p.price_cents ?? p.price })) : []))
      .catch(() => setLabelProducts([]));
  }, []);

  const [showAISuggestion, setShowAISuggestion] = useState(false);

  const fetchOrders = (): void => {
    const token = localStorage?.getItem('token');
    setFetchingOrders(true);
    fetch('/api/label-orders', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
    })
      .then(res => res.json())
      .then((data: { orders?: Order[] }) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setFetchingOrders(false));
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone: string) => phone === '' || /^\+?\d{7,15}$/.test(phone.replace(/[^\d+]/g, ''))

  const handleOrder = async () => {
    if (!address1 || !city || !country || !email) {
      setError('Please fill in all required fields');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePhone(phone)) {
      setError('Please enter a valid phone number (digits only, 7-15 digits, optional +).');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    // Combine address fields into a single string
    const shippingAddress = [
      address1,
      address2,
      city,
      state,
      country,
      postalCode ? `Postal Code: ${postalCode}` : '',
      phone ? `Phone: ${phone}` : '',
      email ? `Email: ${email}` : '',
    ]
      .filter(Boolean)
      .join(', ');
    
    try {
      const token = localStorage?.getItem('token');
      const res = await fetch('/api/label-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ bundle_count: bundleCount, shipping_address: shippingAddress, label_product_id: selectedProductId ?? labelProducts[0]?.id }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        setError(data.error || 'Failed to create order');
      }
    }catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    }
    finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'shipped':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'paid':
        return <Clock className="w-4 h-4 text-purple-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'shipped':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'paid':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Label Orders</h1>
            <p className="text-gray-600">Order shipping labels and manage your inventory</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                New Order
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Duration Picker and AI Suggestion */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  How long should this order last?
                </label>
                <div className="flex items-center gap-2 mb-2">
                  {durationOptions.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      className={`px-3 py-1 rounded-lg border text-sm font-medium ${days === opt ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-300'}`}
                      onClick={() => { setDays(opt); setCustomDays(null); setShowAISuggestion(false); }}
                    >
                      {opt} days
                    </button>
                  ))}
                  <input
                    type="number"
                    min={1}
                    placeholder="Custom"
                    value={customDays !== null ? customDays : ''}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setCustomDays(val);
                      setDays(val);
                      setShowAISuggestion(false);
                    }}
                    className="w-20 px-2 py-1 border rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    className="ml-4 px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold text-sm hover:bg-purple-600 transition"
                    onClick={() => { refetch(); setShowAISuggestion(true); }}
                    disabled={aiLoading}
                  >
                    {aiLoading ? 'Getting AI Suggestion...' : 'Get AI Suggestion'}
                  </button>
                </div>
                {/* Show calculated average labels per day */}
                <div className="mb-2 text-xs text-purple-700">
                  {labelsPerDayLoading ? (
                    <span>Loading your average label usage...</span>
                  ) : labelsPerDayError ? (
                    <span className="text-red-600">{labelsPerDayError}</span>
                  ) : labelsPerDay === 0 ? (
                    <span className="text-purple-700">You have not printed any labels yet. Need more data to analyze.</span>
                  ) : (
                    <span>Based on your history, you print <span className="font-bold">{labelsPerDay}</span> labels per day (avg, last 30 days).</span>
                  )}
                </div>
                {/* AI Suggestion Box */}
                {showAISuggestion && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <div className="font-semibold text-purple-900 mb-1">AI Recommendation</div>
                    <div className="text-xs text-purple-700 mb-2">AI considers your real usage patterns (weekends, trends, etc.)</div>
                    {aiLoading ? (
                      <div className="text-purple-600 animate-pulse">Loading AI suggestion...</div>
                    ) : aiError ? (
                      <div className="text-red-600">{aiError}</div>
                    ) : suggestion ? (
                      <div className="whitespace-pre-line text-purple-900">{suggestion}</div>
                    ) : (
                      <div className="text-gray-500">No suggestion yet.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Product dropdown and bundle quantity side by side */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Label Product</label>
                  <select
                    value={selectedProductId ?? labelProducts[0]?.id}
                    onChange={e => setSelectedProductId(Number(e.target.value))}
                    className="block w-full px-3 py-2 border border-purple-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm font-medium bg-white text-gray-900"
                  >
                    {labelProducts.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (£{((p.price_cents ?? 0) / 100).toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Bundle Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={bundleCount}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBundleCount(Number(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center font-medium"
                    style={{ MozAppearance: 'textfield' } as React.CSSProperties}
                    inputMode="numeric"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Shipping Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={address1}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress1(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                      placeholder="Street address"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={address2}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress2(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Apartment, suite, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPostalCode(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Error/Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-green-700">{success}</div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleOrder}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ${totalPrice.toFixed(2)} & Order
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: label product cards above order summary */}
        <div className="space-y-6">
          {labelProducts.length > 0 && (
            <div className="mb-2">
              <h2 className="text-md font-semibold text-purple-900 mb-2">Available Label Products</h2>
              <div className="flex flex-col gap-3">
                {labelProducts.map((p) => (
                  <div key={p.id} className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm min-w-[180px] max-w-xs">
                    <div className="font-bold text-purple-800 text-base mb-1">{p.name}</div>
                    <div className="text-purple-700 text-sm mb-1">£{((p.price_cents ?? 0) / 100).toFixed(2)}</div>
                    <div className="text-xs text-purple-600">{p.rolls_per_bundle} rolls/bundle</div>
                    <div className="text-xs text-purple-600">{p.labels_per_roll} labels/roll</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bundles</span>
                <span className="font-medium">{bundleCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Labels</span>
                <span className="font-medium">{totalLabels}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price per bundle</span>
                <span className="font-medium">${(priceCents / 100).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-purple-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <h4 className="font-semibold text-purple-900 mb-2">What you'll receive</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• High-quality shipping labels</li>
              <li>• Fast processing & shipping</li>
              <li>• Email confirmation & tracking</li>
              <li>• Bulk discount pricing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Order History
            </h2>
            <button
              type="button"
              onClick={fetchOrders}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              disabled={fetchingOrders}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${fetchingOrders ? 'animate-spin' : ''}`} />
              {fetchingOrders ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipped</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length === 0 && !fetchingOrders && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-sm">No orders yet</p>
                      <p className="text-gray-400 text-xs">Your order history will appear here</p>
                    </div>
                  </td>
                </tr>
              )}
              {fetchingOrders && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-gray-400 animate-spin mr-2" />
                      <span className="text-gray-500 text-sm">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              )}
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.bundle_count} bundles</div>
                    <div className="text-xs text-gray-500">{order.label_count} labels</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${(order.amount_cents / 100).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1.5 capitalize">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.created_at ? (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.shipped_at ? (
                      <div className="flex items-center">
                        <Truck className="w-4 h-4 mr-1" />
                        {new Date(order.shipped_at).toLocaleDateString()}
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.status === 'paid' && order.receipt_url ? (
                      <a 
                        href={order.receipt_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}