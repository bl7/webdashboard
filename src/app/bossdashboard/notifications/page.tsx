'use client'
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Package, 
  Truck, 
  RotateCcw, 
  Search, 
  Trash2,
  Eye,
  EyeOff
} from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext"

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

interface NotificationStats {
  total: number
  unread: number
  new_signup: number
  upgrade: number
  device_shipped: number
  device_delivered: number
  device_return_requested: number
  device_returned: number
  cancellation: number
  payment_failed: number
  payment_recovered: number
  plan_renewal: number
  label_order_placed: number
  label_order_paid: number
  label_order_shipped: number
  label_order_delivered: number
  label_order_cancelled: number
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [readFilter, setReadFilter] = useState("all")
  const [filteredNotifications, setFilteredNotifications] = useState<AdminNotification[]>([])
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    new_signup: 0,
    upgrade: 0,
    device_shipped: 0,
    device_delivered: 0,
    device_return_requested: 0,
    device_returned: 0,
    cancellation: 0,
    payment_failed: 0,
    payment_recovered: 0,
    plan_renewal: 0,
    label_order_placed: 0,
    label_order_paid: 0,
    label_order_shipped: 0,
    label_order_delivered: 0,
    label_order_cancelled: 0
  })
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const { isDarkMode } = useDarkMode()

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    filterNotifications()
  }, [notifications, searchTerm, typeFilter, readFilter])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin-notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        calculateStats(data.notifications)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (notificationList: AdminNotification[]) => {
    const newStats = {
      total: notificationList.length,
      unread: notificationList.filter(n => !n.read).length,
      new_signup: notificationList.filter(n => n.type === 'new_signup').length,
      upgrade: notificationList.filter(n => n.type === 'upgrade').length,
      device_shipped: notificationList.filter(n => n.type === 'device_shipped').length,
      device_delivered: notificationList.filter(n => n.type === 'device_delivered').length,
      device_return_requested: notificationList.filter(n => n.type === 'device_return_requested').length,
      device_returned: notificationList.filter(n => n.type === 'device_returned').length,
      cancellation: notificationList.filter(n => n.type === 'cancellation').length,
      payment_failed: notificationList.filter(n => n.type === 'payment_failed').length,
      payment_recovered: notificationList.filter(n => n.type === 'payment_recovered').length,
      plan_renewal: notificationList.filter(n => n.type === 'plan_renewal').length,
      label_order_placed: notificationList.filter(n => n.type === 'label_order_placed').length,
      label_order_paid: notificationList.filter(n => n.type === 'label_order_paid').length,
      label_order_shipped: notificationList.filter(n => n.type === 'label_order_shipped').length,
      label_order_delivered: notificationList.filter(n => n.type === 'label_order_delivered').length,
      label_order_cancelled: notificationList.filter(n => n.type === 'label_order_cancelled').length
    }
    setStats(newStats)
  }

  const filterNotifications = () => {
    let filtered = notifications

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === typeFilter)
    }

    // Filter by read status
    if (readFilter === 'unread') {
      filtered = filtered.filter(notification => !notification.read)
    } else if (readFilter === 'read') {
      filtered = filtered.filter(notification => notification.read)
    }

    // Sort: unread first, then by timestamp (newest first)
    filtered.sort((a, b) => {
      // First sort by read status (unread first)
      if (!a.read && b.read) return -1
      if (a.read && !b.read) return 1
      
      // Then sort by timestamp (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    setFilteredNotifications(filtered)
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/admin-notifications/${notificationId}/read`, {
        method: 'PATCH'
      })
      if (response.ok) {
        await fetchNotifications() // Refresh the data
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin-notifications/mark-all-read', {
        method: 'PATCH'
      })
      if (response.ok) {
        await fetchNotifications() // Refresh the data
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/admin-notifications/${notificationId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchNotifications() // Refresh the data
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    const iconMap = {
      new_signup: CheckCircle,
      upgrade: AlertTriangle,
      device_shipped: Truck,
      device_delivered: Package,
      device_return_requested: RotateCcw,
      device_returned: RotateCcw,
      cancellation: AlertTriangle,
      payment_failed: AlertTriangle,
      payment_recovered: CheckCircle,
      plan_renewal: CheckCircle,
      label_order_placed: Bell,
      label_order_paid: CheckCircle,
      label_order_shipped: Truck,
      label_order_delivered: Package,
      label_order_cancelled: AlertTriangle
    }
    return iconMap[type as keyof typeof iconMap] || Bell
  }

  const getTypeBadge = (type: string) => {
    const badgeConfig = {
      new_signup: { color: "bg-green-100 text-green-800", label: "New Signup" },
      upgrade: { color: "bg-purple-100 text-blue-800", label: "Upgrade" },
      device_shipped: { color: "bg-purple-100 text-blue-800", label: "Device Shipped" },
      device_delivered: { color: "bg-green-100 text-green-800", label: "Device Delivered" },
      device_return_requested: { color: "bg-orange-100 text-orange-800", label: "Return Requested" },
      device_returned: { color: "bg-purple-100 text-purple-800", label: "Device Returned" },
      cancellation: { color: "bg-red-100 text-red-800", label: "Cancellation" },
      payment_failed: { color: "bg-red-100 text-red-800", label: "Payment Failed" },
      payment_recovered: { color: "bg-green-100 text-green-800", label: "Payment Recovered" },
      plan_renewal: { color: "bg-green-100 text-green-800", label: "Plan Renewed" },
      label_order_placed: { color: "bg-gray-100 text-gray-800", label: "Label Order Placed" },
      label_order_paid: { color: "bg-green-100 text-green-800", label: "Label Order Paid" },
      label_order_shipped: { color: "bg-purple-100 text-blue-800", label: "Label Order Shipped" },
      label_order_delivered: { color: "bg-green-100 text-green-800", label: "Label Order Delivered" },
      label_order_cancelled: { color: "bg-red-100 text-red-800", label: "Label Order Cancelled" }
    }
    const config = badgeConfig[type as keyof typeof badgeConfig] || { color: "bg-gray-100 text-gray-800", label: type }
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const showNotificationDetail = (notification: AdminNotification) => {
    setSelectedNotification(notification)
    setShowDetailModal(true)
    if (!notification.read) {
      markAsRead(notification.id)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Admin Notifications</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
              <CardContent className="p-6">
                <div className={`h-4 rounded animate-pulse mb-2 ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}></div>
                <div className={`h-8 rounded animate-pulse ${isDarkMode ? "bg-gray-600" : "bg-gray-200"}`}></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className={`space-y-6 ${isDarkMode ? "text-white" : ""}`}>
        {/* Notification Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className={`max-w-2xl ${isDarkMode ? "bg-gray-800 border-gray-700" : ""}`}>
            <DialogHeader>
              <DialogTitle className={`flex items-center gap-2 ${isDarkMode ? "text-white" : ""}`}>
                {selectedNotification && (() => {
                  const IconComponent = getTypeIcon(selectedNotification.type)
                  return <IconComponent className="w-5 h-5" />
                })()}
                {selectedNotification?.title}
              </DialogTitle>
              <DialogDescription className={isDarkMode ? "text-gray-300" : ""}>
                {selectedNotification && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(selectedNotification.type)}
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {formatDate(selectedNotification.timestamp)}
                      </span>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <p className="whitespace-pre-wrap">{selectedNotification.message}</p>
                    </div>
                    {selectedNotification.data && (
                      <div className="space-y-4">
                        {/* Customer Information */}
                        {(selectedNotification.data.customer_name || selectedNotification.data.email) && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-blue-900/20" : "bg-purple-50"}`}>
                            <h4 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Customer Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              {selectedNotification.data.customer_name && (
                                <div>
                                  <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Name:</span>
                                  <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.customer_name}</span>
                                </div>
                              )}
                              {selectedNotification.data.email && (
                                <div>
                                  <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Email:</span>
                                  <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.email}</span>
                                </div>
                              )}
                              {selectedNotification.data.company && (
                                <div>
                                  <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Company:</span>
                                  <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.company}</span>
                                </div>
                              )}
                              {selectedNotification.data.plan_name && (
                                <div>
                                  <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Plan:</span>
                                  <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.plan_name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Order Details */}
                        {selectedNotification.type.startsWith('label_order_') && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-green-900/20" : "bg-green-50"}`}>
                            <h4 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Order Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Order ID:</span>
                                <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>#{selectedNotification.data.order_id}</span>
                              </div>
                              <div>
                                <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Product:</span>
                                <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.product_name}</span>
                              </div>
                              <div>
                                <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Bundles:</span>
                                <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.bundle_count}</span>
                              </div>
                              <div>
                                <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Total Labels:</span>
                                <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.label_count}</span>
                              </div>
                              {selectedNotification.data.amount_formatted && (
                                <div>
                                  <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Amount:</span>
                                  <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.amount_formatted}</span>
                                </div>
                              )}
                              {selectedNotification.data.shipping_address && (
                                <div className="col-span-2">
                                  <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Shipping Address:</span>
                                  <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.shipping_address}</span>
                                </div>
                              )}
                              {selectedNotification.data.tracking_number && (
                                <div>
                                  <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Tracking:</span>
                                  <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.tracking_number}</span>
                                </div>
                              )}
                              {selectedNotification.data.cancellation_reason && (
                                <div className="col-span-2">
                                  <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Cancellation Reason:</span>
                                  <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.cancellation_reason}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Device Information */}
                        {selectedNotification.type.startsWith('device_') && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-purple-900/20" : "bg-purple-50"}`}>
                            <h4 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Device Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Device ID:</span>
                                <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.device_id}</span>
                              </div>
                              <div>
                                <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Status:</span>
                                <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.status}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Payment Information */}
                        {(selectedNotification.type.includes('payment') || selectedNotification.data.amount) && (
                          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-yellow-900/20" : "bg-yellow-50"}`}>
                            <h4 className={`font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Payment Information</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              {selectedNotification.data.amount && (
                                <div>
                                  <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Amount:</span>
                                  <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.amount}</span>
                                </div>
                              )}
                              {selectedNotification.data.failure_reason && (
                                <div className="col-span-2">
                                  <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Failure Reason:</span>
                                  <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{selectedNotification.data.failure_reason}</span>
                                </div>
                              )}
                              {selectedNotification.data.next_billing && (
                                <div>
                                  <span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Next Billing:</span>
                                  <span className={`ml-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>{new Date(selectedNotification.data.next_billing).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Raw Data (for debugging) */}
                        <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                          <h4 className={`font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Raw Data:</h4>
                          <pre className="text-xs overflow-auto max-h-32">
                            {JSON.stringify(selectedNotification.data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-between">
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Admin Notifications</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All as Read
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Total</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : ""}`}>{stats.total}</p>
                </div>
                <Bell className={`w-8 h-8 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
              </div>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Unread</p>
                  <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
                </div>
                <EyeOff className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>New Signups</p>
                  <p className="text-2xl font-bold text-green-600">{stats.new_signup}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Upgrades</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.upgrade}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Device Events</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.device_shipped + stats.device_delivered + stats.device_return_requested + stats.device_returned}
                  </p>
                </div>
                <Package className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Label Orders</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.label_order_placed + stats.label_order_paid + stats.label_order_shipped + stats.label_order_delivered + stats.label_order_cancelled}
                  </p>
                </div>
                <Bell className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="new_signup">New Signups</SelectItem>
                    <SelectItem value="upgrade">Upgrades</SelectItem>
                    <SelectItem value="device_shipped">Device Shipped</SelectItem>
                    <SelectItem value="device_delivered">Device Delivered</SelectItem>
                    <SelectItem value="device_return_requested">Return Requested</SelectItem>
                    <SelectItem value="device_returned">Device Returned</SelectItem>
                    <SelectItem value="cancellation">Cancellations</SelectItem>
                    <SelectItem value="payment_failed">Payment Failed</SelectItem>
                    <SelectItem value="payment_recovered">Payment Recovered</SelectItem>
                    <SelectItem value="plan_renewal">Plan Renewed</SelectItem>
                    <SelectItem value="label_order_placed">Label Order Placed</SelectItem>
                    <SelectItem value="label_order_paid">Label Order Paid</SelectItem>
                    <SelectItem value="label_order_shipped">Label Order Shipped</SelectItem>
                    <SelectItem value="label_order_delivered">Label Order Delivered</SelectItem>
                    <SelectItem value="label_order_cancelled">Label Order Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-48">
                <Select value={readFilter} onValueChange={setReadFilter}>
                  <SelectTrigger className={isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""}>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Table */}
        <Card className={isDarkMode ? "bg-gray-800 border-gray-700" : ""}>
          <CardHeader>
            <CardTitle className={isDarkMode ? "text-white" : ""}>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className={isDarkMode ? "border-gray-700" : ""}>
                    <TableHead className={isDarkMode ? "text-gray-300" : ""}>Type</TableHead>
                    <TableHead className={isDarkMode ? "text-gray-300" : ""}>Title</TableHead>
                    <TableHead className={isDarkMode ? "text-gray-300" : ""}>Message</TableHead>
                    <TableHead className={isDarkMode ? "text-gray-300" : ""}>Date</TableHead>
                    <TableHead className={isDarkMode ? "text-gray-300" : ""}>Status</TableHead>
                    <TableHead className={isDarkMode ? "text-gray-300" : ""}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow 
                      key={notification.id} 
                      className={`${!notification.read ? (isDarkMode ? 'bg-blue-900/20' : 'bg-purple-50') : ''} ${isDarkMode ? 'border-gray-700' : ''}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const IconComponent = getTypeIcon(notification.type)
                            return <IconComponent className="w-4 h-4" />
                          })()}
                          {getTypeBadge(notification.type)}
                        </div>
                      </TableCell>
                      <TableCell className={`font-medium ${isDarkMode ? "text-white" : ""}`}>{notification.title}</TableCell>
                      <TableCell className={`max-w-xs truncate ${isDarkMode ? "text-gray-300" : ""}`}>{notification.message}</TableCell>
                      <TableCell className={isDarkMode ? "text-gray-300" : ""}>{formatDate(notification.timestamp)}</TableCell>
                      <TableCell>
                        {notification.read ? (
                          <Badge variant="outline">Read</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Unread</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => showNotificationDetail(notification)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {!notification.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredNotifications.length === 0 && (
              <div className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                No notifications found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 