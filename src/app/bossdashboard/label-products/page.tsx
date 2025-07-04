"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { useDarkMode } from '../context/DarkModeContext';
import { AlertCircle, CheckCircle } from "lucide-react";

interface LabelProduct {
  id: number;
  name: string;
  price_cents: number;
  rolls_per_bundle: number;
  labels_per_roll: number;
}

export default function LabelProductsPage() {
  const { isDarkMode } = useDarkMode();
  const [products, setProducts] = useState<LabelProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [editProduct, setEditProduct] = useState<LabelProduct | null>(null);
  const [form, setForm] = useState<Partial<LabelProduct>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/label-products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch label products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm({});
    setShowDialog(true);
  };
  const openEdit = (product: LabelProduct) => {
    setEditProduct(product);
    setForm(product);
    setShowDialog(true);
  };
  const closeDialog = () => {
    setShowDialog(false);
    setForm({});
    setEditProduct(null);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    const method = editProduct ? "PUT" : "POST";
    const body = editProduct ? { ...form, id: editProduct.id } : form;
    try {
      const res = await fetch("/api/label-products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: editProduct ? 'Product updated!' : 'Product added!' });
        closeDialog();
        fetchProducts();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to save product.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error.' });
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this label product?")) return;
    setFeedback(null);
    setSaving(true);
    try {
      const res = await fetch("/api/label-products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Product deleted!' });
        fetchProducts();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to delete product.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Network error.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Feedback message */}
      {feedback && (
        <div className={`mb-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium border ${feedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}` + (isDarkMode ? (feedback.type === 'success' ? ' dark:bg-green-900 dark:border-green-700 dark:text-green-200' : ' dark:bg-red-900 dark:border-red-700 dark:text-red-200') : '')}>
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
          {feedback.message}
        </div>
      )}
      <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={isDarkMode ? 'text-white' : ''}>Label Products</CardTitle>
          <Button className="ml-auto" onClick={openAdd}>Add Product</Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className={isDarkMode ? 'text-gray-200' : ''}>Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <Table className={isDarkMode ? 'bg-gray-900 text-white' : ''}>
              <TableHeader className={isDarkMode ? 'bg-gray-800' : ''}>
                <TableRow>
                  <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Name</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Price</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Rolls/Bundle</TableHead>
                  <TableHead className={isDarkMode ? 'text-gray-300' : ''}>Labels/Roll</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>£{(p.price_cents / 100).toFixed(2)}</TableCell>
                    <TableCell>{p.rolls_per_bundle}</TableCell>
                    <TableCell>{p.labels_per_roll}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => openEdit(p)}>Edit</Button>
                      <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDelete(p.id)} disabled={saving}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 text-white' : ''}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : ''}>{editProduct ? "Edit Label Product" : "Add Label Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input name="name" placeholder="Name" value={form.name || ""} onChange={handleChange} className={isDarkMode ? 'bg-gray-900 text-white border-gray-700' : ''} />
            <Input name="price_cents" type="number" placeholder="Price (pence)" value={form.price_cents || ""} onChange={handleChange} className={isDarkMode ? 'bg-gray-900 text-white border-gray-700' : ''} />
            <Input name="rolls_per_bundle" type="number" placeholder="Rolls per bundle" value={form.rolls_per_bundle || ""} onChange={handleChange} className={isDarkMode ? 'bg-gray-900 text-white border-gray-700' : ''} />
            <Input name="labels_per_roll" type="number" placeholder="Labels per roll" value={form.labels_per_roll || ""} onChange={handleChange} className={isDarkMode ? 'bg-gray-900 text-white border-gray-700' : ''} />
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={saving}>{saving ? (editProduct ? "Saving..." : "Adding...") : (editProduct ? "Save Changes" : "Add Product")}</Button>
            <Button variant="outline" onClick={closeDialog} disabled={saving}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 