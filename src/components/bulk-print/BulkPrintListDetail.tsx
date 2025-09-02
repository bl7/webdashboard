"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Trash2, Printer, Edit3 } from "lucide-react"
import { toast } from "sonner"
import { getAllIngredients, getAllMenuItems } from "@/lib/api"
import { PrintQueueItem } from "@/types/print"
import { usePrinter } from "@/context/PrinterContext"
import { formatLabelForPrintImage } from "@/app/dashboard/print/labelFormatter"

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
}

interface BulkPrintListItem {
  id: string
  list_id: string
  item_id: string
  item_type: "ingredient" | "menu"
  item_name: string
  quantity: number
  label_type: string | null
  created_at: string
}

interface BulkPrintListDetailProps {
  listId: string
  onBack: () => void
  onPrint: (items: PrintQueueItem[]) => void
  onOpenItemSelector?: () => void
}

export default function BulkPrintListDetail({
  listId,
  onBack,
  onPrint,
  onOpenItemSelector,
}: BulkPrintListDetailProps) {
  const { print, isConnected, defaultPrinter } = usePrinter()
  const [list, setList] = useState<BulkPrintList | null>(null)
  const [items, setItems] = useState<BulkPrintListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [allIngredients, setAllIngredients] = useState<any[]>([])
  const [allMenuItems, setAllMenuItems] = useState<any[]>([])
  const [isAddingItems, setIsAddingItems] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isPrinting, setIsPrinting] = useState(false)
  const [expiryDays, setExpiryDays] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchListDetails()
    fetchAllItems()
    fetchExpirySettings()
  }, [listId])

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

  const fetchListDetails = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/bulk-print/lists/${listId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch list details")
      }

      const data = await response.json()
      setList(data.list)
      setItems(data.items || [])
    } catch (error) {
      console.error("Error fetching list details:", error)
      toast.error("Failed to fetch list details")
    } finally {
      setLoading(false)
    }
  }

  const fetchAllItems = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      // Fetch ingredients and menu items from external API
      const [ingredientsData, menuItemsData] = await Promise.all([
        getAllIngredients(token),
        getAllMenuItems(token),
      ])

      setAllIngredients(
        Array.isArray(ingredientsData) ? ingredientsData : ingredientsData?.data || []
      )

      // Flatten menu items from categories
      const menuItems = []
      const categories = Array.isArray(menuItemsData) ? menuItemsData : menuItemsData?.data || []
      for (const category of categories) {
        for (const item of category.items || []) {
          menuItems.push({
            ...item,
            categoryName: category.categoryName,
          })
        }
      }
      setAllMenuItems(menuItems)
    } catch (error) {
      console.error("Error fetching items:", error)
      toast.error("Failed to fetch ingredients and menu items")
    }
  }

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/bulk-print/lists/${listId}/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to update item quantity")
      }

      const data = await response.json()
      setItems((prev) => prev.map((item) => (item.id === itemId ? data.item : item)))
    } catch (error) {
      console.error("Error updating item quantity:", error)
      toast.error("Failed to update item quantity")
    }
  }

  const updateItemLabelType = async (itemId: string, labelType: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/bulk-print/lists/${listId}/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ label_type: labelType }),
      })

      if (!response.ok) {
        throw new Error("Failed to update item label type")
      }

      const data = await response.json()
      setItems((prev) => prev.map((item) => (item.id === itemId ? data.item : item)))
    } catch (error) {
      console.error("Error updating item label type:", error)
      toast.error("Failed to update item label type")
    }
  }

  const removeItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to remove this item from the list?")) {
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch(`/api/bulk-print/lists/${listId}/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to remove item")
      }

      setItems((prev) => prev.filter((item) => item.id !== itemId))
      toast.success("Item removed from list")
    } catch (error) {
      console.error("Error removing item:", error)
      toast.error("Failed to remove item")
    }
  }

  const printSelectedItems = async () => {
    if (isPrinting) return

    try {
      setIsPrinting(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Authentication required")
        return
      }

      const selectedItemsList = items.filter((item) => selectedItems.has(item.id))

      if (selectedItemsList.length === 0) {
        toast.error("Please select items to print")
        return
      }

      // Check if printer is connected
      if (!isConnected) {
        toast.error("Printer is not connected. Please connect your printer first.")
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

      // Convert selected items to PrintQueueItem format
      const printItems: PrintQueueItem[] = []
      for (const item of selectedItemsList) {
        const uniqueId = `bulk-${item.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`

        if (item.item_type === "ingredient") {
          const ingredient = allIngredients.find((ing: any) => ing.uuid === item.item_id)
          if (ingredient) {
            // For ingredients, use their own expiry date or default to 3 days
            const defaultIngredientDays = 3
            const expiryDate = ingredient.expiryDate || calculateExpiryDate(defaultIngredientDays)

            printItems.push({
              uid: uniqueId,
              id: item.item_id,
              type: "ingredients" as const,
              name: item.item_name,
              quantity: item.quantity,
              allergens: ingredient.allergens || [],
              printedOn: new Date().toISOString().split("T")[0],
              expiryDate,
            })
          }
        } else {
          const menuItem = allMenuItems.find((menu: any) => menu.menuItemID === item.item_id)
          if (menuItem) {
            // For menu items, use database expiry days based on label type
            const labelType = item.label_type as "cooked" | "prep" | "ppds" | "default"
            const dbExpiryDays = parseInt(expiryDays[labelType] || "")
            const defaultDays = getDefaultExpiryDays(labelType)
            const finalDays = dbExpiryDays || defaultDays
            const expiryDate = calculateExpiryDate(finalDays)

            printItems.push({
              uid: uniqueId,
              id: item.item_id,
              type: "menu" as const,
              name: item.item_name,
              quantity: item.quantity,
              ingredients: menuItem.ingredients?.map((ing: any) => ing.ingredientName) || [],
              allergens: menuItem.allergens || [],
              labelType,
              printedOn: new Date().toISOString().split("T")[0],
              expiryDate,
            })
          }
        }
      }

      if (printItems.length === 0) {
        toast.error("No valid selected items found to print")
        return
      }

      // Generate label images and send to printer
      let successCount = 0
      let errorCount = 0

      for (const printItem of printItems) {
        try {
          // Print the item quantity number of times
          for (let i = 0; i < printItem.quantity; i++) {
            const labelImage = await formatLabelForPrintImage(
              printItem,
              [], // allergens - will be fetched from item data
              {}, // customExpiry
              5, // maxIngredients
              false, // useInitials
              "", // selectedInitial
              "40mm", // labelHeight
              allIngredients
            )
            if (labelImage) {
              await print(labelImage, defaultPrinter || undefined, { labelHeight: "40mm" })
              successCount++
            } else {
              console.error(`Failed to generate label image for ${printItem.name}`)
              toast.error(`Failed to generate label for ${printItem.name}`)
              errorCount++
            }
          }
        } catch (error) {
          console.error(`Error printing item ${printItem.name}:`, error)
          toast.error(`Failed to print ${printItem.name}`)
          errorCount++
        }
      }

      // Show appropriate success/error message
      if (successCount === printItems.length) {
        toast.success(`Successfully printed all ${successCount} selected items`)
      } else if (successCount > 0) {
        toast.warning(`Printed ${successCount} items successfully, ${errorCount} failed`)
      } else {
        toast.error(`Failed to print all ${printItems.length} selected items`)
      }

      // Clear selection after successful printing
      if (successCount > 0) {
        setSelectedItems(new Set())
      }
    } catch (error) {
      console.error("Error printing selected items:", error)
      toast.error("Failed to print selected items")
    } finally {
      setIsPrinting(false)
    }
  }

  const printAllItems = async () => {
    if (isPrinting) return

    try {
      setIsPrinting(true)
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Authentication required")
        return
      }

      if (items.length === 0) {
        toast.error("No items in this list to print")
        return
      }

      // Check if printer is connected
      if (!isConnected) {
        toast.error("Printer is not connected. Please connect your printer first.")
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

      // Convert items to PrintQueueItem format
      const printItems: PrintQueueItem[] = []
      for (const item of items) {
        const uniqueId = `bulk-${item.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`

        if (item.item_type === "ingredient") {
          const ingredient = allIngredients.find((ing: any) => ing.uuid === item.item_id)
          if (ingredient) {
            // For ingredients, use their own expiry date or default to 3 days
            const defaultIngredientDays = 3
            const expiryDate = ingredient.expiryDate || calculateExpiryDate(defaultIngredientDays)

            printItems.push({
              uid: uniqueId,
              id: item.item_id,
              type: "ingredients" as const,
              name: item.item_name,
              quantity: item.quantity,
              allergens: ingredient.allergens || [],
              printedOn: new Date().toISOString().split("T")[0],
              expiryDate,
            })
          }
        } else {
          const menuItem = allMenuItems.find((menu: any) => menu.menuItemID === item.item_id)
          if (menuItem) {
            // For menu items, use database expiry days based on label type
            const labelType = item.label_type as "cooked" | "prep" | "ppds" | "default"
            const dbExpiryDays = parseInt(expiryDays[labelType] || "")
            const defaultDays = getDefaultExpiryDays(labelType)
            const finalDays = dbExpiryDays || defaultDays
            const expiryDate = calculateExpiryDate(finalDays)

            printItems.push({
              uid: uniqueId,
              id: item.item_id,
              type: "menu" as const,
              name: item.item_name,
              quantity: item.quantity,
              ingredients: menuItem.ingredients?.map((ing: any) => ing.ingredientName) || [],
              allergens: menuItem.allergens || [],
              labelType,
              printedOn: new Date().toISOString().split("T")[0],
              expiryDate,
            })
          }
        }
      }

      if (printItems.length === 0) {
        toast.error("No valid items found to print")
        return
      }

      // Generate label images and send to printer
      let successCount = 0
      let errorCount = 0

      for (const printItem of printItems) {
        try {
          // Print the item quantity number of times
          for (let i = 0; i < printItem.quantity; i++) {
            const labelImage = await formatLabelForPrintImage(
              printItem,
              [], // allergens - will be fetched from item data
              {}, // customExpiry
              5, // maxIngredients
              false, // useInitials
              "", // selectedInitial
              "40mm", // labelHeight
              allIngredients
            )
            if (labelImage) {
              await print(labelImage, defaultPrinter || undefined, { labelHeight: "40mm" })
              successCount++
            } else {
              console.error(`Failed to generate label image for ${printItem.name}`)
              toast.error(`Failed to generate label for ${printItem.name}`)
              errorCount++
            }
          }
        } catch (error) {
          console.error(`Error printing item ${printItem.name}:`, error)
          toast.error(`Failed to print ${printItem.name}`)
          errorCount++
        }
      }

      // Show appropriate success/error message
      if (successCount === printItems.length) {
        toast.success(`Successfully printed all ${successCount} items`)
      } else if (successCount > 0) {
        toast.warning(`Printed ${successCount} items successfully, ${errorCount} failed`)
      } else {
        toast.error(`Failed to print all ${printItems.length} items`)
      }
    } catch (error) {
      console.error("Error printing all items:", error)
      toast.error("Failed to print items")
    } finally {
      setIsPrinting(false)
    }
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const selectAllItems = () => {
    setSelectedItems(new Set(items.map((item) => item.id)))
  }

  const clearSelection = () => {
    setSelectedItems(new Set())
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading list details...</p>
        </div>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">List not found</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lists
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{list.name}</h2>
            {list.description && <p className="text-muted-foreground">{list.description}</p>}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => onOpenItemSelector?.()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Items
          </Button>
          {items.length > 0 && (
            <Button
              onClick={printAllItems}
              disabled={isPrinting || !isConnected}
              title={!isConnected ? "Printer is not connected" : ""}
            >
              <Printer className="mr-2 h-4 w-4" />
              {isPrinting ? "Printing..." : `Print All (${items.length})`}
            </Button>
          )}
          {selectedItems.size > 0 && (
            <Button
              variant="outline"
              onClick={printSelectedItems}
              disabled={isPrinting || !isConnected}
              title={!isConnected ? "Printer is not connected" : ""}
            >
              <Printer className="mr-2 h-4 w-4" />
              {isPrinting ? "Printing..." : `Print Selected (${selectedItems.size})`}
            </Button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">No items in this list</h3>
              <p className="mb-4 text-muted-foreground">
                Add ingredients and menu items to start building your bulk print list.
              </p>
              <Button onClick={() => onOpenItemSelector?.()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Items
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={selectAllItems}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear Selection
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedItems.size} of {items.length} items selected
            </p>
          </div>

          <div className="grid gap-4">
            {items.map((item) => (
              <Card
                key={item.id}
                className={`transition-colors ${selectedItems.has(item.id) ? "ring-2 ring-primary" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{item.item_name}</h3>
                          <Badge
                            variant={item.item_type === "ingredient" ? "secondary" : "default"}
                          >
                            {item.item_type}
                          </Badge>
                          {item.item_type === "menu" && item.label_type && (
                            <Badge variant="outline">{item.label_type}</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`quantity-${item.id}`} className="text-sm">
                          Qty:
                        </Label>
                        <Input
                          id={`quantity-${item.id}`}
                          type="text"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = e.target.value
                            // Only allow numbers
                            if (value === "" || /^\d+$/.test(value)) {
                              const numValue = parseInt(value) || 1
                              // Ensure minimum value of 1
                              const finalValue = Math.max(1, numValue)
                              updateItemQuantity(item.id, finalValue)
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value
                            if (value === "" || parseInt(value) < 1) {
                              updateItemQuantity(item.id, 1)
                            }
                          }}
                          className="h-8 w-16"
                          placeholder="1"
                        />
                      </div>

                      {item.item_type === "menu" && (
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`label-type-${item.id}`} className="text-sm">
                            Label:
                          </Label>
                          <Select
                            value={item.label_type || "default"}
                            onValueChange={(value) => updateItemLabelType(item.id, value)}
                          >
                            <SelectTrigger className="h-8 w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="cooked">Cooked</SelectItem>
                              <SelectItem value="prep">Prep</SelectItem>
                              <SelectItem value="ppds">PPDS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
