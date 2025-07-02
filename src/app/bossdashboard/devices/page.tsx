"use client"
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Plus } from "lucide-react"

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  shipped: "Shipped",
  delivered: "Delivered",
  return_requested: "Return Requested",
  returned: "Returned",
  lost: "Lost",
}

function DeviceModal({ open, onClose, onSave, device }: any) {
  const [form, setForm] = useState<any>(device || {})
  useEffect(() => { setForm(device || {}) }, [device, open])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg relative">
        <h2 className="text-lg font-bold mb-4 dark:text-gray-100">{device ? "Edit Device" : "Assign Device"}</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(form) }} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-100">User ID</label>
            <input className="w-full border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" value={form.user_id || ''} onChange={e => setForm((f: any) => ({ ...f, user_id: e.target.value }))} disabled={!!device} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-100">Plan ID</label>
            <input className="w-full border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" value={form.plan_id || ''} onChange={e => setForm((f: any) => ({ ...f, plan_id: e.target.value }))} disabled={!!device} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-100">Device Type</label>
            <input className="w-full border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" value={form.device_type || ''} onChange={e => setForm((f: any) => ({ ...f, device_type: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-100">Device Identifier (MAC/Serial)</label>
            <input className="w-full border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" value={form.device_identifier || ''} onChange={e => setForm((f: any) => ({ ...f, device_identifier: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-100">Status</label>
            <select className="w-full border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" value={form.status || 'pending'} onChange={e => setForm((f: any) => ({ ...f, status: e.target.value }))}>
              {Object.keys(STATUS_LABELS).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-100">Notes</label>
            <textarea className="w-full border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" value={form.notes || ''} onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{device ? "Update" : "Assign"}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<any>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchDevices = async () => {
    setLoading(true)
    const res = await fetch("/api/devices")
    const data = await res.json()
    setDevices(data.devices || [])
    setLoading(false)
  }
  useEffect(() => { fetchDevices() }, [])
  const handleEdit = (device: any) => { setSelectedDevice(device); setModalOpen(true) }
  const handleAdd = () => { setSelectedDevice(null); setModalOpen(true) }
  const handleSave = async (form: any) => {
    if (form.id) {
      await fetch('/api/devices', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch('/api/devices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setModalOpen(false)
    fetchDevices()
  }

  // Filtering and search
  const filtered = devices.filter(device => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      (device.user_email && device.user_email.toLowerCase().includes(q)) ||
      (device.user_id && device.user_id.toLowerCase().includes(q)) ||
      (device.plan_name && device.plan_name.toLowerCase().includes(q)) ||
      (device.plan_id && device.plan_id.toString().includes(q)) ||
      (device.device_type && device.device_type.toLowerCase().includes(q)) ||
      (device.device_identifier && device.device_identifier.toLowerCase().includes(q))
    const matchesStatus = !statusFilter || device.status === statusFilter
    return matchesSearch && matchesStatus
  })
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="p-8 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold dark:text-gray-100">Device Management</h1>
        <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-1" />Assign Device</Button>
      </div>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <input
          className="border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          placeholder="Search by user, plan, device, ..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
        <select
          className="border rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
        >
          <option value="">All Statuses</option>
          {Object.keys(STATUS_LABELS).map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      {modalOpen && <DeviceModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} device={selectedDevice} />}
      {loading ? <div className="dark:text-gray-100">Loading...</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2 border dark:border-gray-700">User</th>
                <th className="p-2 border dark:border-gray-700">Plan</th>
                <th className="p-2 border dark:border-gray-700">Device Type</th>
                <th className="p-2 border dark:border-gray-700">Identifier</th>
                <th className="p-2 border dark:border-gray-700">Status</th>
                <th className="p-2 border dark:border-gray-700">Assigned</th>
                <th className="p-2 border dark:border-gray-700">Shipped</th>
                <th className="p-2 border dark:border-gray-700">Delivered</th>
                <th className="p-2 border dark:border-gray-700">Returned</th>
                <th className="p-2 border dark:border-gray-700">Notes</th>
                <th className="p-2 border dark:border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(device => (
                <tr key={device.id} className="dark:hover:bg-gray-800">
                  <td className="p-2 border dark:border-gray-700">{device.user_email || device.user_id}</td>
                  <td className="p-2 border dark:border-gray-700">{device.plan_name || device.plan_id}</td>
                  <td className="p-2 border dark:border-gray-700">{device.device_type}</td>
                  <td className="p-2 border dark:border-gray-700">{device.device_identifier}</td>
                  <td className="p-2 border dark:border-gray-700">{STATUS_LABELS[device.status] || device.status}</td>
                  <td className="p-2 border dark:border-gray-700">{device.assigned_at ? new Date(device.assigned_at).toLocaleDateString() : '-'}</td>
                  <td className="p-2 border dark:border-gray-700">{device.shipped_at ? new Date(device.shipped_at).toLocaleDateString() : '-'}</td>
                  <td className="p-2 border dark:border-gray-700">{device.delivered_at ? new Date(device.delivered_at).toLocaleDateString() : '-'}</td>
                  <td className="p-2 border dark:border-gray-700">{device.returned_at ? new Date(device.returned_at).toLocaleDateString() : '-'}</td>
                  <td className="p-2 border dark:border-gray-700">{device.notes || '-'}</td>
                  <td className="p-2 border dark:border-gray-700">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(device)}><Edit className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4">
            <span className="dark:text-gray-100">Page {page} of {totalPages || 1}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
              <Button size="sm" variant="outline" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 