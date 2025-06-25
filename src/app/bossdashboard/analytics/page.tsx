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
} from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext" // Adjust path as needed

// Type definitions
interface Subscription {
  id: string
  status:
    | "active"
    | "trialing"
    | "canceled"
    | "past_due"
    | "unpaid"
    | "incomplete"
    | "incomplete_expired"
  billing_interval: "monthly" | "yearly"
  plan_amount: string | number
  plan_type?: string
  created_at: string
  cancellation_notice_given_at?: string | null
  device_shipped_at?: string | null
  device_condition?: string | null
  failed_payment_attempts?: number | null
  grace_period_end?: string | null
  service_credits_balance?: string | number | null
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
  totalSubscriptions: number
  activeSubscriptions: number
  trialSubscriptions: number
  canceledSubscriptions: number
  mrr: number
  arpu: number
  statusDistribution: StatusDistribution[]
  planDistribution: PlanDistribution[]
  monthlyTrends: MonthlyTrend[]
  devicesShipped: number
  devicesReturned: number
  deviceReturnRate: number
  failedPayments: number
  inGracePeriod: number
  totalServiceCredits: number
  churnRate: number
  trialConversion: number
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

const SubscriptionAnalyticsDashboard: React.FC = () => {
  const { darkMode }: DarkModeContextType = useDarkMode() // Get darkMode from context
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [analytics, setAnalytics] = useState<Analytics>({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    trialSubscriptions: 0,
    canceledSubscriptions: 0,
    mrr: 0,
    arpu: 0,
    statusDistribution: [],
    planDistribution: [],
    monthlyTrends: [],
    devicesShipped: 0,
    devicesReturned: 0,
    deviceReturnRate: 0,
    failedPayments: 0,
    inGracePeriod: 0,
    totalServiceCredits: 0,
    churnRate: 0,
    trialConversion: 0,
  })
  const [dateRange, setDateRange] = useState<string>("30d")

  // Fetch data from /api/subscriptions/all
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch("/api/subscriptions/all")
        const data: Subscription[] = await response.json()
        console.log("Fetched subscriptions data:", data)
        setSubscriptions(data)
        setAnalytics(calculateAnalytics(data))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching subscriptions:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange])

  const calculateAnalytics = (data: Subscription[]): Analytics => {
    if (!data || data.length === 0) {
      return {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        trialSubscriptions: 0,
        canceledSubscriptions: 0,
        mrr: 0,
        arpu: 0,
        statusDistribution: [],
        planDistribution: [],
        monthlyTrends: [],
        devicesShipped: 0,
        devicesReturned: 0,
        deviceReturnRate: 0,
        failedPayments: 0,
        inGracePeriod: 0,
        totalServiceCredits: 0,
        churnRate: 0,
        trialConversion: 0,
      }
    }

    const now = new Date()

    // Basic metrics
    const totalSubscriptions = data.length
    const activeSubscriptions = data.filter((s: Subscription) => s.status === "active").length
    const trialSubscriptions = data.filter((s: Subscription) => s.status === "trialing").length
    const canceledSubscriptions = data.filter((s: Subscription) => s.status === "canceled").length

    // Revenue calculations
    const monthlyRevenue = data
      .filter((s: Subscription) => s.status === "active" && s.billing_interval === "monthly")
      .reduce((sum: number, s: Subscription) => sum + (parseFloat(String(s.plan_amount)) || 0), 0)

    const yearlyRevenue = data
      .filter((s: Subscription) => s.status === "active" && s.billing_interval === "yearly")
      .reduce((sum: number, s: Subscription) => sum + (parseFloat(String(s.plan_amount)) || 0), 0)

    const mrr = monthlyRevenue + yearlyRevenue / 12
    const arpu = activeSubscriptions > 0 ? mrr / activeSubscriptions : 0

    // Status distribution
    const statusCounts = data.reduce((acc: Record<string, number>, s: Subscription) => {
      acc[s.status] = (acc[s.status] || 0) + 1
      return acc
    }, {})

    const statusDistribution: StatusDistribution[] = Object.entries(statusCounts).map(
      ([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
        value: count,
        color:
          {
            active: "#22c55e",
            trialing: "#3b82f6",
            canceled: "#ef4444",
            past_due: "#f59e0b",
            unpaid: "#f97316",
            incomplete: "#8b5cf6",
            incomplete_expired: "#6b7280",
          }[status] || "#6b7280",
      })
    )

    // Plan type distribution
    const planCounts = data.reduce((acc: Record<string, number>, s: Subscription) => {
      if (s.plan_type) {
        acc[s.plan_type] = (acc[s.plan_type] || 0) + 1
      }
      return acc
    }, {})

    const planDistribution: PlanDistribution[] = Object.entries(planCounts).map(
      ([plan, count]) => ({
        name: plan,
        value: count,
        revenue: data
          .filter((s: Subscription) => s.plan_type === plan && s.status === "active")
          .reduce(
            (sum: number, s: Subscription) => sum + (parseFloat(String(s.plan_amount)) || 0),
            0
          ),
      })
    )

    // Monthly trends (last 12 months)
    const monthlyTrends: MonthlyTrend[] = Array.from({ length: 12 }, (_, i) => {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const monthSubs = data.filter((s: Subscription) => {
        const createdAt = new Date(s.created_at)
        return createdAt >= monthStart && createdAt <= monthEnd
      })

      const churnedSubs = data.filter((s: Subscription) => {
        const canceledAt = s.cancellation_notice_given_at
          ? new Date(s.cancellation_notice_given_at)
          : null
        return canceledAt && canceledAt >= monthStart && canceledAt <= monthEnd
      })

      return {
        month: monthStart.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        newSubscriptions: monthSubs.length,
        revenue: monthSubs.reduce(
          (sum: number, s: Subscription) => sum + (parseFloat(String(s.plan_amount)) || 0),
          0
        ),
        churn: churnedSubs.length,
      }
    }).reverse()

    // Device analytics
    const devicesShipped = data.filter((s: Subscription) => s.device_shipped_at).length
    const devicesReturned = data.filter(
      (s: Subscription) => s.device_condition && s.device_condition !== "pending_return"
    ).length
    const deviceReturnRate = devicesShipped > 0 ? (devicesReturned / devicesShipped) * 100 : 0

    // Payment health
    const failedPayments = data.filter(
      (s: Subscription) => (s.failed_payment_attempts || 0) > 0
    ).length
    const inGracePeriod = data.filter(
      (s: Subscription) => s.grace_period_end && new Date(s.grace_period_end) > now
    ).length
    const totalServiceCredits = data.reduce(
      (sum: number, s: Subscription) => sum + (parseFloat(String(s.service_credits_balance)) || 0),
      0
    )

    // Calculate churn and trial conversion
    const churnRate =
      totalSubscriptions > 0 ? (canceledSubscriptions / totalSubscriptions) * 100 : 0
    const totalConverted = activeSubscriptions + canceledSubscriptions
    const trialConversion =
      trialSubscriptions + totalConverted > 0
        ? (totalConverted / (trialSubscriptions + totalConverted)) * 100
        : 0

    return {
      totalSubscriptions,
      activeSubscriptions,
      trialSubscriptions,
      canceledSubscriptions,
      mrr,
      arpu,
      statusDistribution,
      planDistribution,
      monthlyTrends,
      devicesShipped,
      devicesReturned,
      deviceReturnRate,
      failedPayments,
      inGracePeriod,
      totalServiceCredits,
      churnRate,
      trialConversion,
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    color = "blue",
  }) => (
    <div
      className={`rounded-lg border p-6 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {value}
          </p>
          {trend !== undefined && (
            <p
              className={`text-xs ${trend > 0 ? "text-green-600" : "text-red-600"} flex items-center gap-1`}
            >
              <TrendingUp className="h-3 w-3" />
              {trend > 0 ? "+" : ""}
              {trend}%
            </p>
          )}
        </div>
        <div className={`rounded-full p-3 bg-${color}-100 ${darkMode ? `bg-${color}-900` : ""}`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  if (loading) {
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
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={`rounded-md border px-3 py-2 ${darkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-white"}`}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Subscriptions"
            value={analytics.totalSubscriptions}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Monthly Recurring Revenue"
            value={formatCurrency(analytics.mrr)}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Active Subscriptions"
            value={analytics.activeSubscriptions}
            icon={CreditCard}
            color="emerald"
          />
          <StatCard
            title="Churn Rate"
            value={`${analytics.churnRate.toFixed(1)}%`}
            icon={AlertCircle}
            color="red"
          />
        </div>

        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            title="ARPU"
            value={formatCurrency(analytics.arpu)}
            icon={TrendingUp}
            color="purple"
          />
          <StatCard
            title="Trial Conversion"
            value={`${analytics.trialConversion.toFixed(1)}%`}
            icon={Calendar}
            color="indigo"
          />
          <StatCard
            title="Service Credits"
            value={formatCurrency(analytics.totalServiceCredits)}
            icon={Package}
            color="orange"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Subscription Status Distribution */}
          <div
            className={`rounded-lg border p-6 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}
          >
            <h3 className="mb-4 text-lg font-semibold">Subscription Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.statusDistribution}
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
                  {analytics.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Plan Type Distribution */}
          <div
            className={`rounded-lg border p-6 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}
          >
            <h3 className="mb-4 text-lg font-semibold">Revenue by Plan Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.planDistribution}>
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
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends */}
        <div
          className={`rounded-lg border p-6 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}
        >
          <h3 className="mb-4 text-lg font-semibold">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={analytics.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
              <XAxis dataKey="month" stroke={darkMode ? "#9ca3af" : "#6b7280"} />
              <YAxis stroke={darkMode ? "#9ca3af" : "#6b7280"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                  border: `1px solid ${darkMode ? "#374151" : "#e5e7eb"}`,
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="newSubscriptions"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                name="New Subscriptions"
              />
              <Area
                type="monotone"
                dataKey="churn"
                stackId="2"
                stroke="#ef4444"
                fill="#ef4444"
                name="Churned"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device & Payment Health */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Device Analytics */}
          <div
            className={`rounded-lg border p-6 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}
          >
            <h3 className="mb-4 text-lg font-semibold">Device Analytics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Devices Shipped
                </span>
                <span className="font-semibold">{analytics.devicesShipped}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Devices Returned
                </span>
                <span className="font-semibold">{analytics.devicesReturned}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>Return Rate</span>
                <span className="font-semibold">{analytics.deviceReturnRate.toFixed(1)}%</span>
              </div>
              <div className={`mt-4 rounded-md p-4 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Device Fulfillment Health</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${100 - analytics.deviceReturnRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Health */}
          <div
            className={`rounded-lg border p-6 ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} shadow-sm`}
          >
            <h3 className="mb-4 text-lg font-semibold">Payment Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  Failed Payments
                </span>
                <span className="font-semibold text-red-500">{analytics.failedPayments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  In Grace Period
                </span>
                <span className="font-semibold text-yellow-500">{analytics.inGracePeriod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  At Risk Revenue
                </span>
                <span className="font-semibold text-red-500">
                  {formatCurrency(analytics.failedPayments * analytics.arpu)}
                </span>
              </div>
              <div
                className={`mt-4 rounded-md p-4 ${analytics.failedPayments > 10 ? "border border-red-200 bg-red-50" : "border border-green-200 bg-green-50"}`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle
                    className={`h-5 w-5 ${analytics.failedPayments > 10 ? "text-red-500" : "text-green-500"}`}
                  />
                  <span
                    className={`text-sm font-medium ${analytics.failedPayments > 10 ? "text-red-800" : "text-green-800"}`}
                  >
                    {analytics.failedPayments > 10 ? "High Payment Risk" : "Payment Health Good"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionAnalyticsDashboard
