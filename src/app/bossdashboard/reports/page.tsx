"use client"
import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Download, Users, FileText, BarChart3, AlertTriangle, DollarSign } from "lucide-react"
import * as XLSX from "xlsx"
import { useDarkMode } from "../context/DarkModeContext"

const TABS = [
  { key: "users", label: "Users", icon: Users },
  { key: "subscriptions", label: "Subscriptions", icon: FileText },
  { key: "invoices", label: "Invoices", icon: BarChart3 },
  { key: "cancellations", label: "Cancellations", icon: AlertTriangle },
  { key: "revenue", label: "Revenue", icon: DollarSign },
  { key: "devices", label: "Devices", icon: BarChart3 },
  { key: "label_orders", label: "Label Orders", icon: FileText },
]

const getTableForExport = (tab: string, data: any) => {
  switch (tab) {
    case "users":
      if (!Array.isArray(data)) return { header: [], rows: [] }
      return {
        header: ["User ID", "Company", "Email", "Plan", "Status", "Signup"],
        rows: data.map((u: any) => [u.user_id, u.company_name, u.email, u.plan_name, u.status, u.created_at ? format(new Date(u.created_at), "yyyy-MM-dd") : ""]),
      }
    case "subscriptions":
      if (!data.subscriptions) return { header: [], rows: [] }
      return {
        header: ["User ID", "Company", "Email", "Plan", "Status", "Billing", "Amount", "Signup"],
        rows: data.subscriptions.map((s: any) => [s.user_id, s.company_name, s.email, s.plan_name, s.status, s.billing_interval, s.amount ? `£${(s.amount / 100).toFixed(2)}` : "", s.created_at ? format(new Date(s.created_at), "yyyy-MM-dd") : ""]),
      }
    case "invoices":
      if (!data.invoices) return { header: [], rows: [] }
      return {
        header: ["Invoice ID", "Customer", "Amount", "Status", "Created"],
        rows: data.invoices.map((inv: any) => [inv.id, inv.customer, inv.amount_due ? `£${(inv.amount_due / 100).toFixed(2)}` : "", inv.status, inv.created ? format(new Date(inv.created * 1000), "yyyy-MM-dd") : ""]),
      }
    case "cancellations":
      if (!data.cancellations) return { header: [], rows: [] }
      return {
        header: ["User ID", "Subscription ID", "Reason", "Cancelled At"],
        rows: data.cancellations.map((c: any) => [c.user_id, c.subscription_id, c.reason, c.cancelled_at ? format(new Date(c.cancelled_at), "yyyy-MM-dd HH:mm") : ""]),
      }
    case "revenue":
      if (!data) return { header: [], rows: [] }
      return {
        header: ["MRR", "ARR", "ARPU", "Churn Rate", "Trial Conversion", "Active Subs", "Canceled Subs", "Total Subs"],
        rows: [[
          `£${((data.mrr || 0) / 100).toFixed(2)}`,
          `£${((data.arr || 0) / 100).toFixed(2)}`,
          `£${((data.arpu || 0) / 100).toFixed(2)}`,
          `${((data.churnRate || 0) * 100).toFixed(2)}%`,
          `${((data.trialConversion || 0) * 100).toFixed(2)}%`,
          data.active || 0,
          data.canceled || 0,
          data.total || 0,
        ]],
      }
    case "devices":
      if (!Array.isArray(data)) return { header: [], rows: [] }
      return {
        header: ["Device ID", "User", "Plan", "Type", "Identifier", "Status", "Assigned", "Shipped", "Delivered", "Returned", "Notes"],
        rows: data.map((d: any) => [d.id, d.user_email || d.user_id, d.plan_name || d.plan_id, d.device_type, d.device_identifier, d.status, d.assigned_at, d.shipped_at, d.delivered_at, d.returned_at, d.notes]),
      }
    case "label_orders":
      if (!Array.isArray(data)) return { header: [], rows: [] }
      return {
        header: ["Order ID", "User", "Bundles", "Labels", "Amount", "Status", "Shipping Address", "Created", "Paid", "Shipped"],
        rows: data.map((o: any) => [o.id, o.user_email || o.user_id, o.bundle_count, o.label_count, o.amount_cents ? `£${(o.amount_cents / 100).toFixed(2)}` : '', o.status, o.shipping_address, o.created_at, o.paid_at, o.shipped_at]),
      }
    default:
      return { header: [], rows: [] }
  }
}

const ReportsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode()
  const [activeTab, setActiveTab] = useState("users")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)
  const [deviceData, setDeviceData] = useState<any>([])
  const [labelOrderData, setLabelOrderData] = useState<any>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    if (!dateFrom || !dateTo) return
    setLoading(true)
    setError(null)
    let url = ""
    switch (activeTab) {
      case "users":
        url = `/api/subscription_better/users` // No date filter for users
        break
      case "subscriptions":
        url = `/api/subscription_better?date_from=${dateFrom}&date_to=${dateTo}`
        break
      case "invoices":
        url = `/api/subscription_better/invoices?date_from=${dateFrom}&date_to=${dateTo}`
        break
      case "cancellations":
        url = `/api/subscription_better/cancel?date_from=${dateFrom}&date_to=${dateTo}`
        break
      case "revenue":
        url = `/api/subscription_better/analytics?date_from=${dateFrom}&date_to=${dateTo}`
        break
      default:
        break
    }
    if (!url) return
    const bossToken = typeof window !== 'undefined' ? localStorage.getItem('bossToken') : null;
    fetch(url, {
      headers: bossToken ? { 'Authorization': `Bearer ${bossToken}` } : {}
    })
      .then(res => res.json())
      .then(setData)
      .catch(() => setError("Failed to fetch data"))
      .finally(() => setLoading(false))
  }, [activeTab, dateFrom, dateTo])

  useEffect(() => {
    if (activeTab === 'devices') {
      setLoading(true)
      const bossToken = typeof window !== 'undefined' ? localStorage.getItem('bossToken') : null;
      fetch('/api/devices', {
        headers: bossToken ? { 'Authorization': `Bearer ${bossToken}` } : {}
      })
        .then(res => res.json())
        .then(data => setDeviceData(data.devices || []))
        .catch(() => setError('Failed to fetch devices'))
        .finally(() => setLoading(false))
    } else if (activeTab === 'label_orders') {
      setLoading(true)
      const bossToken = typeof window !== 'undefined' ? localStorage.getItem('bossToken') : null;
      fetch('/api/label-orders/all', {
        headers: bossToken ? { 'Authorization': `Bearer ${bossToken}` } : {}
      })
        .then(res => res.json())
        .then(data => setLabelOrderData(data.orders || []))
        .catch(() => setError('Failed to fetch label orders'))
        .finally(() => setLoading(false))
    }
  }, [activeTab])

  // Reset page on tab/filter/search change
  useEffect(() => { setPage(1) }, [activeTab, search, statusFilter, dateFrom, dateTo])

  // Download logic for CSV, Excel, PDF
  const handleDownload = (type: string, format: string) => {
    let exportData = data
    if (type === 'devices') exportData = deviceData
    if (type === 'label_orders') exportData = labelOrderData
    const { header, rows } = getTableForExport(type, exportData)
    if (!header.length || !rows.length) return
    if (format === "csv") {
      // CSV
      const csv = [header.join(",")].concat(rows.map((r: any[]) => r.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(","))).join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}-report.csv`
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === "excel") {
      // Excel
      const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Report")
      XLSX.writeFile(wb, `${type}-report.xlsx`)
    }
  }

  // Render tables for each report type
  const renderSection = () => {
    if (!dateFrom || !dateTo) {
      return <div className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Select a date range to view reports.</div>
    }
    if (loading) return <div className={isDarkMode ? "text-gray-400" : ""}>Loading...</div>
    if (error) return <div className={isDarkMode ? "text-red-400" : "text-red-500"}>{error}</div>
    if (!data) return null
    switch (activeTab) {
      case "users":
        if (!Array.isArray(data)) return null
        const paginatedUsers = data.slice((page - 1) * pageSize, page * pageSize)
        return (
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>User Report</h2>
            <div className={`overflow-x-auto rounded p-2 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <table className="min-w-full text-xs">
                <thead>
                  <tr className={isDarkMode ? "bg-gray-700" : ""}>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>User ID</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Company</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Email</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Plan</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Status</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Signup</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((u: any) => (
                    <tr key={u.user_id} className={isDarkMode ? "border-b border-gray-700 hover:bg-gray-700" : "hover:bg-gray-50"}>
                      <td className={`px-2 py-1 font-mono ${isDarkMode ? "text-gray-100" : ""}`}>{u.user_id}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{u.company_name}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{u.email}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{u.plan_name}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{u.status}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{u.created_at ? format(new Date(u.created_at), "yyyy-MM-dd") : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.length > pageSize && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span className={isDarkMode ? "text-gray-300" : ""}>Page {page} of {Math.ceil(data.length / pageSize)}</span>
                <Button size="sm" variant="outline" disabled={page === Math.ceil(data.length / pageSize)} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </div>
        )
      case "subscriptions":
        if (!data.subscriptions) return null
        const paginatedSubscriptions = data.subscriptions.slice((page - 1) * pageSize, page * pageSize)
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Subscription Report</h2>
            <div className="overflow-x-auto rounded bg-gray-100 dark:bg-gray-800 p-2">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-1">User ID</th>
                    <th className="px-2 py-1">Company</th>
                    <th className="px-2 py-1">Email</th>
                    <th className="px-2 py-1">Plan</th>
                    <th className="px-2 py-1">Status</th>
                    <th className="px-2 py-1">Billing</th>
                    <th className="px-2 py-1">Amount</th>
                    <th className="px-2 py-1">Signup</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubscriptions.map((s: any) => (
                    <tr key={s.id || s.user_id}>
                      <td className="px-2 py-1 font-mono">{s.user_id}</td>
                      <td className="px-2 py-1">{s.company_name}</td>
                      <td className="px-2 py-1">{s.email}</td>
                      <td className="px-2 py-1">{s.plan_name}</td>
                      <td className="px-2 py-1">{s.status}</td>
                      <td className="px-2 py-1">{s.billing_interval}</td>
                      <td className="px-2 py-1">{s.amount ? `£${(s.amount / 100).toFixed(2)}` : ""}</td>
                      <td className="px-2 py-1">{s.created_at ? format(new Date(s.created_at), "yyyy-MM-dd") : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.subscriptions.length > pageSize && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span>Page {page} of {Math.ceil(data.subscriptions.length / pageSize)}</span>
                <Button size="sm" variant="outline" disabled={page === Math.ceil(data.subscriptions.length / pageSize)} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </div>
        )
      case "invoices":
        if (!data.invoices) return null
        const paginatedInvoices = data.invoices.slice((page - 1) * pageSize, page * pageSize)
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Invoice Report</h2>
            <div className="overflow-x-auto rounded bg-gray-100 dark:bg-gray-800 p-2">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Invoice ID</th>
                    <th className="px-2 py-1">Customer</th>
                    <th className="px-2 py-1">Amount</th>
                    <th className="px-2 py-1">Status</th>
                    <th className="px-2 py-1">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.map((inv: any) => (
                    <tr key={inv.id}>
                      <td className="px-2 py-1 font-mono">{inv.id}</td>
                      <td className="px-2 py-1 font-mono">{inv.customer}</td>
                      <td className="px-2 py-1">{inv.amount_due ? `£${(inv.amount_due / 100).toFixed(2)}` : ""}</td>
                      <td className="px-2 py-1">{inv.status}</td>
                      <td className="px-2 py-1">{inv.created ? format(new Date(inv.created * 1000), "yyyy-MM-dd") : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.invoices.length > pageSize && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span>Page {page} of {Math.ceil(data.invoices.length / pageSize)}</span>
                <Button size="sm" variant="outline" disabled={page === Math.ceil(data.invoices.length / pageSize)} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </div>
        )
      case "cancellations":
        if (!data.cancellations) return null
        const paginatedCancellations = data.cancellations.slice((page - 1) * pageSize, page * pageSize)
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Cancellation Report</h2>
            <div className="overflow-x-auto rounded bg-gray-100 dark:bg-gray-800 p-2">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-1">User ID</th>
                    <th className="px-2 py-1">Subscription ID</th>
                    <th className="px-2 py-1">Reason</th>
                    <th className="px-2 py-1">Cancelled At</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCancellations.map((c: any) => (
                    <tr key={c.id}>
                      <td className="px-2 py-1 font-mono">{c.user_id}</td>
                      <td className="px-2 py-1 font-mono">{c.subscription_id}</td>
                      <td className="px-2 py-1 max-w-xs break-words whitespace-pre-line">{c.reason}</td>
                      <td className="px-2 py-1">{c.cancelled_at ? format(new Date(c.cancelled_at), "yyyy-MM-dd HH:mm") : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.cancellations.length > pageSize && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span>Page {page} of {Math.ceil(data.cancellations.length / pageSize)}</span>
                <Button size="sm" variant="outline" disabled={page === Math.ceil(data.cancellations.length / pageSize)} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </div>
        )
      case "revenue":
        if (!data) return null
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Revenue Report</h2>
            <div className="rounded bg-gray-100 dark:bg-gray-800 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">MRR</div>
                  <div className="text-2xl font-bold">£{((data.mrr || 0) / 100).toFixed(2)}</div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">ARR</div>
                  <div className="text-2xl font-bold">£{((data.arr || 0) / 100).toFixed(2)}</div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">ARPU</div>
                  <div className="text-2xl font-bold">£{((data.arpu || 0) / 100).toFixed(2)}</div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Churn Rate</div>
                  <div className="text-2xl font-bold">{((data.churnRate || 0) * 100).toFixed(2)}%</div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Trial Conversion</div>
                  <div className="text-2xl font-bold">{((data.trialConversion || 0) * 100).toFixed(2)}%</div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Active Subs</div>
                  <div className="text-2xl font-bold">{data.active || 0}</div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Canceled Subs</div>
                  <div className="text-2xl font-bold">{data.canceled || 0}</div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Subs</div>
                  <div className="text-2xl font-bold">{data.total || 0}</div>
                </div>
              </div>
            </div>
          </div>
        )
      case "devices":
        if (!deviceData.length) return <div className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No device data.</div>
        const paginatedDevices = deviceData.slice((page - 1) * pageSize, page * pageSize)
        return (
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Device Report</h2>
            <div className="flex gap-4 mb-4">
              <input
                className={`border rounded px-2 py-1 ${isDarkMode ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white border-gray-300 text-gray-900"}`}
                placeholder="Search by user, plan, device, ..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className={`border rounded px-2 py-1 ${isDarkMode ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white border-gray-300 text-gray-900"}`}
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {Array.from(new Set(deviceData.map((d: any) => d.status))).map(s => (
                  <option key={String(s)} value={String(s)}>{String(s)}</option>
                ))}
              </select>
            </div>
            <div className={`overflow-x-auto rounded p-2 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <table className="min-w-full text-xs">
                <thead>
                  <tr className={isDarkMode ? "bg-gray-700" : ""}>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Device ID</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>User</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Plan</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Type</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Identifier</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Status</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Assigned</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Shipped</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Delivered</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Returned</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDevices.filter((d: any) => {
                    const q = search.toLowerCase()
                    const matchesSearch =
                      !q ||
                      (d.user_email && d.user_email.toLowerCase().includes(q)) ||
                      (d.user_id && d.user_id.toLowerCase().includes(q)) ||
                      (d.plan_name && d.plan_name.toLowerCase().includes(q)) ||
                      (d.plan_id && d.plan_id.toString().includes(q)) ||
                      (d.device_type && d.device_type.toLowerCase().includes(q)) ||
                      (d.device_identifier && d.device_identifier.toLowerCase().includes(q))
                    const matchesStatus = !statusFilter || d.status === statusFilter
                    return matchesSearch && matchesStatus
                  }).map((d: any) => (
                    <tr key={d.id} className={isDarkMode ? "border-b border-gray-700 hover:bg-gray-700" : "hover:bg-gray-50"}>
                      <td className={`px-2 py-1 font-mono ${isDarkMode ? "text-gray-100" : ""}`}>{d.id}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{d.user_email || d.user_id}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{d.plan_name || d.plan_id}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{d.device_type}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{d.device_identifier}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{d.status}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{d.assigned_at ? new Date(d.assigned_at).toLocaleDateString() : ''}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{d.shipped_at ? new Date(d.shipped_at).toLocaleDateString() : ''}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{d.delivered_at ? new Date(d.delivered_at).toLocaleDateString() : ''}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{d.returned_at ? new Date(d.returned_at).toLocaleDateString() : ''}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{d.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {deviceData.length > pageSize && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span>Page {page} of {Math.ceil(deviceData.length / pageSize)}</span>
                <Button size="sm" variant="outline" disabled={page === Math.ceil(deviceData.length / pageSize)} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </div>
        )
      case "label_orders":
        if (!labelOrderData.length) return <div className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No label order data.</div>
        const paginatedLabelOrders = labelOrderData.slice((page - 1) * pageSize, page * pageSize)
        return (
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Label Order Report</h2>
            <div className="flex gap-4 mb-4">
              <input
                className={`border rounded px-2 py-1 ${isDarkMode ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white border-gray-300 text-gray-900"}`}
                placeholder="Search by user, status, ..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className={`border rounded px-2 py-1 ${isDarkMode ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white border-gray-300 text-gray-900"}`}
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {Array.from(new Set(labelOrderData.map((o: any) => o.status))).map(s => (
                  <option key={String(s)} value={String(s)}>{String(s)}</option>
                ))}
              </select>
            </div>
            <div className={`overflow-x-auto rounded p-2 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <table className="min-w-full text-xs">
                <thead>
                  <tr className={isDarkMode ? "bg-gray-700" : ""}>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Order ID</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>User</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Bundles</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Labels</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Amount</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Status</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Shipping Address</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Created</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Paid</th>
                    <th className={`px-2 py-1 ${isDarkMode ? "text-gray-300" : ""}`}>Shipped</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLabelOrders.filter((o: any) => {
                    const q = search.toLowerCase()
                    const matchesSearch =
                      !q ||
                      (o.user_email && o.user_email.toLowerCase().includes(q)) ||
                      (o.user_id && o.user_id.toLowerCase().includes(q)) ||
                      (o.status && o.status.toLowerCase().includes(q))
                    const matchesStatus = !statusFilter || o.status === statusFilter
                    return matchesSearch && matchesStatus
                  }).map((o: any) => (
                    <tr key={o.id} className={isDarkMode ? "border-b border-gray-700 hover:bg-gray-700" : "hover:bg-gray-50"}>
                      <td className={`px-2 py-1 font-mono ${isDarkMode ? "text-gray-100" : ""}`}>{o.id}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{o.user_email || o.user_id}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{o.bundle_count}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{o.label_count}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{o.amount_cents ? `£${(o.amount_cents / 100).toFixed(2)}` : ''}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{o.status}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{o.shipping_address}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{o.created_at ? new Date(o.created_at).toLocaleDateString() : ''}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{o.paid_at ? new Date(o.paid_at).toLocaleDateString() : ''}</td>
                      <td className={`px-2 py-1 ${isDarkMode ? "text-gray-100" : ""}`}>{o.shipped_at ? new Date(o.shipped_at).toLocaleDateString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {labelOrderData.length > pageSize && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span>Page {page} of {Math.ceil(labelOrderData.length / pageSize)}</span>
                <Button size="sm" variant="outline" disabled={page === Math.ceil(labelOrderData.length / pageSize)} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={`p-8 min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <h1 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Reports</h1>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map(tab => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? "purple" : "outline"}
            className="flex items-center gap-2"
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>
      {/* Date Range Filter & Download */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <div className="flex gap-2 items-center">
          <label className={`text-sm ${isDarkMode ? "text-gray-300" : ""}`}>From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className={`rounded border px-2 py-1 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
          <label className={`text-sm ${isDarkMode ? "text-gray-300" : ""}`}>To</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className={`rounded border px-2 py-1 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" onClick={() => handleDownload(activeTab, "csv")}> 
            <Download className="h-4 w-4 mr-2" /> Download CSV
          </Button>
          <Button variant="outline" onClick={() => handleDownload(activeTab, "excel")}> 
            <Download className="h-4 w-4 mr-2" /> Download Excel
          </Button>
        </div>
      </div>
      {/* Report Section */}
      {renderSection()}
    </div>
  )
}

export default ReportsPage 