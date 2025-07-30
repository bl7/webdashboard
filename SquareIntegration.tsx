'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Settings, 
  ExternalLink, 
  AlertTriangle,
  Clock,
  Database,
  RotateCcw
} from 'lucide-react'
import { toast } from 'sonner'

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
    merchantId: '',
    syncEnabled: false,
    syncFrequency: 24,
    itemsSynced: 0,
    itemsPending: 0,
    itemsFailed: 0
  })
  
  const [locations, setLocations] = useState<SquareLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)
  const [syncResults, setSyncResults] = useState<any>(null)

  // Load Square integration status
  useEffect(() => {
    loadSquareStatus()
  }, [userId])

  const loadSquareStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/square/status?user_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStatus(data)
        
        if (data.connected) {
          loadLocations()
        }
      }
    } catch (error) {
      console.error('Failed to load Square status:', error)
    }
  }

  const loadLocations = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/square/locations?user_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setLocations(data.locations || [])
        if (data.locations?.length > 0) {
          setSelectedLocation(data.locations[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to load locations:', error)
    }
  }

  const connectToSquare = async () => {
    setIsConnecting(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/square/connect', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId })
      })
      
      if (response.ok) {
        const data = await response.json()
        window.location.href = data.authUrl
      } else {
        toast.error('Failed to initiate Square connection')
      }
    } catch (error) {
      toast.error('Connection failed')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectSquare = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/square/disconnect', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId })
      })
      
      if (response.ok) {
        setStatus(prev => ({ ...prev, connected: false, merchantId: '' }))
        setLocations([])
        setSelectedLocation('')
        toast.success('Square disconnected successfully')
      } else {
        toast.error('Failed to disconnect Square')
      }
    } catch (error) {
      toast.error('Disconnection failed')
    }
  }

  const syncNow = async () => {
    if (!selectedLocation) {
      toast.error('Please select a location first')
      return
    }

    setIsSyncing(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/square/sync', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          user_id: userId,
          location_id: selectedLocation
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        setSyncResults(result)
        await loadSquareStatus() // Refresh status
        
        if (result.success) {
          toast.success(`Sync completed! ${result.itemsCreated} items created, ${result.itemsUpdated} updated`)
          onSyncComplete?.(result)
        } else {
          toast.error(`Sync failed: ${result.errors.join(', ')}`)
        }
      } else {
        toast.error('Sync failed')
      }
    } catch (error) {
      toast.error('Sync failed')
    } finally {
      setIsSyncing(false)
    }
  }

  const updateSyncSettings = async (settings: Partial<SquareStatus>) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/square/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          user_id: userId,
          ...settings
        })
      })
      
      if (response.ok) {
        setStatus(prev => ({ ...prev, ...settings }))
        toast.success('Settings updated')
      } else {
        toast.error('Failed to update settings')
      }
    } catch (error) {
      toast.error('Settings update failed')
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
                <Database className="h-5 w-5" />
                Square POS Integration
              </CardTitle>
              <CardDescription>
                Connect your Square POS to automatically sync menu items and ingredients
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {status.connected ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <XCircle className="h-3 w-3 mr-1" />
                  Disconnected
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!status.connected ? (
            <div className="text-center py-8">
              <Database className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Connect to Square POS</h3>
              <p className="text-gray-600 mb-6">
                Sync your Square menu items automatically with InstaLabel for seamless label generation.
              </p>
              <Button 
                onClick={connectToSquare} 
                disabled={isConnecting}
                className="w-full sm:w-auto"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect to Square
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Connection Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Connected</span>
                  </div>
                  <p className="text-sm text-gray-600">Merchant ID: {status.merchantId}</p>
                </div>
                
                                 <div className="p-4 border rounded-lg">
                   <div className="flex items-center gap-2 mb-2">
                     <RotateCcw className="h-4 w-4 text-blue-600" />
                     <span className="font-medium">Sync Status</span>
                   </div>
                   <p className="text-sm text-gray-600">
                     {status.itemsSynced} synced, {status.itemsPending} pending
                   </p>
                 </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Last Sync</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {status.lastSync ? new Date(status.lastSync).toLocaleDateString() : 'Never'}
                  </p>
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={syncNow} 
                  disabled={isSyncing || !selectedLocation}
                  className="flex-1"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                                     ) : (
                     <>
                       <RotateCcw className="h-4 w-4 mr-2" />
                       Sync Now
                     </>
                   )}
                </Button>
                
                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Square Integration Settings</DialogTitle>
                      <DialogDescription>
                        Configure your Square integration preferences
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-sync">Auto Sync</Label>
                          <p className="text-sm text-gray-600">
                            Automatically sync when Square items change
                          </p>
                        </div>
                        <Switch
                          id="auto-sync"
                          checked={status.syncEnabled}
                          onCheckedChange={(checked) => 
                            updateSyncSettings({ syncEnabled: checked })
                          }
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sync-frequency">Sync Frequency (hours)</Label>
                        <Input
                          id="sync-frequency"
                          type="number"
                          min="1"
                          max="168"
                          value={status.syncFrequency}
                          onChange={(e) => 
                            updateSyncSettings({ syncFrequency: parseInt(e.target.value) })
                          }
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Disconnect Square Integration</DialogTitle>
                      <DialogDescription>
                        This will remove the Square connection and stop automatic syncing. 
                        Your existing menu items will remain unchanged.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
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
                <div className="mt-4 p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Last Sync Results</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Processed:</span>
                      <span className="ml-2 font-medium">{syncResults.itemsProcessed}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <span className="ml-2 font-medium text-green-600">{syncResults.itemsCreated}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Updated:</span>
                      <span className="ml-2 font-medium text-blue-600">{syncResults.itemsUpdated}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Failed:</span>
                      <span className="ml-2 font-medium text-red-600">{syncResults.itemsFailed}</span>
                    </div>
                  </div>
                  {syncResults.errors.length > 0 && (
                    <div className="mt-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600 inline mr-1" />
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

      {/* Sync History Table */}
      {status.connected && (
        <Card>
          <CardHeader>
            <CardTitle>Sync History</CardTitle>
            <CardDescription>
              Recent synchronization activity with Square
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* This would be populated with actual sync history data */}
                <TableRow>
                  <TableCell>2024-01-15 14:30</TableCell>
                  <TableCell>Menu Items</TableCell>
                  <TableCell>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Success
                    </Badge>
                  </TableCell>
                  <TableCell>12 created, 3 updated</TableCell>
                  <TableCell>2.3s</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 