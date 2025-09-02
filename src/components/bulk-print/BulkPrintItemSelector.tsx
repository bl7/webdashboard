"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Search, Plus } from "lucide-react"
import { toast } from "sonner"
import { getAllIngredients, getAllMenuItems } from "@/lib/api"

interface IngredientItem {
  uuid: string
  ingredientName: string
  allergens: { allergenName: string }[]
  expiryDays?: number
}

interface MenuItem {
  menuItemID: string
  menuItemName: string
  ingredients: { ingredientName: string }[]
  allergens?: { allergenName: string }[]
  categoryName?: string
}

interface BulkPrintItemSelectorProps {
  listId: string
  isOpen: boolean
  onClose: () => void
  onItemsAdded: () => void
}

export default function BulkPrintItemSelector({
  listId,
  isOpen,
  onClose,
  onItemsAdded,
}: BulkPrintItemSelectorProps) {
  const [ingredients, setIngredients] = useState<IngredientItem[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<
    Map<string, { type: "ingredient" | "menu"; labelType?: string; quantity: number }>
  >(new Map())
  const [activeTab, setActiveTab] = useState("ingredients")

  useEffect(() => {
    if (isOpen) {
      fetchItems()
    }
  }, [isOpen])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      // Fetch ingredients and menu items from external API
      const [ingredientsData, menuItemsData] = await Promise.all([
        getAllIngredients(token),
        getAllMenuItems(token),
      ])

      setIngredients(Array.isArray(ingredientsData) ? ingredientsData : ingredientsData?.data || [])

      // Flatten menu items from categories
      const items = []
      const categories = Array.isArray(menuItemsData) ? menuItemsData : menuItemsData?.data || []
      for (const category of categories) {
        for (const item of category.items || []) {
          items.push({
            ...item,
            categoryName: category.categoryName,
          })
        }
      }
      setMenuItems(items)
    } catch (error) {
      console.error("Error fetching items:", error)
      toast.error("Failed to fetch ingredients and menu items")
    } finally {
      setLoading(false)
    }
  }

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.ingredientName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.menuItemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const toggleItemSelection = (itemId: string, type: "ingredient" | "menu", itemName: string) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev)
      if (newMap.has(itemId)) {
        newMap.delete(itemId)
      } else {
        newMap.set(itemId, {
          type,
          labelType: type === "menu" ? "default" : undefined,
          quantity: 1,
        })
      }
      return newMap
    })
  }

  const updateItemQuantity = (itemId: string, quantity: number) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev)
      const item = newMap.get(itemId)
      if (item) {
        newMap.set(itemId, { ...item, quantity: Math.max(1, quantity) })
      }
      return newMap
    })
  }

  const updateItemLabelType = (itemId: string, labelType: string) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev)
      const item = newMap.get(itemId)
      if (item && item.type === "menu") {
        newMap.set(itemId, { ...item, labelType })
      }
      return newMap
    })
  }

  const addSelectedItems = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select items to add")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const itemsToAdd = Array.from(selectedItems.entries()).map(([itemId, config]) => {
        const item =
          config.type === "ingredient"
            ? ingredients.find((ing) => ing.uuid === itemId)
            : menuItems.find((menu) => menu.menuItemID === itemId)

        let itemName = "Unknown"
        if (config.type === "ingredient" && item) {
          itemName = (item as IngredientItem).ingredientName
        } else if (config.type === "menu" && item) {
          itemName = (item as MenuItem).menuItemName
        }

        return {
          item_id: itemId,
          item_type: config.type,
          item_name: itemName,
          quantity: config.quantity,
          label_type: config.labelType,
        }
      })

      const response = await fetch(`/api/bulk-print/lists/${listId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: itemsToAdd }),
      })

      if (!response.ok) {
        throw new Error("Failed to add items to list")
      }

      setSelectedItems(new Map())
      onItemsAdded()
      onClose()
      toast.success(`Added ${itemsToAdd.length} items to the list`)
    } catch (error) {
      console.error("Error adding items:", error)
      toast.error("Failed to add items to list")
    }
  }

  const clearSelection = () => {
    setSelectedItems(new Map())
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] max-w-4xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Items to List</DialogTitle>
          <DialogDescription>
            Select ingredients and menu items to add to your bulk print list.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="mb-4 flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search ingredients and menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {selectedItems.size > 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{selectedItems.size} selected</Badge>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            )}
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ingredients">
                Ingredients ({filteredIngredients.length})
              </TabsTrigger>
              <TabsTrigger value="menu">Menu Items ({filteredMenuItems.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="flex-1 overflow-hidden">
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                  </div>
                ) : filteredIngredients.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    {searchTerm
                      ? "No ingredients found matching your search."
                      : "No ingredients available."}
                  </div>
                ) : (
                  filteredIngredients.map((ingredient) => {
                    const isSelected = selectedItems.has(ingredient.uuid)
                    const selectedConfig = selectedItems.get(ingredient.uuid)

                    return (
                      <Card
                        key={ingredient.uuid}
                        className={`cursor-pointer transition-colors ${isSelected ? "ring-2 ring-primary" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-1 items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleItemSelection(
                                    ingredient.uuid,
                                    "ingredient",
                                    ingredient.ingredientName
                                  )
                                }
                                className="h-4 w-4"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold">{ingredient.ingredientName}</h3>
                                {ingredient.allergens && ingredient.allergens.length > 0 && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {ingredient.allergens.map((allergen, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {allergen.allergenName}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {isSelected && selectedConfig && (
                              <div className="flex items-center space-x-2">
                                <Label htmlFor={`qty-${ingredient.uuid}`} className="text-sm">
                                  Qty:
                                </Label>
                                <Input
                                  id={`qty-${ingredient.uuid}`}
                                  type="text"
                                  value={selectedConfig.quantity}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    // Only allow numbers
                                    if (value === "" || /^\d+$/.test(value)) {
                                      const numValue = parseInt(value) || 1
                                      // Ensure minimum value of 1
                                      const finalValue = Math.max(1, numValue)
                                      updateItemQuantity(ingredient.uuid, finalValue)
                                    }
                                  }}
                                  onBlur={(e) => {
                                    const value = e.target.value
                                    if (value === "" || parseInt(value) < 1) {
                                      updateItemQuantity(ingredient.uuid, 1)
                                    }
                                  }}
                                  className="h-8 w-16"
                                  placeholder="1"
                                />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </TabsContent>

            <TabsContent value="menu" className="flex-1 overflow-hidden">
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                  </div>
                ) : filteredMenuItems.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    {searchTerm
                      ? "No menu items found matching your search."
                      : "No menu items available."}
                  </div>
                ) : (
                  filteredMenuItems.map((item) => {
                    const isSelected = selectedItems.has(item.menuItemID)
                    const selectedConfig = selectedItems.get(item.menuItemID)

                    return (
                      <Card
                        key={item.menuItemID}
                        className={`cursor-pointer transition-colors ${isSelected ? "ring-2 ring-primary" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-1 items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() =>
                                  toggleItemSelection(item.menuItemID, "menu", item.menuItemName)
                                }
                                className="h-4 w-4"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold">{item.menuItemName}</h3>
                                {item.categoryName && (
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    {item.categoryName}
                                  </Badge>
                                )}
                                {item.ingredients && item.ingredients.length > 0 && (
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {item.ingredients
                                      .slice(0, 3)
                                      .map((ing) => ing.ingredientName)
                                      .join(", ")}
                                    {item.ingredients.length > 3 &&
                                      ` +${item.ingredients.length - 3} more`}
                                  </p>
                                )}
                              </div>
                            </div>

                            {isSelected && selectedConfig && (
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-2">
                                  <Label htmlFor={`qty-${item.menuItemID}`} className="text-sm">
                                    Qty:
                                  </Label>
                                  <Input
                                    id={`qty-${item.menuItemID}`}
                                    type="text"
                                    value={selectedConfig.quantity}
                                    onChange={(e) => {
                                      const value = e.target.value
                                      // Only allow numbers
                                      if (value === "" || /^\d+$/.test(value)) {
                                        const numValue = parseInt(value) || 1
                                        // Ensure minimum value of 1
                                        const finalValue = Math.max(1, numValue)
                                        updateItemQuantity(item.menuItemID, finalValue)
                                      }
                                    }}
                                    onBlur={(e) => {
                                      const value = e.target.value
                                      if (value === "" || parseInt(value) < 1) {
                                        updateItemQuantity(item.menuItemID, 1)
                                      }
                                    }}
                                    className="h-8 w-16"
                                    placeholder="1"
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Label htmlFor={`label-${item.menuItemID}`} className="text-sm">
                                    Label:
                                  </Label>
                                  <Select
                                    value={selectedConfig.labelType || "default"}
                                    onValueChange={(value) =>
                                      updateItemLabelType(item.menuItemID, value)
                                    }
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
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={addSelectedItems} disabled={selectedItems.size === 0}>
            <Plus className="mr-2 h-4 w-4" />
            Add {selectedItems.size} Items
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
