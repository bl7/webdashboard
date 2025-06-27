"use client"
import React, { useState, useEffect } from "react";

export default function BossesPage() {
  const [bosses, setBosses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ username: "", email: "", password: "" });
  const pageSize = 5;

  useEffect(() => {
    fetchBosses();
  }, []);

  const fetchBosses = async () => {
    setLoading(true);
    const res = await fetch("/api/bosses");
    const data = await res.json();
    setBosses(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/bosses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ username: "", email: "", password: "" });
    fetchBosses();
  };

  const handleEdit = (boss: any) => {
    setEditId(boss.id);
    setEditForm({ username: boss.username, email: boss.email, password: "" });
  };

  const handleEditSave = async (id: number) => {
    const payload: any = { id, username: editForm.username, email: editForm.email };
    if (editForm.password) payload.password = editForm.password;
    await fetch(`/api/bosses`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setEditId(null);
    fetchBosses();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this boss?")) return;
    await fetch(`/api/bosses`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchBosses();
  };

  const filtered = bosses.filter(
    (b: any) => (
      (typeof b?.email === 'string' && b.email.toLowerCase().includes(search.toLowerCase())) ||
      (typeof b?.username === 'string' && b.username.toLowerCase().includes(search.toLowerCase()))
    )
  );
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add Boss</h1>
      <form onSubmit={handleAdd} className="mb-8 space-y-4 bg-white dark:bg-gray-800 p-4 rounded shadow">
        <input className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
        <input className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
        <input className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
        <button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white px-4 py-2 rounded transition-colors" type="submit">Add Boss</button>
      </form>
      <div className="mb-4 flex items-center">
        <input className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 w-full max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" placeholder="Search bosses..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded shadow">
        <table className="w-full text-sm">
          <thead><tr><th className="text-gray-700 dark:text-gray-200">ID</th><th className="text-gray-700 dark:text-gray-200">Username</th><th className="text-gray-700 dark:text-gray-200">Email</th>{editId && <th className="text-gray-700 dark:text-gray-200">Password</th>}<th></th></tr></thead>
          <tbody>
            {paginated.map((b: any) => (
              <tr key={b.id}>
                <td className="px-2 py-1 text-gray-900 dark:text-gray-100">{b.id}</td>
                <td className="px-2 py-1 text-gray-900 dark:text-gray-100">
                  {editId === b.id ? (
                    <input className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" value={editForm.username} onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))} />
                  ) : (
                    b.username
                  )}
                </td>
                <td className="px-2 py-1 text-gray-900 dark:text-gray-100">
                  {editId === b.id ? (
                    <input className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
                  ) : (
                    b.email
                  )}
                </td>
                {editId === b.id && (
                  <td className="px-2 py-1 text-gray-900 dark:text-gray-100">
                    <input className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" placeholder="New Password (optional)" type="password" value={editForm.password} onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))} />
                  </td>
                )}
                <td className="px-2 py-1 flex gap-2">
                  {editId === b.id ? (
                    <>
                      <button className="bg-green-600 text-white px-2 py-1 rounded" onClick={() => handleEditSave(b.id)}>Save</button>
                      <button className="bg-gray-400 text-white px-2 py-1 rounded" onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="bg-blue-600 text-white px-2 py-1 rounded" onClick={() => handleEdit(b)}>Edit</button>
                      <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(b.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center text-xs p-2">
          <span className="text-gray-700 dark:text-gray-200">Page {page} of {totalPages}</span>
          <div className="space-x-2">
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50">Prev</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
} 