'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { toast } from 'sonner'

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

interface PopularItem {
  itemName: string
  quantity: number
  revenue: number
  rank: number
  trend: 'up' | 'down' | 'stable'
}

export default function PopularItemsDashboard() {
  const [salesData, setSalesData] = useState<SalesData | null>(null)
  const [popularItems, setPopularItems] = useState<PopularItem[]>([])
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
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch('/api/square/sales', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch sales data')
      }

      const data: SalesData = await response.json()
      setSalesData(data)
      
      // Generate popular items list
      const popular = generatePopularItems(data)
      setPopularItems(popular)
      
    } catch (error: any) {
      console.error('Failed to fetch sales data:', error)
      setError(error.message)
      toast.error('Failed to load sales data')
    } finally {
      setLoading(false)
    }
  }

  const generatePopularItems = (data: SalesData): PopularItem[] => {
    const items = data.itemSales.map((item, index) => ({
      itemName: item.itemName,
      quantity: item.quantity,
      revenue: item.revenue,
      rank: index + 1,
      trend: Math.random() > 0.5 ? 'up' : 'down' as 'up' | 'down' | 'stable' // Mock trend for now
    }))
    
    // Sort by quantity sold (most popular first)
    return items.sort((a, b) => b.quantity - a.quantity).slice(0, 10)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-100 text-yellow-800">🥇 #1</Badge>
    if (rank === 2) return <Badge className="bg-gray-100 text-gray-800">🥈 #2</Badge>
    if (rank === 3) return <Badge className="bg-orange-100 text-orange-800">🥉 #3</Badge>
    return <Badge variant="secondary">#{rank}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <Card className="w-full border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
        <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-100 to-pink-100">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-purple-800">
            <RefreshCw className="h-5 w-5 animate-spin text-purple-600" />
            Loading Popular Items...
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
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={fetchSalesData} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
      <CardHeader 
        className="cursor-pointer select-none border-b border-purple-100 bg-gradient-to-r from-purple-100 to-pink-100"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-purple-800">
          <Star className="h-5 w-5 text-purple-600" />
          Popular Items Dashboard
          <span className="ml-auto flex items-center gap-2">
            <span className="text-sm font-medium text-purple-600">
              {loading ? "..." : `${popularItems.length} items`}
            </span>
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-purple-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-purple-600" />
            )}
          </span>
        </CardTitle>
        <CardDescription className="text-purple-700">
          Top selling items from yesterday's Square sales
          {salesData && (
            <span className="block text-sm text-purple-600 mt-1">
              Based on {salesData.itemSales.length} items sold
            </span>
          )}
        </CardDescription>
      </CardHeader>
      {expanded && (
        <CardContent className="pt-6">
        {popularItems.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-purple-800">Top 10 Popular Items</h3>
              <Button onClick={fetchSalesData} size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            
            <div className="grid gap-4">
              {popularItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-purple-200 rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankBadge(item.rank)}
                      <span className="font-medium text-purple-900">{item.itemName}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-purple-600">Quantity Sold</div>
                      <div className="font-semibold text-purple-900">{item.quantity}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-purple-600">Revenue</div>
                      <div className="font-semibold text-purple-900">{formatCurrency(item.revenue)}</div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {getTrendIcon(item.trend)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
            <p className="text-purple-700 font-medium mb-2">No Sales Data Available</p>
            <p className="text-purple-600 text-sm">No sales were recorded yesterday. Check back later for popular items.</p>
          </div>
        )}
      </CardContent>
      )}
    </Card>
  )
} 