"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  Truck,
  Package,
  FileText,
} from "lucide-react"
import { useDarkMode } from "./context/DarkModeContext"

interface AnalyticsData {
  total: number
  active: number
  trialing: number
  canceled: number
  mrr: number
  arr: number
  arpu: number
  churnRate: number
  trialConversion: number
  planDistribution: Array<{ name: string; value: number }>
  statusDistribution: Array<{ name: string; value: number }>
  recentSignups: Array<any>
  topCustomers: Array<any>
  upcomingRenewals: Array<any>
  pendingChanges: Array<any>
  failedPayments: Array<any>
}

interface User {
  user_id: string
  company_name: string
  plan_name: string
  status: string
  current_period_end: string
  trial_end: string
  pending_plan_change: string | null
  pending_plan_change_effective: string | null
  created_at: string
}

export default function BossDashboard() {
  const { isDarkMode } = useDarkMode()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [users, setUsers] = useState<User[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [editPlan, setEditPlan] = useState<any | null>(null)
  const [pendingDevices, setPendingDevices] = useState<any[]>([])
  const [recentDevices, setRecentDevices] = useState<any[]>([])
  const [recentLabelOrders, setRecentLabelOrders] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch analytics data
        const bossToken = typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
        const analyticsResponse = await fetch("/api/subscription_better/analytics", {
          headers: bossToken ? { Authorization: `Bearer ${bossToken}` } : {},
        })
        if (!analyticsResponse.ok) {
          throw new Error("Failed to fetch analytics data")
        }
        const analytics = await analyticsResponse.json()

        // Fetch users data
        const usersResponse = await fetch("/api/subscription_better/users", {
          headers: bossToken ? { Authorization: `Bearer ${bossToken}` } : {},
        })
        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users data")
        }
        const usersData = await usersResponse.json()

        // Fetch plans data
        const plansResponse = await fetch("/api/plans", {
          headers: bossToken ? { Authorization: `Bearer ${bossToken}` } : {},
        })
        if (!plansResponse.ok) {
          throw new Error("Failed to fetch plans data")
        }
        const plansData = await plansResponse.json()

        // Fetch device and label order data
        fetch("/api/devices", {
          headers: bossToken ? { Authorization: `Bearer ${bossToken}` } : {},
        })
          .then((res) => res.json())
          .then((data) => {
            setPendingDevices((data.devices || []).filter((d: any) => d.status === "pending"))
            setRecentDevices(
              (data.devices || [])
                .slice()
                .sort((a: any, b: any) => {
                  const dateA = a.assigned_at ? new Date(a.assigned_at).getTime() : 0
                  const dateB = b.assigned_at ? new Date(b.assigned_at).getTime() : 0
                  return dateB - dateA
                })
                .slice(0, 5)
            )
          })
        fetch("/api/label-orders/all", {
          headers: bossToken ? { Authorization: `Bearer ${bossToken}` } : {},
        })
          .then((res) => res.json())
          .then((data) => {
            setRecentLabelOrders(
              (data.orders || [])
                .slice()
                .sort((a: any, b: any) => {
                  const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
                  const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
                  return dateB - dateA
                })
                .slice(0, 5)
            )
          })

        setAnalyticsData(analytics)
        setUsers(usersData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "trialing":
        return "bg-purple-100 text-blue-800 dark:bg-blue-900 dark:text-purple-200"
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "past_due":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPlanColor = (planName: string) => {
    switch (planName?.toLowerCase()) {
      case "basic":
      case "basic plan":
        return "bg-purple-100 text-blue-800 dark:bg-blue-900 dark:text-purple-200"
      case "pro":
      case "pro kitchen":
      case "pro_kitchen":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "multi-kitchen":
      case "multi_site":
      case "multi-site mastery":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  // Quick link handlers
  const handleQuickLink = (tab: string, action?: string) => {
    setActiveTab(tab)
    if (tab === "users" && action === "add") setShowAddUserModal(true)
    if (tab === "plans" && action === "add") setShowPlanModal(true)
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4" variant="purple">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <div className="container mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Boss Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your SaaS business and monitor performance
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {analyticsData?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData?.active || 0} active subscriptions
              </p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(analyticsData?.mrr || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(analyticsData?.arr || 0)} annually
              </p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ARPU
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(analyticsData?.arpu || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Average revenue per user</p>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Churn Rate
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {((analyticsData?.churnRate || 0) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {analyticsData?.canceled || 0} canceled subscriptions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* New Widgets */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Pending Device Shipments */}
          <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Device Shipments
              </CardTitle>
              <Truck className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingDevices.length}
              </div>
              <p className="text-xs text-muted-foreground">Devices to ship</p>
            </CardContent>
          </Card>
          {/* Recent Device Assignments */}
          <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Recent Device Assignments
              </CardTitle>
              <Package className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-xs text-gray-900 dark:text-white">
                {recentDevices.map((d: any) => (
                  <li key={d.id}>
                    {d.customer_name || d.customer_email || "Unknown User"} -{" "}
                    {d.device_type || "Mobile Device"} ({d.status})
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          {/* Recent Label Orders */}
          <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Recent Label Orders
              </CardTitle>
              <FileText className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-xs text-gray-900 dark:text-white">
                {recentLabelOrders.map((o: any) => (
                  <li key={o.id}>
                    {o.email || o.full_name || "Unknown User"} - {o.bundle_count} bundles (
                    {o.status})
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Plan Distribution */}
              <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Plan Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.planDistribution?.map((plan, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              index === 0
                                ? "bg-purple-500"
                                : index === 1
                                  ? "bg-purple-500"
                                  : "bg-orange-500"
                            }`}
                          ></div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {plan.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {plan.value} users
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Subscription Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.statusDistribution?.map((status, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              status.name === "active"
                                ? "bg-green-500"
                                : status.name === "trialing"
                                  ? "bg-purple-500"
                                  : status.name === "canceled"
                                    ? "bg-red-500"
                                    : "bg-gray-500"
                            }`}
                          ></div>
                          <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                            {status.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {status.value} users
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Signups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData?.recentSignups?.slice(0, 5).map((user: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                          <span className="text-sm font-medium text-white">
                            {user.company_name?.charAt(0) || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.company_name || "Unknown Company"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(user.created_at)}
                          </p>
                        </div>
                      </div>
                      <Badge className={getPlanColor(user.plan_name)}>
                        {user.plan_name || "No Plan"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Top Customers */}
              <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Top Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.topCustomers
                      ?.slice(0, 5)
                      .map((customer: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                              <span className="text-sm font-medium text-white">
                                {customer.company_name?.charAt(0) || "C"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {customer.company_name || "Unknown Company"}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {customer.plan_name || "No Plan"}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(customer.amount || 0)}
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Renewals */}
              <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Renewals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.upcomingRenewals
                      ?.slice(0, 5)
                      .map((renewal: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500">
                              <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {renewal.company_name || "Unknown Company"}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(renewal.current_period_end)}
                              </p>
                            </div>
                          </div>
                          <Badge className={getPlanColor(renewal.plan_name)}>
                            {renewal.plan_name || "No Plan"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Pending Changes */}
              <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    Pending Plan Changes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(analyticsData?.pendingChanges?.length || 0) > 0 ? (
                      analyticsData!
                        .pendingChanges!.slice(0, 5)
                        .map((change: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {change.company_name || "Unknown Company"}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Changing to: {change.pending_plan_change}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="border-yellow-500 text-yellow-700 dark:text-yellow-300"
                            >
                              Pending
                            </Badge>
                          </div>
                        ))
                    ) : (
                      <p className="py-4 text-center text-gray-600 dark:text-gray-400">
                        No pending plan changes
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Failed Payments */}
              <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Failed Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(analyticsData?.failedPayments?.length || 0) > 0 ? (
                      analyticsData!
                        .failedPayments!.slice(0, 5)
                        .map((payment: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {payment.company_name || "Unknown Company"}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Status: {payment.status}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="border-red-500 text-red-700 dark:text-red-300"
                            >
                              Failed
                            </Badge>
                          </div>
                        ))
                    ) : (
                      <p className="py-4 text-center text-gray-600 dark:text-gray-400">
                        No failed payments
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
