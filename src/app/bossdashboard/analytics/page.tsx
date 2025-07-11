"use client"
import React, { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts"
import { TrendingUp, Users, DollarSign, Activity, BarChart3, PieChart as PieChartIcon, Truck, Package } from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext"

const COLORS = ["#a259ff", "#f7b801", "#00c49a", "#ff6b6b", "#8884d8", "#82ca9d"]

export default function AnalyticsDashboard() {
  const { isDarkMode } = useDarkMode()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deviceData, setDeviceData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const bossToken = typeof window !== 'undefined' ? localStorage.getItem('bossToken') : null
        const res = await fetch("/api/subscription_better/analytics", {
          headers: bossToken ? { 'Authorization': `Bearer ${bossToken}` } : {}
        })
        const json = await res.json()
        setData(json)
      } catch (e: any) {
        setError(e.message || "Failed to fetch analytics")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    fetch('/api/devices').then(res => res.json()).then(data => setDeviceData(data.devices || []))
  }, [])

  if (loading) return <div className="p-8 text-center">Loading analytics...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>
  if (!data) return <div className="p-8 text-center">No data available.</div>

  return (
    <div className="p-6 md:p-10 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{data.total}</div>
            <p className="text-xs text-muted-foreground">{data.active} active</p>
          </CardContent>
        </Card>
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Revenue</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">£{data.mrr?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">£{data.arr?.toLocaleString()} annually</p>
          </CardContent>
        </Card>
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">ARPU</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">£{data.arpu?.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Avg. revenue per user</p>
          </CardContent>
        </Card>
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Churn Rate</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{(data.churnRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{data.canceled} canceled</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Plan Distribution Pie Chart */}
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5 text-primary" />Plan Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.planDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#a259ff"
                  label
                >
                  {data.planDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Status Distribution Bar Chart */}
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.statusDistribution}>
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#a259ff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Device Status Pie Chart */}
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PieChartIcon className="h-5 w-5 text-primary" />Device Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(deviceData.reduce((acc: any, d: any) => { acc[d.status] = (acc[d.status] || 0) + 1; return acc }, {})).map(([name, value]) => ({ name, value }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#00c49a"
                  label
                >
                  {Object.entries(deviceData.reduce((acc: any, d: any) => { acc[d.status] = (acc[d.status] || 0) + 1; return acc }, {})).map(([_, __], index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Device Shipments Over Time Bar Chart */}
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Device Shipments Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={(() => {
                // Group by shipped_at date
                const shipments = deviceData.filter((d: any) => d.shipped_at).reduce((acc: any, d: any) => {
                  const date = new Date(d.shipped_at).toLocaleDateString()
                  acc[date] = (acc[date] || 0) + 1
                  return acc
                }, {})
                return Object.entries(shipments).map(([name, value]) => ({ name, value }))
              })()}>
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#00c49a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Signups & Top Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.recentSignups.map((user: any, i: number) => (
                <li key={i} className="flex justify-between items-center border-b pb-1 last:border-b-0">
                  <span className="font-medium">{user.company_name}</span>
                  <span className="text-xs text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.topCustomers.map((user: any, i: number) => (
                <li key={i} className="flex justify-between items-center border-b pb-1 last:border-b-0">
                  <span className="font-medium">{user.company_name}</span>
                  <span className="text-xs text-muted-foreground">£{user.amount?.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}