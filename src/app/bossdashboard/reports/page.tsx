"use client"
import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Download, Users, FileText, BarChart3, AlertTriangle, DollarSign, Wallet } from "lucide-react"
import * as XLSX from "xlsx"
import { useDarkMode } from "../context/DarkModeContext"

function formatCancellationStatus(c: {
  cancellation_status?: string
  status_label?: string
  effective_at?: string | null
}): string {
  if (c.cancellation_status === "pending") return "Action required"
  if (c.effective_at) {
    return `${c.status_label || "Cancelled"} · ${format(new Date(c.effective_at), "yyyy-MM-dd HH:mm")}`
  }
  return c.status_label || "—"
}

function formatCancellationRequested(c: {
  requested_at?: string
  cancelled_at?: string
}): string {
  const at = c.requested_at || c.cancelled_at
  return at ? format(new Date(at), "yyyy-MM-dd HH:mm") : ""
}

const TABS = [
  { key: "users", label: "Users", icon: Users },
  { key: "subscriptions", label: "Subscriptions", icon: FileText },
  { key: "invoices", label: "Invoices", icon: BarChart3 },
  { key: "collections", label: "Collections", icon: Wallet },
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
        header: ["Invoice #", "Company", "Email", "Plan", "Description", "Amount", "Status", "Created"],
        rows: data.invoices.map((inv: {
          number?: string
          id: string
          company_name?: string
          email?: string
          plan_name?: string
          description?: string
          amount_cents?: number
          status?: string
          created?: number
        }) => [
          inv.number || inv.id,
          inv.company_name || "",
          inv.email || "",
          inv.plan_name || "",
          inv.description || "",
          inv.amount_cents ? `£${(inv.amount_cents / 100).toFixed(2)}` : "",
          inv.status || "",
          inv.created ? format(new Date(inv.created * 1000), "yyyy-MM-dd") : "",
        ]),
      }
    case "collections": {
      if (!data?.by_customer) return { header: [], rows: [] }
      const fmt = (c: number) => `£${(c / 100).toFixed(2)}`
      const summary = [
        ["Gross Collected", fmt(data.collected_cents || 0)],
        ["Subscriptions", fmt(data.subscription_cents || 0)],
        ["Label Orders", fmt(data.label_orders_cents || 0)],
        ["Refunded", fmt(data.refunded_cents || 0)],
        ["Net Collected", fmt(data.net_cents || 0)],
      ]
      const customerRows = data.by_customer.map((c: {
        company_name?: string
        email?: string
        plan_name?: string
        subscription_cents: number
        label_orders_cents: number
        collected_cents: number
        refunded_cents: number
        net_cents: number
        percent_of_collected: number
        invoice_count: number
        label_order_count: number
        refund_count: number
      }) => [
        c.company_name || "",
        c.email || "",
        c.plan_name || "",
        fmt(c.subscription_cents),
        fmt(c.label_orders_cents),
        fmt(c.collected_cents),
        fmt(c.refunded_cents),
        fmt(c.net_cents),
        `${c.percent_of_collected.toFixed(1)}%`,
        c.invoice_count,
        c.label_order_count,
        c.refund_count,
      ])
      const refundRows = (data.refunds || []).map((r: {
        created: number
        company_name?: string
        email?: string
        amount_cents: number
        reason?: string
        id: string
      }) => [
        format(new Date(r.created * 1000), "yyyy-MM-dd"),
        r.company_name || "",
        r.email || "",
        fmt(r.amount_cents),
        r.reason || "",
        r.id,
      ])
      return {
        header: ["Section", "Value"],
        rows: [
          ...summary,
          [],
          ["--- By Customer ---", ""],
          ["Company", "Email", "Plan", "Subscriptions", "Label Orders", "Collected", "Refunded", "Net", "% of Total", "Invoices", "Orders", "Refunds"],
          ...customerRows,
          [],
          ["--- Refunds ---", ""],
          ["Date", "Company", "Email", "Amount", "Reason", "Refund ID"],
          ...refundRows,
        ],
      }
    }
    case "cancellations":
      if (!data.cancellations) return { header: [], rows: [] }
      return {
        header: ["User ID", "Subscription ID", "Reason", "Status", "Requested"],
        rows: data.cancellations.map((c: any) => [
          c.user_id,
          c.subscription_id,
          c.reason,
          formatCancellationStatus(c),
          formatCancellationRequested(c),
        ]),
      }
    case "revenue":
      if (!data) return { header: [], rows: [] }
      return {
        header: ["MRR", "ARR", "ARPU", "Churn Rate", "Trial Conversion", "Active Subs", "Canceled Subs", "Total Subs"],
        rows: [[
          `£${(data.mrr || 0).toFixed(2)}`,
          `£${(data.arr || 0).toFixed(2)}`,
          `£${(data.arpu || 0).toFixed(2)}`,
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

function inDateRange(value: string | undefined | null, from: string, to: string): boolean {
  if (!value) return false
  const day = value.slice(0, 10)
  return day >= from && day <= to
}

function toDateStr(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Earliest date for "All time" — before first InstaLabel customer/payment */
const ALL_TIME_START = "2020-01-01"

type DatePreset = "this_month" | "this_year" | "last_year" | "all_time"

function getDatePreset(preset: DatePreset) {
  const now = new Date()
  if (preset === "this_month") {
    return { from: toDateStr(new Date(now.getFullYear(), now.getMonth(), 1)), to: toDateStr(now) }
  }
  if (preset === "this_year") {
    return { from: toDateStr(new Date(now.getFullYear(), 0, 1)), to: toDateStr(now) }
  }
  if (preset === "last_year") {
    return {
      from: toDateStr(new Date(now.getFullYear() - 1, 0, 1)),
      to: toDateStr(new Date(now.getFullYear() - 1, 11, 31)),
    }
  }
  return { from: ALL_TIME_START, to: toDateStr(now) }
}

const DATE_PRESETS: { key: DatePreset; label: string }[] = [
  { key: "this_month", label: "This month" },
  { key: "this_year", label: "This year" },
  { key: "last_year", label: "Last year" },
  { key: "all_time", label: "All time" },
]

const defaultRange = getDatePreset("this_month")

const ReportsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("users")
  const [dateFrom, setDateFrom] = useState(defaultRange.from)
  const [dateTo, setDateTo] = useState(defaultRange.to)
  const [datePreset, setDatePreset] = useState<DatePreset | "custom">("this_month")
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
    const tab = searchParams.get("tab")
    if (tab && TABS.some((t) => t.key === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    if (!dateFrom || !dateTo) return
    setLoading(true)
    setError(null)
    setData(null)
    let url = ""
    switch (activeTab) {
      case "users":
        url = `/api/subscription_better/users?date_from=${dateFrom}&date_to=${dateTo}`
        break
      case "subscriptions":
        url = `/api/subscription_better?date_from=${dateFrom}&date_to=${dateTo}`
        break
      case "invoices":
        url = `/api/subscription_better/invoices?date_from=${dateFrom}&date_to=${dateTo}`
        break
      case "collections":
        url = `/api/subscription_better/collections?date_from=${dateFrom}&date_to=${dateTo}`
        break
      case "cancellations":
        url = `/api/subscription_better/cancel?date_from=${dateFrom}&date_to=${dateTo}&page=1&pageSize=1000`
        break
      case "revenue":
        url = `/api/subscription_better/analytics?date_from=${dateFrom}&date_to=${dateTo}`
        break
      default:
        break
    }
    if (!url) {
      setLoading(false)
      return
    }
    const bossToken = typeof window !== 'undefined' ? localStorage.getItem('bossToken') : null;
    fetch(url, {
      headers: bossToken ? { 'Authorization': `Bearer ${bossToken}` } : {}
    })
      .then(res => res.json())
      .then(json => {
        if (json.error && activeTab === "invoices" && !json.invoices?.length) {
          setError(json.error)
        }
        if (json.error && activeTab === "collections") {
          setError(json.error)
        }
        setData(json)
      })
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
    if (!data && !["devices", "label_orders"].includes(activeTab)) return null
    switch (activeTab) {
      case "users":
        if (!Array.isArray(data)) return null
        const paginatedUsers = data.slice((page - 1) * pageSize, page * pageSize)
        return (
          <div>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              User Report <span className="text-sm font-normal text-muted-foreground">({dateFrom} to {dateTo})</span>
            </h2>
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
        const invoices = data.invoices ?? []
        const paginatedInvoices = invoices.slice((page - 1) * pageSize, page * pageSize)
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Invoice Report <span className="text-sm font-normal text-muted-foreground">({dateFrom} to {dateTo})</span>
            </h2>
            {invoices.length === 0 ? (
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                No invoices found for this date range.
              </p>
            ) : (
            <div className="overflow-x-auto rounded bg-gray-100 dark:bg-gray-800 p-2">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Invoice #</th>
                    <th className="px-2 py-1">Company</th>
                    <th className="px-2 py-1">Email</th>
                    <th className="px-2 py-1">Plan</th>
                    <th className="px-2 py-1">Description</th>
                    <th className="px-2 py-1">Amount</th>
                    <th className="px-2 py-1">Status</th>
                    <th className="px-2 py-1">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.map((inv: {
                    id: string
                    number?: string
                    company_name?: string
                    email?: string
                    plan_name?: string
                    description?: string
                    amount_cents?: number
                    status?: string
                    created?: number
                  }) => (
                    <tr key={inv.id}>
                      <td className="px-2 py-1 font-mono">{inv.number || inv.id}</td>
                      <td className="px-2 py-1">{inv.company_name || "—"}</td>
                      <td className="px-2 py-1">{inv.email || "—"}</td>
                      <td className="px-2 py-1">{inv.plan_name || "—"}</td>
                      <td className="max-w-[200px] truncate px-2 py-1" title={inv.description || ""}>
                        {inv.description || "—"}
                      </td>
                      <td className="px-2 py-1">
                        {inv.amount_cents != null ? `£${(inv.amount_cents / 100).toFixed(2)}` : "—"}
                      </td>
                      <td className="px-2 py-1 capitalize">{inv.status || "—"}</td>
                      <td className="px-2 py-1">
                        {inv.created ? format(new Date(inv.created * 1000), "yyyy-MM-dd") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
            {invoices.length > pageSize && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span>Page {page} of {Math.ceil(invoices.length / pageSize)}</span>
                <Button size="sm" variant="outline" disabled={page === Math.ceil(invoices.length / pageSize)} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </div>
        )
      case "collections": {
        const fmt = (c: number) => `£${((c || 0) / 100).toFixed(2)}`
        const customers = (data.by_customer || []) as {
          company_name?: string
          email?: string
          plan_name?: string
          subscription_cents: number
          label_orders_cents: number
          collected_cents: number
          refunded_cents: number
          net_cents: number
          percent_of_collected: number
          invoice_count: number
          label_order_count: number
          refund_count: number
        }[]
        const refunds = (data.refunds || []) as {
          id: string
          created: number
          company_name?: string
          email?: string
          amount_cents: number
          reason?: string
        }[]
        const q = search.toLowerCase()
        const filteredCustomers = customers.filter((c) => {
          if (!q) return true
          return (
            (c.company_name && c.company_name.toLowerCase().includes(q)) ||
            (c.email && c.email.toLowerCase().includes(q))
          )
        })
        const paginatedCustomers = filteredCustomers.slice((page - 1) * pageSize, page * pageSize)
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Collections Report{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({dateFrom} to {dateTo})
                </span>
              </h2>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Cash collected and refunded in this period (by payment / refund date). For recurring
                subscription metrics, see{" "}
                <a href="/bossdashboard/analytics" className="text-primary hover:underline">
                  Analytics
                </a>
                .
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Gross Collected</div>
                  <div className="text-2xl font-bold">{fmt(data.collected_cents)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {(data.invoice_count || 0) + (data.label_order_count || 0)} payments
                  </div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Subscriptions</div>
                  <div className="text-2xl font-bold">{fmt(data.subscription_cents)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {data.invoice_count || 0} invoices
                  </div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow border border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Label Orders</div>
                  <div className="text-2xl font-bold">{fmt(data.label_orders_cents)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {data.label_order_count || 0} orders
                  </div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow border border-red-200 dark:border-red-900">
                  <div className="text-sm text-red-600 dark:text-red-400">Refunded</div>
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {fmt(data.refunded_cents)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {data.refund_count || 0} refunds
                  </div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow border border-primary/30">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Net Collected</div>
                  <div className="text-2xl font-bold text-primary">{fmt(data.net_cents)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Collected minus refunded</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">By customer</h3>
              <div className="flex gap-4 mb-4">
                <input
                  className={`border rounded px-2 py-1 ${isDarkMode ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white border-gray-300 text-gray-900"}`}
                  placeholder="Search by company or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {filteredCustomers.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No collections in this period.
                </p>
              ) : (
                <div className="overflow-x-auto rounded bg-gray-100 dark:bg-gray-800 p-2">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 text-left">Company</th>
                        <th className="px-2 py-1 text-left">Email</th>
                        <th className="px-2 py-1 text-left">Plan</th>
                        <th className="px-2 py-1 text-right">Subscriptions</th>
                        <th className="px-2 py-1 text-right">Label Orders</th>
                        <th className="px-2 py-1 text-right">Collected</th>
                        <th className="px-2 py-1 text-right">Refunded</th>
                        <th className="px-2 py-1 text-right">Net</th>
                        <th className="px-2 py-1 text-right">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCustomers.map((c, i) => (
                        <tr key={i}>
                          <td className="px-2 py-1">{c.company_name || "—"}</td>
                          <td className="px-2 py-1">{c.email || "—"}</td>
                          <td className="px-2 py-1">{c.plan_name || "—"}</td>
                          <td className="px-2 py-1 text-right">{fmt(c.subscription_cents)}</td>
                          <td className="px-2 py-1 text-right">{fmt(c.label_orders_cents)}</td>
                          <td className="px-2 py-1 text-right font-medium">{fmt(c.collected_cents)}</td>
                          <td className="px-2 py-1 text-right text-red-600 dark:text-red-400">
                            {c.refunded_cents > 0 ? fmt(c.refunded_cents) : "—"}
                          </td>
                          <td className="px-2 py-1 text-right font-medium">{fmt(c.net_cents)}</td>
                          <td className="px-2 py-1 text-right">
                            {c.percent_of_collected.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {filteredCustomers.length > pageSize && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                  <span>Page {page} of {Math.ceil(filteredCustomers.length / pageSize)}</span>
                  <Button size="sm" variant="outline" disabled={page === Math.ceil(filteredCustomers.length / pageSize)} onClick={() => setPage(page + 1)}>Next</Button>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Refunds in period</h3>
              {refunds.length === 0 ? (
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No refunds in this period.
                </p>
              ) : (
                <div className="overflow-x-auto rounded bg-gray-100 dark:bg-gray-800 p-2">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 text-left">Date</th>
                        <th className="px-2 py-1 text-left">Company</th>
                        <th className="px-2 py-1 text-left">Email</th>
                        <th className="px-2 py-1 text-right">Amount</th>
                        <th className="px-2 py-1 text-left">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {refunds.map((r) => (
                        <tr key={r.id}>
                          <td className="px-2 py-1">
                            {format(new Date(r.created * 1000), "yyyy-MM-dd")}
                          </td>
                          <td className="px-2 py-1">{r.company_name || "—"}</td>
                          <td className="px-2 py-1">{r.email || "—"}</td>
                          <td className="px-2 py-1 text-right text-red-600 dark:text-red-400">
                            {fmt(r.amount_cents)}
                          </td>
                          <td className="px-2 py-1 capitalize">{r.reason || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )
      }
      case "cancellations":
        if (!data.cancellations) return null
        const paginatedCancellations = data.cancellations.slice((page - 1) * pageSize, page * pageSize)
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Cancellation Report <span className="text-sm font-normal text-muted-foreground">({dateFrom} to {dateTo})</span>
            </h2>
            <div className="overflow-x-auto rounded bg-gray-100 dark:bg-gray-800 p-2">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    <th className="px-2 py-1">User ID</th>
                    <th className="px-2 py-1">Subscription ID</th>
                    <th className="px-2 py-1">Reason</th>
                    <th className="px-2 py-1">Status</th>
                    <th className="px-2 py-1">Requested</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCancellations.map((c: any) => (
                    <tr key={c.id}>
                      <td className="px-2 py-1 font-mono">{c.user_id}</td>
                      <td className="px-2 py-1 font-mono">{c.subscription_id}</td>
                      <td className="px-2 py-1 max-w-xs break-words whitespace-pre-line">{c.reason}</td>
                      <td className="px-2 py-1">
                        {c.cancellation_status === "pending" ? (
                          <span className="font-medium text-amber-700 dark:text-amber-400">Action required</span>
                        ) : (
                          formatCancellationStatus(c)
                        )}
                      </td>
                      <td className="px-2 py-1">{formatCancellationRequested(c)}</td>
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
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Export summary for the selected date range. For charts and trends, see{" "}
              <a href="/bossdashboard/analytics" className="text-primary hover:underline">Analytics</a>.
            </p>
            <div className="rounded bg-gray-100 dark:bg-gray-800 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">MRR</div>
                  <div className="text-2xl font-bold">£{(data.mrr || 0).toFixed(2)}</div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">ARR</div>
                  <div className="text-2xl font-bold">£{(data.arr || 0).toFixed(2)}</div>
                </div>
                <div className="p-4 rounded bg-white dark:bg-gray-900 shadow">
                  <div className="text-sm text-gray-500 dark:text-gray-400">ARPU</div>
                  <div className="text-2xl font-bold">£{(data.arpu || 0).toFixed(2)}</div>
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
        const filteredDevices = deviceData.filter((d: { assigned_at?: string; created_at?: string }) =>
          inDateRange(d.assigned_at || d.created_at, dateFrom, dateTo)
        )
        const paginatedDevices = filteredDevices.slice((page - 1) * pageSize, page * pageSize)
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
            {filteredDevices.length > pageSize && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span>Page {page} of {Math.ceil(filteredDevices.length / pageSize)}</span>
                <Button size="sm" variant="outline" disabled={page === Math.ceil(filteredDevices.length / pageSize)} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            )}
          </div>
        )
      case "label_orders":
        if (!labelOrderData.length) return <div className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No label order data.</div>
        const filteredLabelOrders = labelOrderData.filter((o: { created_at?: string }) =>
          inDateRange(o.created_at, dateFrom, dateTo)
        )
        const paginatedLabelOrders = filteredLabelOrders.slice((page - 1) * pageSize, page * pageSize)
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
            {filteredLabelOrders.length > pageSize && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
                <span>Page {page} of {Math.ceil(filteredLabelOrders.length / pageSize)}</span>
                <Button size="sm" variant="outline" disabled={page === Math.ceil(filteredLabelOrders.length / pageSize)} onClick={() => setPage(page + 1)}>Next</Button>
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
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {DATE_PRESETS.map((p) => (
            <Button
              key={p.key}
              size="sm"
              variant={datePreset === p.key ? "purple" : "outline"}
              onClick={() => {
                const range = getDatePreset(p.key)
                setDateFrom(range.from)
                setDateTo(range.to)
                setDatePreset(p.key)
              }}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex gap-2 items-center">
          <label className={`text-sm ${isDarkMode ? "text-gray-300" : ""}`}>From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => {
              setDateFrom(e.target.value)
              setDatePreset("custom")
            }}
            className={`rounded border px-2 py-1 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
          <label className={`text-sm ${isDarkMode ? "text-gray-300" : ""}`}>To</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => {
              setDateTo(e.target.value)
              setDatePreset("custom")
            }}
            className={`rounded border px-2 py-1 ${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
          />
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <Button variant="outline" onClick={() => handleDownload(activeTab, "csv")}> 
            <Download className="h-4 w-4 mr-2" /> Download CSV
          </Button>
          <Button variant="outline" onClick={() => handleDownload(activeTab, "excel")}> 
            <Download className="h-4 w-4 mr-2" /> Download Excel
          </Button>
        </div>
        </div>
      </div>
      {/* Report Section */}
      {renderSection()}
    </div>
  )
}

export default ReportsPage 