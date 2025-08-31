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
  AlertTriangle,
  Package,
  RefreshCw,
  CheckCircle,
  Triangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { toast } from "sonner"

interface InventoryItem {
  id: string
  name: string
  currentStock: number
  lowStockThreshold: number
  isLowStock: boolean
}

interface InventoryData {
  items: InventoryItem[]
  lowStockCount: number
}

export default function LowStockAlerts() {
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    fetchInventoryData()
  }, [])

  const fetchInventoryData = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No authentication token")

      const response = await fetch("/api/square/inventory", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch inventory data")
      }

      const data: InventoryData = await response.json()
      setInventoryData(data)
    } catch (error: any) {
      console.error("Failed to fetch inventory data:", error)
      setError(error.message)
      toast.error("Failed to load inventory data")
    } finally {
      setLoading(false)
    }
  }

  const getStockStatusColor = (currentStock: number, threshold: number) => {
    const percentage = (currentStock / threshold) * 100
    if (percentage <= 25) return "text-red-600"
    if (percentage <= 50) return "text-yellow-600"
    return "text-green-600"
  }

  const getStockStatusIcon = (currentStock: number, threshold: number) => {
    const percentage = (currentStock / threshold) * 100
    if (percentage <= 25) return <Triangle className="h-4 w-4 text-red-600" />
    if (percentage <= 50) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <CheckCircle className="h-4 w-4 text-green-600" />
  }

  if (loading) {
    return (
      <Card className="w-full border-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg">
        <CardHeader className="border-b border-orange-100 bg-gradient-to-r from-orange-100 to-red-100">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-orange-800">
            <RefreshCw className="h-5 w-5 animate-spin text-orange-600" />
            Loading Inventory Data...
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
            onClick={fetchInventoryData}
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
    <Card className="w-full border-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg">
      <CardHeader
        className="cursor-pointer select-none border-b border-orange-100 bg-gradient-to-r from-orange-100 to-red-100"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-orange-800">
          <Package className="h-5 w-5 text-orange-600" />
          Low Stock Alerts
          <span className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-orange-600">
              {loading
                ? "..."
                : inventoryData
                  ? `${inventoryData.lowStockCount} alerts`
                  : "0 alerts"}
            </span>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-orange-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-orange-600" />
            )}
          </span>
        </CardTitle>
        <CardDescription className="text-orange-700">
          Items running low on inventory from Square
          {inventoryData && (
            <span className="mt-1 block text-sm text-orange-600">
              {inventoryData.lowStockCount} items need restocking
            </span>
          )}
        </CardDescription>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-6">
          {inventoryData && inventoryData.items.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-orange-800">Low Stock Items</h3>
                <Button
                  onClick={fetchInventoryData}
                  size="sm"
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-orange-200">
                    <TableHead className="text-orange-800">Item</TableHead>
                    <TableHead className="text-orange-800">Current Stock</TableHead>
                    <TableHead className="text-orange-800">Threshold</TableHead>
                    <TableHead className="text-orange-800">Status</TableHead>
                    <TableHead className="text-orange-800">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryData.items.map((item) => (
                    <TableRow key={item.id} className="border-orange-100 hover:bg-orange-50/50">
                      <TableCell className="font-medium text-orange-900">{item.name}</TableCell>
                      <TableCell
                        className={getStockStatusColor(item.currentStock, item.lowStockThreshold)}
                      >
                        {item.currentStock}
                      </TableCell>
                      <TableCell className="text-orange-800">{item.lowStockThreshold}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStockStatusIcon(item.currentStock, item.lowStockThreshold)}
                          <Badge variant={item.currentStock === 0 ? "destructive" : "secondary"}>
                            {item.currentStock === 0 ? "OUT OF STOCK" : "LOW STOCK"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-orange-300 text-orange-700 hover:bg-orange-50"
                        >
                          Order More
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <p className="mb-2 font-medium text-orange-700">All Items Well Stocked!</p>
              <p className="text-sm text-orange-600">No low stock alerts at this time</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
