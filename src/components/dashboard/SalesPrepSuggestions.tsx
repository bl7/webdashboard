"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  TrendingUp,
  Calendar,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { toast } from "sonner"

interface SalesData {
  date: string
  totalSales: number
  itemSales: Array<{
    itemId: string
    itemName: string
    quantity: number
    revenue: number
  }>
}

interface PrepSuggestion {
  itemName: string
  suggestedQuantity: number
  yesterdaySold: number
  revenue: number
  priority: "high" | "medium" | "low"
}

export default function SalesPrepSuggestions() {
  const [salesData, setSalesData] = useState<SalesData | null>(null)
  const [prepSuggestions, setPrepSuggestions] = useState<PrepSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token")

      const response = await fetch("/api/square/sales", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch sales data")
      }

      const data: SalesData = await response.json()
      setSalesData(data)

      // Generate prep suggestions based on sales data
      const suggestions = generatePrepSuggestions(data)
      setPrepSuggestions(suggestions)
    } catch (error: any) {
      console.error("Failed to fetch sales data:", error)
      setError(error.message)
      toast.error("Failed to load sales data")
    } finally {
      setLoading(false)
    }
  }

  const generatePrepSuggestions = (data: SalesData): PrepSuggestion[] => {
    const suggestions: PrepSuggestion[] = []

    for (const item of data.itemSales) {
      // Calculate suggested quantity based on yesterday's sales
      // Add 20% buffer for safety
      const suggestedQuantity = Math.ceil(item.quantity * 1.2)

      // Determine priority based on revenue
      let priority: "high" | "medium" | "low" = "low"
      if (item.revenue > 100) priority = "high"
      else if (item.revenue > 50) priority = "medium"

      suggestions.push({
        itemName: item.itemName,
        suggestedQuantity,
        yesterdaySold: item.quantity,
        revenue: item.revenue,
        priority,
      })
    }

    // Sort by priority and revenue
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.revenue - a.revenue
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (loading) {
    return (
      <Card className="w-full border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
        <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-100 to-indigo-100">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-800">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            Loading Sales Data...
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full border-0 bg-gradient-to-br from-red-50 to-orange-50 shadow-lg">
        <CardHeader className="border-b border-red-100 bg-gradient-to-r from-red-100 to-orange-100">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-red-800">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Error Loading Data
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-4 text-red-700">{error}</p>
          <Button
            onClick={fetchSalesData}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
      <CardHeader
        className="cursor-pointer select-none border-b border-blue-100 bg-gradient-to-r from-blue-100 to-indigo-100"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-800">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Suggested Prep Quantities
          <span className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600">
              {loading ? "..." : `${prepSuggestions.length} suggestions`}
            </span>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-blue-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-blue-600" />
            )}
          </span>
        </CardTitle>
        <CardDescription className="text-blue-700">
          Based on yesterday's sales data from Square
          {salesData && (
            <span className="mt-1 block text-sm text-blue-600">
              <Calendar className="mr-1 inline h-4 w-4" />
              {new Date(salesData.date).toLocaleDateString()} • Total Sales:{" "}
              {formatCurrency(salesData.totalSales)}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-6">
          {prepSuggestions.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-blue-800">Prep Suggestions</h3>
                <Button
                  onClick={fetchSalesData}
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-blue-200">
                    <TableHead className="text-blue-800">Item</TableHead>
                    <TableHead className="text-blue-800">Yesterday Sold</TableHead>
                    <TableHead className="text-blue-800">Suggested Prep</TableHead>
                    <TableHead className="text-blue-800">Revenue</TableHead>
                    <TableHead className="text-blue-800">Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prepSuggestions.map((suggestion, index) => (
                    <TableRow key={index} className="border-blue-100 hover:bg-blue-50/50">
                      <TableCell className="font-medium text-blue-900">
                        {suggestion.itemName}
                      </TableCell>
                      <TableCell className="text-blue-800">{suggestion.yesterdaySold}</TableCell>
                      <TableCell className="font-semibold text-blue-900">
                        {suggestion.suggestedQuantity}
                      </TableCell>
                      <TableCell className="text-blue-800">
                        {formatCurrency(suggestion.revenue)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <p className="mb-2 font-medium text-blue-700">No Sales Data Available</p>
              <p className="text-sm text-blue-600">
                No sales were recorded yesterday. Check back later for prep suggestions.
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
