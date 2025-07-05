"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Bell, 
  Package, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Mail,
  Truck,
  RotateCcw
} from "lucide-react"

interface Notification {
  id: string
  type: 'new_signup' | 'upgrade' | 'cancellation' | 'device_shipped' | 'device_returned' | 'payment_failed'
  title: string
  message: string
  timestamp: string
  read: boolean
  data?: any
}

interface NotificationStats {
  total: number
  unread: number
  new_signups: number
  upgrades: number
  cancellations: number
  device_alerts: number
  payment_issues: number
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    new_signups: 0,
    upgrades: 0,
    cancellations: 0,
    device_alerts: 0,
    payment_issues: 0
  })
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("/api/admin/notifications", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        calculateStats(data.notifications || [])
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const calculateStats = (notifList: Notification[]) => {
    const stats = {
      total: notifList.length,
      unread: notifList.filter(n => !n.read).length,
      new_signups: notifList.filter(n => n.type === 'new_signup').length,
      upgrades: notifList.filter(n => n.type === 'upgrade').length,
      cancellations: notifList.filter(n => n.type === 'cancellation').length,
      device_alerts: notifList.filter(n => ['device_shipped', 'device_returned'].includes(n.type)).length,
      payment_issues: notifList.filter(n => n.type === 'payment_failed').length
    }
    setStats(stats)
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/admin/notifications/${notificationId}/read`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        )
        calculateStats(notifications.map(n => n.id === notificationId ? { ...n, read: true } : n))
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_signup':
        return <Users className="w-5 h-5 text-green-600" />
      case 'upgrade':
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      case 'cancellation':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'device_shipped':
        return <Truck className="w-5 h-5 text-blue-600" />
      case 'device_returned':
        return <RotateCcw className="w-5 h-5 text-purple-600" />
      case 'payment_failed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationBadge = (type: string) => {
    const badgeConfig = {
      new_signup: "bg-green-100 text-green-800",
      upgrade: "bg-blue-100 text-blue-800",
      cancellation: "bg-red-100 text-red-800",
      device_shipped: "bg-blue-100 text-blue-800",
      device_returned: "bg-purple-100 text-purple-800",
      payment_failed: "bg-red-100 text-red-800"
    }

    return badgeConfig[type as keyof typeof badgeConfig] || "bg-gray-100 text-gray-800"
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5)

  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No notifications yet</p>
            <p className="text-sm">You'll see important updates here</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
            {stats.unread > 0 && (
              <Badge variant="destructive" className="ml-2">
                {stats.unread}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              {stats.new_signups} new
            </Badge>
            <Badge variant="outline" className="text-xs">
              {stats.upgrades} upgrades
            </Badge>
            <Badge variant="outline" className="text-xs">
              {stats.cancellations} cancels
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayedNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                notification.read 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">
                        {notification.title}
                      </h4>
                      <Badge className={`text-xs ${getNotificationBadge(notification.type)}`}>
                        {notification.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 px-2 text-xs"
                        >
                          Mark read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length > 5 && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="w-full"
            >
              {showAll ? "Show Less" : `Show All (${notifications.length})`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 