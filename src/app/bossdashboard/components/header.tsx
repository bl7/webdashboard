"use client"
import React, { useState, useEffect } from "react"
import { Search, Menu, LogOut, ChevronDown, User, Moon, Sun, Bell, Settings, Eye, Trash2, CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface AdminNotification {
  id: number
  type: string
  title: string
  message: string
  timestamp: string
  read: boolean
  data: any
  created_at: string
  updated_at: string
}

interface ToastNotification {
  id: number
  title: string
  message: string
  type: string
  timestamp: string
}

interface HeaderProps {
  title: string
  darkMode: boolean
  onToggleDarkMode: () => void
  onOpenSidebar: () => void
  userMenuOpen: boolean
  onToggleUserMenu: () => void
  onLogout: () => void
}

export default function Header({
  title,
  darkMode,
  onToggleDarkMode,
  onOpenSidebar,
  userMenuOpen,
  onToggleUserMenu,
  onLogout,
}: HeaderProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastNotification[]>([])
  const [lastNotificationId, setLastNotificationId] = useState<number>(0)

  const fetchUnreadNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin-notifications?read=false&limit=10')
      if (response.ok) {
        const data = await response.json()
        const newNotifications = data.notifications || []
        
        // Check for new notifications
        if (newNotifications.length > 0) {
          const newestNotification = newNotifications[0]
          if (newestNotification.id > lastNotificationId && lastNotificationId > 0) {
            // Show toast for new notification
            showToast(newestNotification)
          }
          setLastNotificationId(newestNotification.id)
        }
        
        setNotifications(newNotifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (notification: AdminNotification) => {
    const toast: ToastNotification = {
      id: Date.now(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      timestamp: notification.timestamp
    }
    
    setToasts(prev => [...prev, toast])
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id))
    }, 5000)
  }

  const removeToast = (toastId: number) => {
    setToasts(prev => prev.filter(t => t.id !== toastId))
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/admin-notifications/${notificationId}/read`, {
        method: 'PUT'
      })
      if (response.ok) {
        // Remove from unread list
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
      } else {
        console.error('Failed to mark notification as read:', response.status)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const getTypeBadge = (type: string) => {
    const badgeConfig: Record<string, { color: string, label: string }> = {
      new_signup: { color: "bg-green-100 text-green-800", label: "New Signup" },
      upgrade: { color: "bg-purple-100 text-blue-800", label: "Upgrade" },
      device_shipped: { color: "bg-purple-100 text-purple-800", label: "Device Shipped" },
      device_delivered: { color: "bg-green-100 text-green-800", label: "Device Delivered" },
      device_return_requested: { color: "bg-orange-100 text-orange-800", label: "Return Requested" },
      device_returned: { color: "bg-gray-100 text-gray-800", label: "Device Returned" },
      cancellation: { color: "bg-red-100 text-red-800", label: "Cancelled" },
      payment_failed: { color: "bg-red-100 text-red-800", label: "Payment Failed" },
      payment_recovered: { color: "bg-green-100 text-green-800", label: "Payment Recovered" },
      plan_renewal: { color: "bg-green-100 text-green-800", label: "Plan Renewed" },
      label_order_placed: { color: "bg-gray-100 text-gray-800", label: "Label Order Placed" },
      label_order_paid: { color: "bg-green-100 text-green-800", label: "Label Order Paid" },
      label_order_shipped: { color: "bg-purple-100 text-blue-800", label: "Label Order Shipped" },
      label_order_delivered: { color: "bg-green-100 text-green-800", label: "Label Order Delivered" },
      label_order_cancelled: { color: "bg-red-100 text-red-800", label: "Label Order Cancelled" }
    }
    const config = badgeConfig[type] || { color: "bg-gray-100 text-gray-800", label: type }
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const handleLogout = () => {
    // Clear the bossToken from localStorage
    localStorage.removeItem("bossToken")
    
    // Redirect to boss login
    router.push("/boss/login")
  }

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (dropdownOpen) {
      fetchUnreadNotifications()
    }
  }, [dropdownOpen])

  // Set up real-time polling for notifications
  useEffect(() => {
    // Initial fetch
    fetchUnreadNotifications()
    
    // Poll every 30 seconds for new notifications
    const interval = setInterval(() => {
      fetchUnreadNotifications()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        } border-b shadow-sm`}
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle only on mobile */}
            <button
              onClick={onOpenSidebar}
              className={`rounded-md p-2 lg:hidden ${
                darkMode
                  ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {title}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative h-9 w-9 p-0 ${
                    darkMode
                      ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white border-2 border-white"
                    >
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {notifications.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {notifications.length} unread
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {loading ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No unread notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div key={notification.id} className="p-3 border-b last:border-b-0">
                      <div className="flex items-start justify-between gap-2">
                        <div 
                          className="flex-1 min-w-0 cursor-pointer hover:bg-gray-50 p-1 rounded"
                          onClick={() => {
                            markAsRead(notification.id)
                            router.push('/bossdashboard/notifications')
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {getTypeBadge(notification.type)}
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.timestamp)}
                            </span>
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-center text-sm text-purple-600 hover:text-purple-700"
                      onClick={() => router.push('/bossdashboard/notifications')}
                    >
                      View all notifications
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleDarkMode}
              className={`h-9 w-9 p-0 ${
                darkMode
                  ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`h-9 w-9 rounded-full p-0 ${
                    darkMode
                      ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out ${
              darkMode ? "bg-gray-800 border-gray-700" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getTypeBadge(toast.type)}
                  <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {formatDate(toast.timestamp)}
                  </span>
                </div>
                <h4 className={`text-sm font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {toast.title}
                </h4>
                <p className={`text-sm line-clamp-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                  {toast.message}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-2"
                onClick={() => removeToast(toast.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
