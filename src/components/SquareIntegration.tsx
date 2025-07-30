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
  RotateCcw,
  Eye
} from 'lucide-react'

// Square Logo SVG Component
const SquareLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <rect x="8" y="8" width="8" height="8" fill="currentColor"/>
  </svg>
)
import { toast } from 'sonner'

interface SquareIntegrationProps {
  userId: string
  onSyncComplete?: (result: any) => void
}

interface SquareStatus {
  connected: boolean
  merchantId: string
  lastSync: string | null
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
    lastSync: null,
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
  
  // Manual connection form
  const [showConnectForm, setShowConnectForm] = useState(false)
  const [connectForm, setConnectForm] = useState({
    square_access_token: '',
    square_merchant_id: '',
    square_location_id: ''
  })
  
  // Sync progress and preview states
  const [syncProgress, setSyncProgress] = useState(0)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed' | 'failed'>('idle')
  const [syncPreview, setSyncPreview] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    loadSquareStatus()
  }, [userId])

  const loadSquareStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

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
      if (!token) return

      const response = await fetch(`/api/square/locations?user_id=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setLocations(data.locations || [])
      }
    } catch (error) {
      console.error('Failed to load locations:', error)
    }
  }

  const connectToSquare = async () => {
    if (!connectForm.square_access_token || !connectForm.square_merchant_id) {
      toast.error('Please enter your Square access token and merchant ID')
      return
    }

    setIsConnecting(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch('/api/square/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...connectForm,
          user_id: userId
        })
      })

      if (response.ok) {
        toast.success('Connected to Square successfully!')
        setShowConnectForm(false)
        setConnectForm({ square_access_token: '', square_merchant_id: '', square_location_id: '' })
        loadSquareStatus()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to connect to Square')
      }
    } catch (error) {
      console.error('Connection error:', error)
      toast.error('Failed to connect to Square')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectSquare = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch('/api/square/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId })
      })

      if (response.ok) {
        toast.success('Disconnected from Square successfully!')
        setShowDisconnectDialog(false)
        loadSquareStatus()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to disconnect from Square')
      }
    } catch (error) {
      console.error('Disconnect error:', error)
      toast.error('Failed to disconnect from Square')
    }
  }

  const previewSync = async () => {
    if (!selectedLocation) {
      toast.error('Please select a location first')
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No authentication token')

      const response = await fetch('/api/square/preview', {
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
        setSyncPreview(result)
        setShowPreview(true)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Preview failed')
      }
    } catch (error) {
      console.error('Preview error:', error)
      toast.error('Preview failed')
    }
  }

  const syncNow = async () => {
    if (!selectedLocation) {
      toast.error('Please select a location first')
      return
    }

    setIsSyncing(true)
    setSyncStatus('syncing')
    setSyncProgress(0)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No authentication token')

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 500)

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

      clearInterval(progressInterval)
      setSyncProgress(100)

      if (response.ok) {
        const result = await response.json()
        setSyncResults(result)
        setSyncStatus('completed')
        toast.success(`Sync completed! ${result.itemsCreated} items created`)
        
        if (onSyncComplete) {
          onSyncComplete(result)
        }
        
        loadSquareStatus()
      } else {
        const error = await response.json()
        setSyncStatus('failed')
        toast.error(error.error || 'Sync failed')
      }
    } catch (error) {
      console.error('Sync error:', error)
      setSyncStatus('failed')
      toast.error('Sync failed')
    } finally {
      setIsSyncing(false)
      setTimeout(() => {
        setSyncProgress(0)
        setSyncStatus('idle')
      }, 2000)
    }
  }

  const updateSyncSettings = async (settings: Partial<SquareStatus>) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('No authentication token')

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
        toast.success('Settings updated successfully!')
        loadSquareStatus()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update settings')
      }
    } catch (error) {
      console.error('Settings update error:', error)
      toast.error('Failed to update settings')
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Integration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SquareLogo />
            Square POS Integration
          </CardTitle>
          <CardDescription>
            Connect your Square POS to automatically sync menu items, ingredients, and allergens.
            <br />
            <span className="text-sm text-amber-600 mt-1 block">
              💡 <strong>Tip:</strong> For best results, add ingredients to your Square item descriptions separated by commas (e.g., "chicken, rice, vegetables")
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status.connected ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Connected to Square</span>
                  <Badge variant="secondary">{status.merchantId}</Badge>
                  {status.lastSync && (
                    <span className="text-sm text-gray-500">
                      Last sync: {new Date(status.lastSync).toLocaleString()}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">Not Connected</span>
                </>
              )}
            </div>
            
            {status.connected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDisconnectDialog(true)}
              >
                Disconnect
              </Button>
            ) : (
              <Button
                onClick={() => setShowConnectForm(true)}
                disabled={isConnecting}
                className="flex items-center gap-2"
              >
                <SquareLogo />
                {isConnecting ? 'Connecting...' : 'Connect to Square'}
              </Button>
            )}
          </div>

          {/* Connection Form */}
          {showConnectForm && (
            <Dialog open={showConnectForm} onOpenChange={setShowConnectForm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect to Square</DialogTitle>
                  <DialogDescription>
                    Enter your Square API credentials to connect your POS system.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="access_token">Access Token</Label>
                    <Input
                      id="access_token"
                      type="password"
                      placeholder="Enter your Square access token"
                      value={connectForm.square_access_token}
                      onChange={(e) => setConnectForm(prev => ({ ...prev, square_access_token: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="merchant_id">Merchant ID</Label>
                    <Input
                      id="merchant_id"
                      placeholder="Enter your Square merchant ID"
                      value={connectForm.square_merchant_id}
                      onChange={(e) => setConnectForm(prev => ({ ...prev, square_merchant_id: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location_id">Location ID (Optional)</Label>
                    <Input
                      id="location_id"
                      placeholder="Enter your Square location ID"
                      value={connectForm.square_location_id}
                      onChange={(e) => setConnectForm(prev => ({ ...prev, square_location_id: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={connectToSquare} disabled={isConnecting}>
                      {isConnecting ? 'Connecting...' : 'Connect'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowConnectForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Disconnect Dialog */}
          <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Disconnect from Square</DialogTitle>
                <DialogDescription>
                  Are you sure you want to disconnect from Square? This will remove all stored credentials.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={disconnectSquare}>
                  Disconnect
                </Button>
                <Button variant="outline" onClick={() => setShowDisconnectDialog(false)}>
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Sync Controls */}
          {status.connected && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label>Location</Label>
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
                <div className="flex gap-2 mt-6">
                  <Button
                    onClick={previewSync}
                    disabled={!selectedLocation}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    onClick={syncNow}
                    disabled={isSyncing || !selectedLocation}
                    className="flex items-center gap-2"
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <SquareLogo />
                        Sync Now
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Sync Progress Indicator */}
              {syncStatus === 'syncing' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Syncing data from Square...</span>
                    <span>{Math.round(syncProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${syncProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Sync Status Messages */}
              {syncStatus === 'completed' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Sync completed successfully!</span>
                </div>
              )}
              {syncStatus === 'failed' && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  <span>Sync failed. Please try again.</span>
                </div>
              )}
            </div>
          )}

          {/* Sync Results */}
          {syncResults && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Last Sync Results</h4>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>Items Processed: {syncResults.itemsProcessed}</div>
                <div>Items Created: {syncResults.itemsCreated}</div>
                <div>Items Failed: {syncResults.itemsFailed}</div>
                <div>Duration: {syncResults.duration}ms</div>
              </div>
              
              {/* Detailed Sync Results */}
              {syncResults.syncedItems && syncResults.syncedItems.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium mb-2">Synced Items:</h5>
                  <div className="max-h-40 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Ingredients</TableHead>
                          <TableHead>Allergens</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {syncResults.syncedItems.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-xs">
                              {item.ingredients.length > 0 ? item.ingredients.join(', ') : 'None detected'}
                            </TableCell>
                            <TableCell className="text-xs">
                              {item.allergens.length > 0 ? item.allergens.join(', ') : 'None detected'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={item.status === 'created' ? 'default' : 'secondary'}>
                                {item.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              
              {/* Failed Items */}
              {syncResults.failedItems && syncResults.failedItems.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-red-600 mb-2">Failed Items:</h5>
                  <div className="max-h-40 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Error</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {syncResults.failedItems.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-xs text-red-600">{item.error}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              
              {/* General Errors */}
              {syncResults.errors && syncResults.errors.length > 0 && (
                <div className="mt-2">
                  <h5 className="font-medium text-red-600">General Errors:</h5>
                  <ul className="text-xs text-red-600">
                    {syncResults.errors.map((error: string, index: number) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Sync Statistics */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{status.itemsSynced}</div>
              <div className="text-xs text-green-600">Synced</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{status.itemsPending}</div>
              <div className="text-xs text-yellow-600">Pending</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{status.itemsFailed}</div>
              <div className="text-xs text-red-600">Failed</div>
            </div>
          </div>

          {/* Last Sync Info */}
          {status.lastSync && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last synced: {new Date(status.lastSync).toLocaleString()}
            </div>
          )}

          {/* Quick Actions */}
          {status.connected && (
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://developer.squareup.com/apps', '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Square Developer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sync Preview</DialogTitle>
            <DialogDescription>
              Preview what will be synced from Square before proceeding
            </DialogDescription>
          </DialogHeader>
          
          {syncPreview && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{syncPreview.itemsProcessed || 0}</div>
                  <div className="text-xs text-blue-600">Items Found</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{syncPreview.itemsToCreate || 0}</div>
                  <div className="text-xs text-green-600">Will Create</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{syncPreview.itemsToSkip || 0}</div>
                  <div className="text-xs text-yellow-600">Will Skip</div>
                </div>
              </div>

              {syncPreview.items && syncPreview.items.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Items to be processed:</h4>
                  <div className="max-h-60 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Ingredients</TableHead>
                          <TableHead>Allergens</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {syncPreview.items.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-xs max-w-xs truncate">{item.description}</TableCell>
                            <TableCell className="text-xs">
                              {item.ingredients && item.ingredients.length > 0 ? item.ingredients.join(', ') : 'None detected'}
                            </TableCell>
                            <TableCell className="text-xs">
                              {item.allergens && item.allergens.length > 0 ? item.allergens.join(', ') : 'None detected'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={item.action === 'create' ? 'default' : 'secondary'}>
                                {item.action}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  setShowPreview(false)
                  syncNow()
                }}>
                  Proceed with Sync
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 