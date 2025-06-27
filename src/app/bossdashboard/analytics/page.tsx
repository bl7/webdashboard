"use client"
import React, { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  DollarSign,
  Users,
  CreditCard,
  AlertCircle,
  Package,
  TrendingUp,
  Calendar,
  LucideIcon,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext" // Adjust path as needed

// Type definitions
interface Subscription {
  user_id: string
  company_name: string
  plan_id: string
  plan_name: string
  status: string
  billing_interval: string
  amount: number
  current_period_end: string | null
  trial_end: string | null
  pending_plan_change: string | null
  pending_plan_change_effective: string | null
  created_at: string
}

interface StatusDistribution {
  name: string
  value: number
  color: string
}

interface PlanDistribution {
  name: string
  value: number
  revenue: number
}

interface MonthlyTrend {
  month: string
  newSubscriptions: number
  revenue: number
  churn: number
}

interface Analytics {
  total: number
  active: number
  trialing: number
  canceled: number
  mrr: number
  arr: number
  arpu: number
  churnRate: number
  trialConversion: number
  planDistribution: { name: string; value: number }[]
  statusDistribution: { name: string; value: number }[]
  recentSignups: Subscription[]
  topCustomers: Subscription[]
  upcomingRenewals: Subscription[]
  pendingChanges: Subscription[]
  failedPayments: Subscription[]
}

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  color?: string
}

interface DarkModeContextType {
  darkMode: boolean
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#845EC2", "#D65DB1"];

function ExpandableCard({ title, columns, data, renderRow, summary, emptyMessage }: any) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const filtered = data.filter((row: any) =>
    columns.some((col: any) => String(row[col.key] || "").toLowerCase().includes(search.toLowerCase()))
  );
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  useEffect(() => { setPage(1); }, [search, data]);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 mb-4">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(v => !v)}>
        <div className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-gray-100">{title} {summary && <span className="text-xs text-gray-400">({summary})</span>}</div>
        {open ? <ChevronUp /> : <ChevronDown />}
      </div>
      {open && (
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 w-full max-w-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-8">{emptyMessage || "No data found."}</div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead><tr>{columns.map((col: any) => <th key={col.key} className="text-left px-2 py-1 uppercase text-xs text-gray-600 dark:text-gray-300">{col.label}</th>)}</tr></thead>
                <tbody>{paginated.map(renderRow)}</tbody>
              </table>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-700 dark:text-gray-300">Page {page} of {totalPages}</span>
                <div className="space-x-2">
                  <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50">Prev</button>
                  <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50">Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const StatCard = ({ title, value, icon: Icon, color = "#0088FE" }: any) => (
  <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-gray-900 shadow p-6 min-w-[180px]">
    <Icon className="mb-2 h-7 w-7" color={color} />
    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
    <div className="text-sm text-gray-500 dark:text-gray-300 mt-1">{title}</div>
  </div>
);

const SubscriptionAnalyticsDashboard: React.FC = () => {
  const { darkMode }: DarkModeContextType = useDarkMode() // Get darkMode from context
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch data from /api/subscription_better/analytics
  useEffect(() => {
    const fetchAnalytics = async (): Promise<void> => {
      try {
        const response = await fetch("/api/subscription_better/analytics")
        const data: Analytics = await response.json()
        console.log("Fetched analytics data:", data)
        setAnalytics(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (loading || !analytics) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} flex items-center justify-center`}
      >
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* Header - Remove this if you have a global header */}
      <div
        className={`${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} border-b px-6 py-4`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Subscription Analytics</h1>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Comprehensive insights into your subscription business
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard
            title="Total Subs"
            value={analytics.total}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Active"
            value={analytics.active}
            icon={TrendingUp}
            color="emerald"
          />
          <StatCard
            title="Trialing"
            value={analytics.trialing}
            icon={Calendar}
            color="indigo"
          />
          <StatCard
            title="Canceled"
            value={analytics.canceled}
            icon={AlertCircle}
            color="red"
          />
        </div>

        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <StatCard
            title="MRR"
            value={formatCurrency(analytics.mrr)}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="ARR"
            value={formatCurrency(analytics.arr)}
            icon={DollarSign}
            color="purple"
          />
          <StatCard
            title="ARPU"
            value={formatCurrency(analytics.arpu)}
            icon={DollarSign}
            color="orange"
          />
          <StatCard
            title="Churn Rate"
            value={`${(analytics.churnRate * 100).toFixed(1)}%`}
            icon={AlertCircle}
            color="red"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Plan Distribution */}
          <div
            className={`rounded-lg border p-6 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}
          >
            <h3 className="mb-4 text-lg font-semibold">Plan Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent?: number }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div
            className={`rounded-lg border p-6 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}
          >
            <h3 className="mb-4 text-lg font-semibold">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                <XAxis dataKey="name" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                    border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Upcoming Renewals */}
          <ExpandableCard
            title="Upcoming Renewals"
            summary={analytics.upcomingRenewals.length}
            columns={[{ label: "User", key: "company_name" }, { label: "Plan", key: "plan_name" }, { label: "Renewal", key: "current_period_end" }]}
            data={analytics.upcomingRenewals}
            renderRow={(row: any) => (
              <tr key={row.user_id}><td className="px-2 py-1">{row.company_name}</td><td className="px-2 py-1">{row.plan_name}</td><td className="px-2 py-1">{row.current_period_end ? new Date(row.current_period_end).toLocaleDateString() : '-'}</td></tr>
            )}
            emptyMessage="No upcoming renewals."
          />

          {/* Pending Plan Changes */}
          <ExpandableCard
            title="Pending Plan Changes"
            summary={analytics.pendingChanges.length}
            columns={[{ label: "User", key: "company_name" }, { label: "From", key: "plan_name" }, { label: "To", key: "pending_plan_change" }, { label: "Effective", key: "pending_plan_change_effective" }]}
            data={analytics.pendingChanges}
            renderRow={(row: any) => (
              <tr key={row.user_id}><td className="px-2 py-1">{row.company_name}</td><td className="px-2 py-1">{row.plan_name}</td><td className="px-2 py-1">{row.pending_plan_change}</td><td className="px-2 py-1">{row.pending_plan_change_effective ? new Date(row.pending_plan_change_effective).toLocaleDateString() : '-'}</td></tr>
            )}
            emptyMessage="No pending plan changes."
          />
        </div>

        {/* Failed Payments */}
        <ExpandableCard
          title="Failed Payments"
          summary={analytics.failedPayments.length}
          columns={[{ label: "User", key: "company_name" }, { label: "Plan", key: "plan_name" }, { label: "Status", key: "status" }]}
          data={analytics.failedPayments}
          renderRow={(row: any) => (
            <tr key={row.user_id}><td className="px-2 py-1">{row.company_name}</td><td className="px-2 py-1">{row.plan_name}</td><td className="px-2 py-1">{row.status}</td></tr>
          )}
          emptyMessage="No failed payments."
        />

        {/* Recent Signups and Top Customers */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Recent Signups */}
          <ExpandableCard
            title="Recent Signups"
            summary={analytics.recentSignups.length}
            columns={[{ label: "User", key: "company_name" }, { label: "Plan", key: "plan_name" }, { label: "Joined", key: "created_at" }]}
            data={analytics.recentSignups}
            renderRow={(row: any) => (
              <tr key={row.user_id}><td className="px-2 py-1">{row.company_name}</td><td className="px-2 py-1">{row.plan_name}</td><td className="px-2 py-1">{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</td></tr>
            )}
            emptyMessage="No recent signups."
          />

          {/* Top Customers */}
          <ExpandableCard
            title="Top Customers"
            summary={analytics.topCustomers.length}
            columns={[{ label: "User", key: "company_name" }, { label: "Plan", key: "plan_name" }, { label: "Revenue", key: "amount" }]}
            data={analytics.topCustomers}
            renderRow={(row: any) => (
              <tr key={row.user_id}><td className="px-2 py-1">{row.company_name}</td><td className="px-2 py-1">{row.plan_name}</td><td className="px-2 py-1">£{row.amount?.toFixed(2) ?? '-'}</td></tr>
            )}
            emptyMessage="No top customers."
          />
        </div>
      </div>
    </div>
  )
}

export default SubscriptionAnalyticsDashboard
