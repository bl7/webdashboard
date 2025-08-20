"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  ExternalLink,
  AlertTriangle,
  Clock,
  Database,
  RotateCcw,
  Shield,
} from "lucide-react"
import { toast } from "sonner"

interface SquareIntegrationProps {
  userId: string
  onSyncComplete?: (result: any) => void
}

interface SquareStatus {
  connected: boolean
  merchantId: string
  lastSync?: string
  syncEnabled: boolean
  syncFrequency: number
  itemsSynced: number
  itemsPending: number
  itemsFailed: number
}

interface SquareLocation {
  id: string
  name: string
  address: {
    address_line_1: string
    locality: string
    administrative_district_level_1: string
    postal_code: string
  }
}

export default function SquareIntegration({ userId, onSyncComplete }: SquareIntegrationProps) {
  const [status, setStatus] = useState<SquareStatus>({
    connected: false,
    merchantId: "",
    syncEnabled: false,
    syncFrequency: 24,
    itemsSynced: 0,
    itemsPending: 0,
    itemsFailed: 0,
  })

  const [locations, setLocations] = useState<SquareLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)
  const [syncResults, setSyncResults] = useState<any>(null)
  const [syncType, setSyncType] = useState<"import" | "export">("import")

  // Load Square integration status
  useEffect(() => {
    loadSquareStatus()
  }, [userId])

  const loadSquareStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/square/status?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setStatus(data)

        if (data.connected) {
          loadLocations()
        }
      }
    } catch (error) {
      console.error("Failed to load Square status:", error)
    }
  }

  const loadLocations = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/square/locations?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setLocations(data.locations || [])
        if (data.locations?.length > 0) {
          setSelectedLocation(data.locations[0].id)
        }
      }
    } catch (error) {
      console.error("Failed to load locations:", error)
    }
  }

  const connectToSquare = async () => {
    setIsConnecting(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/square/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      })

      if (response.ok) {
        const data = await response.json()
        window.location.href = data.authUrl
      } else {
        toast.error("Failed to initiate Square connection")
      }
    } catch (error) {
      toast.error("Connection failed")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectSquare = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/square/disconnect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      })

      if (response.ok) {
        setStatus((prev) => ({ ...prev, connected: false, merchantId: "" }))
        setLocations([])
        setSelectedLocation("")
        toast.success("Square disconnected successfully")
      } else {
        toast.error("Failed to disconnect Square")
      }
    } catch (error) {
      toast.error("Disconnection failed")
    }
  }

  const syncNow = async () => {
    if (!selectedLocation) {
      toast.error("Please select a location first")
      return
    }

    setIsSyncing(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/square/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          location_id: selectedLocation,
          syncOptions: {
            syncType: syncType,
          },
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSyncResults(result)
        await loadSquareStatus() // Refresh status

        if (result.success) {
          toast.success(
            `Sync completed! ${result.itemsCreated} items created, ${result.itemsUpdated} updated`
          )
          onSyncComplete?.(result)
        } else {
          toast.error(`Sync failed: ${result.errors.join(", ")}`)
        }
      } else {
        toast.error("Sync failed")
      }
    } catch (error) {
      toast.error("Sync failed")
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Integration Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-black">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </div>
                Square POS Integration
              </CardTitle>
              <CardDescription>
                Connect your Square POS to automatically sync menu items and ingredients
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {status.connected ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <XCircle className="mr-1 h-3 w-3" />
                  Disconnected
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!status.connected ? (
            <div className="py-8 text-center">
              <Database className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold">Connect to Square POS</h3>
              <p className="mb-6 text-gray-600">
                Sync your Square menu items automatically with InstaLabel for seamless label
                generation.
              </p>
              <Button
                onClick={connectToSquare}
                disabled={isConnecting}
                className="w-full sm:w-auto"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect to Square
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Connection Info */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Connected</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowDisconnectDialog(true)}
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Disconnect
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">Merchant ID: {status.merchantId}</p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Sync Status</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {status.itemsSynced} synced, {status.itemsPending} pending
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Last Sync</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      {status.lastSync ? new Date(status.lastSync).toLocaleDateString() : "Never"}
                    </p>
                    {syncResults && (
                      <>
                        <p className="text-xs text-gray-500">
                          Type:{" "}
                          {syncType === "import"
                            ? "Import"
                            : syncType === "export"
                              ? "Export"
                              : syncType === "create-only"
                                ? "Safe Sync"
                                : "Bidirectional"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Status: <span className="font-medium text-green-600">Success</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Duration: {(syncResults.duration / 1000).toFixed(1)}s
                        </p>
                        <p className="text-xs text-gray-500">
                          Items:{" "}
                          {syncResults.itemsCreated > 0 && `${syncResults.itemsCreated} created`}
                          {syncResults.itemsCreated > 0 && syncResults.itemsUpdated > 0 && ", "}
                          {syncResults.itemsUpdated > 0 && `${syncResults.itemsUpdated} updated`}
                          {syncResults.itemsCreated === 0 &&
                            syncResults.itemsUpdated === 0 &&
                            "No changes"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Selection */}
              {locations.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="location">Select Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sync Options */}
              <div className="space-y-2">
                <Label htmlFor="sync-type">Sync Type</Label>
                <Select
                  value={syncType}
                  onValueChange={(value: "import" | "export") => setSyncType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sync type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="import">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Import Only (Square → InstaLabel)
                      </div>
                    </SelectItem>
                    <SelectItem value="export">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Export Only (InstaLabel → Square)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">
                  {syncType === "import" &&
                    "Import menu items and ingredients from Square to InstaLabel"}
                  {syncType === "export" && "Export your ingredients and menu items to Square"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={syncNow}
                  disabled={isSyncing || !selectedLocation}
                  className="flex-1"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      {syncType === "import" && "Import from Square"}
                      {syncType === "export" && "Export to Square"}
                    </>
                  )}
                </Button>

                <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Disconnect Square Integration</DialogTitle>
                      <DialogDescription>
                        This will remove the Square connection and stop automatic syncing. Your
                        existing menu items will remain unchanged.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowDisconnectDialog(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={disconnectSquare}>
                        Disconnect
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Sync Results */}
              {syncResults && (
                <div className="mt-4 rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Last Sync Results</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                    <div>
                      <span className="text-gray-600">Processed:</span>
                      <span className="ml-2 font-medium">{syncResults.itemsProcessed}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-2 font-medium text-green-600">
                        {syncResults.itemsCreated}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Updated:</span>
                      <span className="ml-2 font-medium text-blue-600">
                        {syncResults.itemsUpdated}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Failed:</span>
                      <span className="ml-2 font-medium text-red-600">
                        {syncResults.itemsFailed}
                      </span>
                    </div>
                  </div>

                  {/* Show detailed stats */}
                  {syncResults.stats && (
                    <div className="mt-3 border-t pt-3">
                      <div className="grid grid-cols-2 gap-4 text-xs md:grid-cols-3">
                        <div>
                          <span className="text-gray-500">Allergens:</span>
                          <span className="ml-1 font-medium">
                            {syncResults.stats.allergens?.existing || 0} existing,{" "}
                            {syncResults.stats.allergens?.created || 0} created
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Ingredients:</span>
                          <span className="ml-1 font-medium">
                            {syncResults.stats.ingredients?.existing || 0} existing,{" "}
                            {syncResults.stats.ingredients?.created || 0} created
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Menu Items:</span>
                          <span className="ml-1 font-medium">
                            {syncResults.stats.menuItems?.existing || 0} existing,{" "}
                            {syncResults.stats.menuItems?.created || 0} created
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {syncResults.errors.length > 0 && (
                    <div className="mt-2">
                      <AlertTriangle className="mr-1 inline h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-600">
                        {syncResults.errors.length} error(s) occurred
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
