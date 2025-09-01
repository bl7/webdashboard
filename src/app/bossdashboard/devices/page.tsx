"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Download,
  Mail,
  Eye,
  Edit,
  Save,
  X,
} from "lucide-react"
import { useDarkMode } from "../context/DarkModeContext"

interface Device {
  id: number
  user_id: string
  plan_id: number
  assigned_at: string
  shipped_at: string | null
  delivered_at: string | null
  return_requested_at: string | null
  returned_at: string | null
  device_type: string | null
  device_identifier: string | null
  status: "pending" | "shipped" | "delivered" | "return_requested" | "returned" | "lost"
  notes: string | null
  created_at: string
  updated_at: string
  customer_name?: string
  customer_email?: string
  plan_name?: string
  subscription_status?: string
}

interface DeviceStats {
  total: number
  pending: number
  shipped: number
  delivered: number
  return_requested: number
  returned: number
  lost: number
}

export default function DevicesPage() {
  const { isDarkMode } = useDarkMode()
  const [devices, setDevices] = useState<Device[]>([])
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([])
  const [stats, setStats] = useState<DeviceStats>({
    total: 0,
    pending: 0,
    shipped: 0,
    delivered: 0,
    return_requested: 0,
    returned: 0,
    lost: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [updatingDevice, setUpdatingDevice] = useState<number | null>(null)

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    deviceId: number
    newStatus: string
    deviceName: string
    currentStatus: string
  } | null>(null)

  // Device details modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [editingDevice, setEditingDevice] = useState<Partial<Device> | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [savingDevice, setSavingDevice] = useState(false)

  useEffect(() => {
    fetchDevices()
  }, [])

  useEffect(() => {
    filterDevices()
  }, [devices, searchTerm, statusFilter])

  const fetchDevices = async () => {
    try {
      const bossToken = typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
      const response = await fetch("/api/devices", {
        headers: bossToken
          ? { Authorization: `Bearer ${bossToken}`, "Content-Type": "application/json" }
          : { "Content-Type": "application/json" },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Devices data received:", data)
        console.log("First device details:", data.devices?.[0])
        setDevices(data.devices || [])
        calculateStats(data.devices || [])
      } else {
        console.error("Failed to fetch devices:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Failed to fetch devices:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (deviceList: Device[]) => {
    const stats = {
      total: deviceList.length,
      pending: deviceList.filter((d) => d.status === "pending").length,
      shipped: deviceList.filter((d) => d.status === "shipped").length,
      delivered: deviceList.filter((d) => d.status === "delivered").length,
      return_requested: deviceList.filter((d) => d.status === "return_requested").length,
      returned: deviceList.filter((d) => d.status === "returned").length,
      lost: deviceList.filter((d) => d.status === "lost").length,
    }
    setStats(stats)
  }

  const filterDevices = () => {
    let filtered = devices

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (device) =>
          device.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          device.device_identifier?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((device) => device.status === statusFilter)
    }

    setFilteredDevices(filtered)
  }

  const updateDeviceStatus = async (deviceId: number, newStatus: string) => {
    setUpdatingDevice(deviceId)
    try {
      const bossToken = typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
      const response = await fetch(`/api/devices/${deviceId}`, {
        method: "PATCH",
        headers: bossToken
          ? { Authorization: `Bearer ${bossToken}`, "Content-Type": "application/json" }
          : { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchDevices() // Refresh the data
      } else {
        console.error("Failed to update device status:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("Failed to update device status:", error)
    } finally {
      setUpdatingDevice(null)
    }
  }

  const handleStatusChange = (
    deviceId: number,
    newStatus: string,
    deviceName: string,
    currentStatus: string
  ) => {
    setPendingStatusChange({
      deviceId,
      newStatus,
      deviceName,
      currentStatus,
    })
    setShowConfirmModal(true)
  }

  const confirmStatusChange = async () => {
    if (pendingStatusChange) {
      await updateDeviceStatus(pendingStatusChange.deviceId, pendingStatusChange.newStatus)
      setShowConfirmModal(false)
      setPendingStatusChange(null)
    }
  }

  const cancelStatusChange = () => {
    setShowConfirmModal(false)
    setPendingStatusChange(null)
  }

  const openDeviceDetails = (device: Device) => {
    setSelectedDevice(device)
    setEditingDevice({ ...device })
    setIsEditing(false)
    setShowDetailsModal(true)
  }

  const closeDeviceDetails = () => {
    setShowDetailsModal(false)
    setSelectedDevice(null)
    setEditingDevice(null)
    setIsEditing(false)
  }

  const startEditing = () => {
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setEditingDevice(selectedDevice ? { ...selectedDevice } : null)
    setIsEditing(false)
  }

  const saveDeviceDetails = async () => {
    if (!editingDevice || !selectedDevice) return

    setSavingDevice(true)
    try {
      const updateData = {
        device_type: editingDevice.device_type,
        device_identifier: editingDevice.device_identifier,
        notes: editingDevice.notes,
      }

      console.log("Sending update data:", updateData)
      console.log("Current editingDevice:", editingDevice)

      const bossToken = typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
      const response = await fetch(`/api/devices/${selectedDevice.id}`, {
        method: "PATCH",
        headers: bossToken
          ? { Authorization: `Bearer ${bossToken}`, "Content-Type": "application/json" }
          : { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log("Update response:", result)

        // Update the selected device with the response data
        if (result.device) {
          setSelectedDevice(result.device)
        }

        await fetchDevices() // Refresh the data
        setIsEditing(false)
      } else {
        const errorText = await response.text()
        console.error(
          "Failed to update device details:",
          response.status,
          response.statusText,
          errorText
        )
      }
    } catch (error) {
      console.error("Failed to update device details:", error)
    } finally {
      setSavingDevice(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Package },
      shipped: { color: "bg-purple-100 text-blue-800", icon: Truck },
      delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      return_requested: { color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
      returned: { color: "bg-purple-100 text-purple-800", icon: RotateCcw },
      lost: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    )
  }

  const getStatusOptions = (currentStatus: string) => {
    const statusFlow = {
      pending: ["shipped", "return_requested"],
      shipped: ["delivered", "return_requested", "pending"],
      delivered: ["return_requested", "shipped"],
      return_requested: ["returned", "lost", "delivered"],
      returned: ["pending", "return_requested"],
      lost: ["pending", "return_requested"],
    }

    return statusFlow[currentStatus as keyof typeof statusFlow] || []
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const exportDevices = () => {
    const csvContent = [
      [
        "Device ID",
        "Device Identifier",
        "Customer Name",
        "Customer Email",
        "Plan",
        "Status",
        "Assigned Date",
        "Shipped Date",
        "Delivered Date",
        "Return Requested",
        "Returned Date",
        "Notes",
      ].join(","),
      ...filteredDevices.map((device) =>
        [
          device.id,
          device.device_identifier || "N/A",
          device.customer_name || "N/A",
          device.customer_email || "N/A",
          device.plan_name || "N/A",
          device.status,
          formatDate(device.assigned_at),
          formatDate(device.shipped_at),
          formatDate(device.delivered_at),
          formatDate(device.return_requested_at),
          formatDate(device.returned_at),
          device.notes || "",
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `devices-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Device Management</h1>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="mb-2 h-4 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-8 animate-pulse rounded bg-gray-200"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-6">
      <div className="space-y-6">
        {/* Confirmation Modal */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Status Change</DialogTitle>
              <DialogDescription>
                Are you sure you want to change the status of device {pendingStatusChange?.deviceId}
                from{" "}
                <strong>
                  {pendingStatusChange?.currentStatus.replace("_", " ").toUpperCase()}
                </strong>
                to <strong>{pendingStatusChange?.newStatus.replace("_", " ").toUpperCase()}</strong>
                ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={cancelStatusChange}>
                Cancel
              </Button>
              <Button onClick={confirmStatusChange} disabled={updatingDevice !== null}>
                {updatingDevice === pendingStatusChange?.deviceId ? "Updating..." : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Device Details Modal */}
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Device Details</DialogTitle>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={startEditing}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={cancelEditing}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveDeviceDetails} disabled={savingDevice}>
                        <Save className="mr-2 h-4 w-4" />
                        {savingDevice ? "Saving..." : "Save"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DialogHeader>

            {selectedDevice && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Device ID
                      </label>
                      <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                        <span className="font-mono">{selectedDevice.id}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Device Type
                      </label>
                      {isEditing ? (
                        <Input
                          value={editingDevice?.device_type || ""}
                          onChange={(e) =>
                            setEditingDevice((prev) => ({ ...prev, device_type: e.target.value }))
                          }
                          placeholder="e.g., Mobile Device, Epson TM-T20"
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                          {selectedDevice.device_type || "Not specified"}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Device Identifier
                      </label>
                      {isEditing ? (
                        <Input
                          value={editingDevice?.device_identifier || ""}
                          onChange={(e) =>
                            setEditingDevice((prev) => ({
                              ...prev,
                              device_identifier: e.target.value,
                            }))
                          }
                          placeholder="e.g., SN123456789, MAC:AA:BB:CC:DD:EE:FF"
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                          {selectedDevice.device_identifier || "Not specified"}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </label>
                      <div className="mt-1">{getStatusBadge(selectedDevice.status)}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Customer Name
                      </label>
                      <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                        {selectedDevice.customer_name || "N/A"}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Customer Email
                      </label>
                      <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                        {selectedDevice.customer_email || "N/A"}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Plan
                      </label>
                      <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                        {selectedDevice.plan_name || "N/A"}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subscription Status
                      </label>
                      <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                        {selectedDevice.subscription_status || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Information */}
                <div>
                  <h3 className="mb-4 text-lg font-medium">Device Timeline</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Assigned At
                      </label>
                      <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                        {formatDateTime(selectedDevice.assigned_at)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Shipped At
                      </label>
                      <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                        {formatDateTime(selectedDevice.shipped_at)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Delivered At
                      </label>
                      <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                        {formatDateTime(selectedDevice.delivered_at)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Return Requested At
                      </label>
                      <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                        {formatDateTime(selectedDevice.return_requested_at)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Returned At
                      </label>
                      <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                        {formatDateTime(selectedDevice.returned_at)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Created At
                      </label>
                      <div className="mt-1 rounded border bg-gray-50 p-2 dark:bg-gray-800">
                        {formatDateTime(selectedDevice.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  {isEditing ? (
                    <Textarea
                      value={editingDevice?.notes || ""}
                      onChange={(e) =>
                        setEditingDevice((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      placeholder="Add any notes about this device..."
                      className="mt-1"
                      rows={4}
                    />
                  ) : (
                    <div className="mt-1 min-h-[100px] rounded border bg-gray-50 p-2 dark:bg-gray-800">
                      {selectedDevice.notes || "No notes added"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Device Management</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportDevices}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Devices</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Shipment</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Package className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Transit</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Return Required</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.return_requested}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder="Search by customer name, email, device ID, or device identifier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="return_requested">Return Required</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Devices Table */}
        <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
          <CardHeader>
            <CardTitle>Device Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device ID</TableHead>
                    <TableHead>Device Identifier</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-mono">{device.id}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {device.device_identifier || "Not set"}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{device.customer_name || "N/A"}</div>
                          <div className="text-sm text-gray-500">
                            {device.customer_email || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{device.plan_name || "N/A"}</div>
                          <div className="text-sm text-gray-500">
                            {device.subscription_status || "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(device.status)}</TableCell>
                      <TableCell>{formatDate(device.assigned_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeviceDetails(device)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Details
                          </Button>
                          <Select
                            value={device.status}
                            onValueChange={(value) =>
                              handleStatusChange(
                                device.id,
                                value,
                                device.customer_name || "Unknown",
                                device.status
                              )
                            }
                            disabled={updatingDevice === device.id}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getStatusOptions(device.status).map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status.replace("_", " ").toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredDevices.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No devices found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
