"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Printer, Eye } from "lucide-react"
import { toast } from "sonner"
import { usePrinter } from "@/context/PrinterContext"
import { getAllIngredients, getAllMenuItems } from "@/lib/api"
import { formatLabelForPrintImage } from "@/app/dashboard/print/labelFormatter"
import { PrintQueueItem } from "@/types/print"
import { logAction } from "@/lib/logAction"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Helper function to get printer name (same as other pages)
function getPrinterName(printer: any): string {
  if (!printer) return ""
  if (typeof printer === "string") return printer
  if (typeof printer.name === "object" && typeof printer.name.name === "string")
    return printer.name.name
  if (typeof printer.name === "string") return printer.name
  return ""
}

// Helper functions for expiry date calculation (same as print page)
function calculateExpiryDate(days: number): string {
  const today = new Date()
  today.setDate(today.getDate() + days)
  return today.toISOString().split("T")[0]
}

function getDefaultExpiryDays(type: "cooked" | "prep" | "ppds" | "default"): number {
  switch (type) {
    case "cooked":
      return 1
    case "prep":
      return 3
    case "ppds":
      return 5
    case "default":
      return 2
    default:
      return 3
  }
}

interface BulkPrintList {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  item_count: number
}

interface BulkPrintManagerProps {
  onPrintList?: (listId: string) => void
  onViewList?: (listId: string) => void
}

export default function BulkPrintManager({ onPrintList, onViewList }: BulkPrintManagerProps) {
  const [lists, setLists] = useState<BulkPrintList[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingList, setEditingList] = useState<BulkPrintList | null>(null)
  const [newListName, setNewListName] = useState("")
  const [newListDescription, setNewListDescription] = useState("")
  const [editListName, setEditListName] = useState("")
  const [editListDescription, setEditListDescription] = useState("")
  const [isPrinting, setIsPrinting] = useState(false)
  const [expiryDays, setExpiryDays] = useState<Record<string, string>>({})
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Printer selection state
  const [selectedPrinterName, setSelectedPrinterName] = useState<string>("")

  const {
    isConnected,
    print,
    selectedPrinter,
    defaultPrinter,
    printers: availablePrinters,
  } = usePrinter()

  // Ensure component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load admin status from localStorage
  useEffect(() => {
    if (!mounted) return
    setIsAdmin(localStorage.getItem("adminAccess") === "true")
  }, [mounted])

  // Fetch lists on component mount
  useEffect(() => {
    fetchLists()
    fetchExpirySettings()
  }, [])

  // Initialize printer selection when printers are available
  useEffect(() => {
    if (availablePrinters && availablePrinters.length > 0 && !selectedPrinterName) {
      // Try to use default printer first, then first available
      const defaultPrinterName = defaultPrinter ? getPrinterName(defaultPrinter) : ""
      const firstPrinterName = getPrinterName(availablePrinters[0])

      if (
        defaultPrinterName &&
        availablePrinters.some((p) => getPrinterName(p) === defaultPrinterName)
      ) {
        setSelectedPrinterName(defaultPrinterName)
      } else if (firstPrinterName) {
        setSelectedPrinterName(firstPrinterName)
      }
    }
  }, [availablePrinters, defaultPrinter, selectedPrinterName])

  const fetchExpirySettings = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/label-settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch expiry settings")
      }

      const data = await response.json()
      const expiryMap = Object.fromEntries(
        (data.settings || []).map((item: any) => [item.label_type, item.expiry_days.toString()])
      )
      setExpiryDays(expiryMap)
    } catch (error) {
      console.error("Failed to load expiry settings:", error)
      // Use default values if fetch fails
      setExpiryDays({})
    }
  }

  const fetchLists = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("/api/bulk-print/lists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch lists")
      }

      const data = await response.json()
      setLists(data.lists || [])
    } catch (error) {
      console.error("Error fetching lists:", error)
      toast.error("Failed to fetch bulk print lists")
    } finally {
      setLoading(false)
    }
  }

  const createList = async () => {
    if (!newListName.trim()) {
      toast.error("List name is required")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("/api/bulk-print/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newListName.trim(),
          description: newListDescription.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create list")
      }

      const data = await response.json()
      setLists((prev) => [data.list, ...prev])
      setNewListName("")
      setNewListDescription("")
      setIsCreateDialogOpen(false)
      toast.success("Bulk print list created successfully")
    } catch (error) {
      console.error("Error creating list:", error)
      toast.error("Failed to create bulk print list")
    }
  }

  const updateList = async () => {
    if (!editingList || !editListName.trim()) {
      toast.error("List name is required")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/bulk-print/lists/${editingList.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editListName.trim(),
          description: editListDescription.trim() || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update list")
      }

      const data = await response.json()
      setLists((prev) => prev.map((list) => (list.id === editingList.id ? data.list : list)))
      setIsEditDialogOpen(false)
      setEditingList(null)
      toast.success("Bulk print list updated successfully")
    } catch (error) {
      console.error("Error updating list:", error)
      toast.error("Failed to update bulk print list")
    }
  }

  const deleteList = async (listId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this bulk print list? This action cannot be undone."
      )
    ) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/bulk-print/lists/${listId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete list")
      }

      setLists((prev) => prev.filter((list) => list.id !== listId))
      toast.success("Bulk print list deleted successfully")
    } catch (error) {
      console.error("Error deleting list:", error)
      toast.error("Failed to delete bulk print list")
    }
  }

  const openEditDialog = (list: BulkPrintList) => {
    setEditingList(list)
    setEditListName(list.name)
    setEditListDescription(list.description || "")
    setIsEditDialogOpen(true)
  }

  const printListDirectly = async (listId: string) => {
    if (isPrinting) return

    try {
      setIsPrinting(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Authentication required")
        return
      }

      // Get list details and items
      const [listResponse, itemsResponse] = await Promise.all([
        fetch(`/api/bulk-print/lists/${listId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`/api/bulk-print/lists/${listId}/items`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (!listResponse.ok || !itemsResponse.ok) {
        throw new Error("Failed to fetch list data")
      }

      const { list } = await listResponse.json()
      const { items } = await itemsResponse.json()

      if (items.length === 0) {
        toast.error("No items in this list to print")
        return
      }

      // Fetch fresh data from external API
      const [ingredientsData, menuItemsData] = await Promise.all([
        getAllIngredients(token),
        getAllMenuItems(token),
      ])

      const allIngredients = Array.isArray(ingredientsData)
        ? ingredientsData
        : ingredientsData?.data || []

      // Flatten menu items from categories
      const allMenuItems: any[] = []
      const categories = Array.isArray(menuItemsData) ? menuItemsData : menuItemsData?.data || []
      for (const category of categories) {
        for (const item of category.items || []) {
          allMenuItems.push({
            ...item,
            categoryName: category.categoryName,
          })
        }
      }

      // Convert to PrintQueueItem format
      const printItems: PrintQueueItem[] = items.map((item: any) => {
        const uniqueId = `bulk-${item.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`

        if (item.item_type === "ingredient") {
          const ingredient = allIngredients.find((ing: any) => ing.uuid === item.item_id)
          // For ingredients, use their own expiry date or default to 3 days
          const defaultIngredientDays = 3
          const expiryDate = ingredient?.expiryDate || calculateExpiryDate(defaultIngredientDays)

          return {
            uid: uniqueId,
            id: item.item_id,
            type: "ingredients" as const,
            name: item.item_name,
            quantity: item.quantity,
            allergens: ingredient?.allergens || [],
            printedOn: new Date().toISOString().split("T")[0],
            expiryDate,
          }
        } else {
          const menuItem = allMenuItems.find((menu: any) => menu.menuItemID === item.item_id)
          // For menu items, use database expiry days based on label type
          const labelType = item.label_type as "cooked" | "prep" | "ppds" | "default"
          const dbExpiryDays = parseInt(expiryDays[labelType] || "")
          const defaultDays = getDefaultExpiryDays(labelType)
          const finalDays = dbExpiryDays || defaultDays
          const expiryDate = calculateExpiryDate(finalDays)

          return {
            uid: uniqueId,
            id: item.item_id,
            type: "menu" as const,
            name: item.item_name,
            quantity: item.quantity,
            ingredients: menuItem?.ingredients?.map((ing: any) => ing.ingredientName) || [],
            allergens: menuItem?.allergens || [],
            labelType,
            printedOn: new Date().toISOString().split("T")[0],
            expiryDate,
          }
        }
      })

      // Check printer connection and selection
      if (!isConnected) {
        toast.error("Printer not connected. Please connect your printer first.")
        return
      }

      if (
        !selectedPrinterName ||
        !availablePrinters.find((p) => getPrinterName(p) === selectedPrinterName)
      ) {
        toast.error("Please select a valid printer.")
        return
      }

      const targetPrinter = availablePrinters.find((p) => getPrinterName(p) === selectedPrinterName)

      toast.info(`Starting to print ${printItems.length} items from "${list.name}"...`)

      // Generate session ID for bulk print
      const sessionId = `bulk-session-${Date.now()}-${Math.random().toString(36).slice(2)}`

      // Print each item
      let successCount = 0
      let failCount = 0

      for (const item of printItems) {
        try {
          // Print the item quantity number of times
          for (let i = 0; i < item.quantity; i++) {
            // Generate image for the label
            const imageData = await formatLabelForPrintImage(
              item,
              [], // allergens - will be fetched from item data
              {}, // customExpiry
              5, // maxIngredients
              false, // useInitials
              "", // selectedInitial
              "40mm", // labelHeight
              allIngredients
            )

            // Print the label
            await print(imageData, targetPrinter, { labelHeight: "40mm" })
            successCount++
          }

          // Log the print action ONCE per item with correct quantity
          // Convert "ppds" to "ppd" for bulk print logging
          const logLabelType =
            (item.labelType || item.type) === "ppds" ? "ppd" : item.labelType || item.type

          await logAction("print_label", {
            labelType: logLabelType,
            itemId: item.uid || item.id,
            itemName: item.name,
            quantity: item.quantity || 1,
            printedAt: new Date().toISOString(),
            expiryDate: item.expiryDate || calculateExpiryDate(3), // Default 3 days
            initial: "", // No initials in bulk print
            labelHeight: "40mm",
            printerUsed: selectedPrinterName || "Unknown",
            sessionId,
            bulkPrintListId: listId,
            bulkPrintListName: list.name,
          })
        } catch (error) {
          console.error(`Failed to print ${item.name}:`, error)
          failCount++
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully printed ${successCount} items from "${list.name}"`)
      }
      if (failCount > 0) {
        toast.error(`Failed to print ${failCount} items`)
      }
    } catch (error) {
      console.error("Error printing list:", error)
      toast.error("Failed to print list")
    } finally {
      setIsPrinting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading bulk print lists...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bulk Print Lists</h2>
          <p className="text-muted-foreground">
            Create and manage lists of ingredients and menu items for bulk printing
          </p>

          {/* Printer Selection - moved to left side */}
          <div className="mt-4">
            {isConnected ? (
              <>
                <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm">
                  <div className="mb-2 font-semibold text-purple-900">Available Printers</div>
                  {availablePrinters.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      <select
                        value={selectedPrinterName}
                        onChange={(e) => {
                          setSelectedPrinterName(e.target.value)
                        }}
                        className="rounded border border-purple-300 bg-white px-2 py-1 text-sm text-black"
                      >
                        <option value="">Select Printer</option>
                        {availablePrinters.map((printer: any) => {
                          const printerName = getPrinterName(printer)
                          return (
                            <option key={printerName} value={printerName}>
                              {printerName} {printer.isDefault ? "(Default)" : ""}
                            </option>
                          )
                        })}
                      </select>
                      <div className="mt-1 text-xs text-gray-700">
                        {availablePrinters.length} printer(s) detected
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">No printers detected</div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-4 text-red-700 shadow-sm">
                No printers detected
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create List
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Bulk Print List</DialogTitle>
                <DialogDescription>
                  Create a new list to organize ingredients and menu items for bulk printing.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="list-name">List Name</Label>
                  <Input
                    id="list-name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="e.g., Daily Prep List"
                  />
                </div>
                <div>
                  <Label htmlFor="list-description">Description (Optional)</Label>
                  <Textarea
                    id="list-description"
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                    placeholder="Describe what this list is for..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createList}>Create List</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {lists.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">No bulk print lists yet</h3>
              <p className="mb-4 text-muted-foreground">
                Create your first list to start organizing ingredients and menu items for bulk
                printing.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First List
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => (
            <Card key={list.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{list.name}</CardTitle>
                    {list.description && (
                      <CardDescription className="mt-1">{list.description}</CardDescription>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="ml-2 flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(list)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteList(list.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{list.item_count} items</span>
                  <span>{formatDate(list.created_at)}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onViewList?.(list.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => printListDirectly(list.id)}
                    disabled={
                      isPrinting ||
                      list.item_count === 0 ||
                      !isConnected ||
                      !selectedPrinterName ||
                      !availablePrinters.find((p) => getPrinterName(p) === selectedPrinterName)
                    }
                    title={
                      !isConnected
                        ? "Printer is not connected"
                        : !selectedPrinterName
                          ? "Please select a printer"
                          : list.item_count === 0
                            ? "No items in this list"
                            : ""
                    }
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    {isPrinting ? "Printing..." : "Print"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bulk Print List</DialogTitle>
            <DialogDescription>
              Update the name and description of your bulk print list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-list-name">List Name</Label>
              <Input
                id="edit-list-name"
                value={editListName}
                onChange={(e) => setEditListName(e.target.value)}
                placeholder="e.g., Daily Prep List"
              />
            </div>
            <div>
              <Label htmlFor="edit-list-description">Description (Optional)</Label>
              <Textarea
                id="edit-list-description"
                value={editListDescription}
                onChange={(e) => setEditListDescription(e.target.value)}
                placeholder="Describe what this list is for..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateList}>Update List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
