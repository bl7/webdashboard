"use client"
import React, { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useDarkMode } from "../context/DarkModeContext";
import { Copy, Loader2, Search, CheckCircle2, XCircle, Info } from "lucide-react";

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Shipped", value: "shipped" },
];

function statusBadge(status: string) {
  switch (status) {
    case "shipped":
      return <Badge className="bg-green-600 text-white">Shipped</Badge>;
    case "paid":
      return <Badge className="bg-blue-600 text-white">Paid</Badge>;
    case "pending":
    default:
      return <Badge className="bg-gray-400 text-white">Pending</Badge>;
  }
}

export default function BossOrdersPage() {
  const { isDarkMode } = useDarkMode();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [markingId, setMarkingId] = useState<number | null>(null);
  const [confirmShip, setConfirmShip] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("bossToken");
      const res = await fetch("/api/label-orders/all", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(
        (o) =>
          String(o.id).includes(s) ||
          (o.full_name && o.full_name.toLowerCase().includes(s)) ||
          (o.email && o.email.toLowerCase().includes(s))
      );
    }
    return filtered;
  }, [orders, statusFilter, search]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, page]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  const handleMarkAsShipped = async (orderId: number) => {
    setMarkingId(orderId);
    setConfirmShip(false);
    try {
      const token = localStorage.getItem("bossToken");
      const res = await fetch(`/api/label-orders/${orderId}/ship`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        fetchOrders();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to mark as shipped");
      }
    } catch (err: any) {
      setError(err.message || "Failed to mark as shipped");
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-bold mb-6">All Label Orders</h2>
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="flex gap-2 items-center">
          <span>Status:</span>
          <select
            className={`rounded border px-2 py-1 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 flex gap-2 items-center">
          <div className="relative w-full md:w-72">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="h-4 w-4" />
            </span>
            <Input
              className={`pl-8 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
              placeholder="Search by user, email, or order #"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded shadow border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className={`sticky top-0 z-10 ${isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}>
            <tr>
              <th className="p-2 border">Order #</th>
              <th className="p-2 border">Label Ordered</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Bundles</th>
              <th className="p-2 border">Labels</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Shipping Address</th>
              <th className="p-2 border">Ordered</th>
              <th className="p-2 border">Paid</th>
              <th className="p-2 border">Shipped</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 12 }).map((_, j) => (
                    <td key={j} className="p-2 border">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedOrders.length === 0 ? (
              <tr><td colSpan={12} className="text-center p-4">No orders found.</td></tr>
            ) : (
              paginatedOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <td className="p-2 border font-mono" onClick={() => { setSelectedOrder(order); setShowDetails(true); }}>{order.id}</td>
                  <td className="p-2 border" onClick={() => { setSelectedOrder(order); setShowDetails(true); }}>{order.product_name || <span className="text-gray-400">N/A</span>}</td>
                  <td className="p-2 border" onClick={() => { setSelectedOrder(order); setShowDetails(true); }}>{order.full_name || <span className="text-gray-400">N/A</span>}</td>
                  <td className="p-2 border" onClick={() => { setSelectedOrder(order); setShowDetails(true); }}>{order.email || <span className="text-gray-400">N/A</span>}</td>
                  <td className="p-2 border text-center">{order.bundle_count}</td>
                  <td className="p-2 border text-center">{order.label_count}</td>
                  <td className="p-2 border">${(order.amount_cents / 100).toFixed(2)}</td>
                  <td className="p-2 border">{statusBadge(order.status)}</td>
                  <td className="p-2 border whitespace-pre-line break-words max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="whitespace-pre-line break-words">{order.shipping_address}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1"
                        onClick={e => { e.stopPropagation(); handleCopy(order.shipping_address, order.id); }}
                        title="Copy address"
                      >
                        {copiedId === order.id ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </td>
                  <td className="p-2 border">{order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}</td>
                  <td className="p-2 border">{order.paid_at ? new Date(order.paid_at).toLocaleDateString() : "-"}</td>
                  <td className="p-2 border">{order.shipped_at ? new Date(order.shipped_at).toLocaleDateString() : "-"}</td>
                  <td className="p-2 border">
                    {order.status === "paid" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={markingId === order.id}
                        onClick={e => { e.stopPropagation(); setSelectedOrder(order); setConfirmShip(true); }}
                      >
                        {markingId === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mark as Shipped"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <span>Page {page} of {totalPages}</span>
          <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-500">
          <XCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}
      {/* Order Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Full information for order #{selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-2">
              <div><b>User:</b> {selectedOrder.full_name || "N/A"} ({selectedOrder.email || "N/A"})</div>
              <div><b>Bundles:</b> {selectedOrder.bundle_count}</div>
              <div><b>Labels:</b> {selectedOrder.label_count}</div>
              <div><b>Amount:</b> ${(selectedOrder.amount_cents / 100).toFixed(2)}</div>
              <div><b>Status:</b> {statusBadge(selectedOrder.status)}</div>
              <div><b>Shipping Address:</b> <span className="whitespace-pre-line break-words">{selectedOrder.shipping_address}</span></div>
              <div><b>Ordered:</b> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : ""}</div>
              <div><b>Paid:</b> {selectedOrder.paid_at ? new Date(selectedOrder.paid_at).toLocaleString() : "-"}</div>
              <div><b>Shipped:</b> {selectedOrder.shipped_at ? new Date(selectedOrder.shipped_at).toLocaleString() : "-"}</div>
              <div><b>Label Ordered:</b> {selectedOrder.product_name} (£{(selectedOrder.product_price_cents/100).toFixed(2)})</div>
              <div><b>Rolls per bundle:</b> {selectedOrder.rolls_per_bundle}</div>
              <div><b>Labels per roll:</b> {selectedOrder.labels_per_roll}</div>
              {selectedOrder.stripe_payment_intent_id && (
                <div><b>Stripe Payment:</b> <a href={`https://dashboard.stripe.com/payments/${selectedOrder.stripe_payment_intent_id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View in Stripe</a></div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirm Mark as Shipped Dialog */}
      <Dialog open={confirmShip} onOpenChange={setConfirmShip}>
        <DialogContent className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
          <DialogHeader>
            <DialogTitle>Mark as Shipped?</DialogTitle>
            <DialogDescription>Are you sure you want to mark order #{selectedOrder?.id} as shipped?</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Button variant="destructive" onClick={() => handleMarkAsShipped(selectedOrder.id)} disabled={markingId === selectedOrder?.id}>
              {markingId === selectedOrder?.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, Mark as Shipped"}
            </Button>
            <Button variant="outline" onClick={() => setConfirmShip(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 