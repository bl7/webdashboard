"use client"

import React, { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Plus, Eye, FileDown } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useGroups, type CombinedCategory, type ItemCategory, type IngredientCategory } from "@/hooks/useGroups"
import { toast } from "sonner"
import * as XLSX from "xlsx"

type CategoryFormData = {
  categoryName: string
  expiryDays?: number
  type: "Menu Item Group" | "Ingredient Group"
}

function GroupsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-muted-foreground/20" />
        <div className="flex gap-2">
          <div className="h-10 w-32 animate-pulse rounded bg-muted-foreground/20" />
          <div className="h-10 w-32 animate-pulse rounded bg-muted-foreground/20" />
        </div>
      </div>
      <div className="h-24 animate-pulse rounded-xl bg-muted-foreground/10" />
      <div className="h-96 animate-pulse rounded-2xl bg-muted-foreground/10" />
    </div>
  )
}

export default function GroupsDashboard() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<CombinedCategory | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<CombinedCategory | null>(null)
  const [activeTab, setActiveTab] = useState<"all" | "menu-items" | "ingredients">("all")
  const [categoryItems, setCategoryItems] = useState<any[]>([])
  const [loadingItems, setLoadingItems] = useState(false)

  const [newCategory, setNewCategory] = useState<CategoryFormData>({
    categoryName: "",
    expiryDays: 3,
    type: "Menu Item Group",
  })

  const [editCategory, setEditCategory] = useState<CategoryFormData & { uuid: string }>({
    categoryName: "",
    expiryDays: 3,
    type: "Menu Item Group",
    uuid: "",
  })

  const {
    itemCategories,
    ingredientCategories,
    getAllCategories,
    loading,
    error,
    addNewItemCategory,
    updateExistingItemCategory,
    deleteExistingItemCategory,
    addNewIngredientCategory,
    updateExistingIngredientCategory,
    deleteExistingIngredientCategory,
    itemCategoryCount,
    ingredientCategoryCount,
    totalCategoryCount,
    getItemsByCategory,
  } = useGroups()

  // Filter categories based on search and active tab
  const filteredCategories = getAllCategories().filter((category) => {
    const matchesSearch = category.categoryName.toLowerCase().includes(search.toLowerCase())
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "menu-items" && category.type === "Menu Item Group") ||
      (activeTab === "ingredients" && category.type === "Ingredient Group")
    
    return matchesSearch && matchesTab
  })

  const handleAddCategory = async () => {
    if (!newCategory.categoryName.trim()) {
      toast.error("Category name is required")
      return
    }

    let success = false
    if (newCategory.type === "Menu Item Group") {
      success = await addNewItemCategory(newCategory.categoryName.trim())
    } else {
      if (!newCategory.expiryDays || newCategory.expiryDays < 1) {
        toast.error("Expiry days must be at least 1")
        return
      }
      success = await addNewIngredientCategory(newCategory.categoryName.trim(), newCategory.expiryDays)
    }

    if (success) {
      setNewCategory({ categoryName: "", expiryDays: 3, type: "Menu Item Group" })
      setShowAddModal(false)
    }
  }

  const handleEditCategory = async () => {
    if (!editCategory.categoryName.trim()) {
      toast.error("Category name is required")
      return
    }

    if (!editCategory.uuid) {
      toast.error("Category ID is missing")
      return
    }

    let success = false
    if (editCategory.type === "Menu Item Group") {
      success = await updateExistingItemCategory(editCategory.uuid, editCategory.categoryName.trim())
    } else {
      if (!editCategory.expiryDays || editCategory.expiryDays < 1) {
        toast.error("Expiry days must be at least 1")
        return
      }
      success = await updateExistingIngredientCategory(editCategory.uuid, editCategory.expiryDays)
    }

    if (success) {
      setEditCategory({ categoryName: "", expiryDays: 3, type: "Menu Item Group", uuid: "" })
      setShowEditModal(false)
    }
  }

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return

    let success = false
    if (categoryToDelete.type === "Menu Item Group") {
      success = await deleteExistingItemCategory(categoryToDelete.uuid)
    } else {
      success = await deleteExistingIngredientCategory(categoryToDelete.uuid)
    }

    if (success) {
      setCategoryToDelete(null)
      setShowDeleteModal(false)
    }
  }

  const openEditModal = (category: CombinedCategory) => {
    setEditCategory({
      categoryName: category.categoryName,
      expiryDays: category.type === "Ingredient Group" ? (category as IngredientCategory).expiryDays : 3,
      type: category.type,
      uuid: category.uuid,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (category: CombinedCategory) => {
    setCategoryToDelete(category)
    setShowDeleteModal(true)
  }

  const openViewModal = (category: CombinedCategory) => {
    setSelectedCategory(category)
    setShowViewModal(true)
  }

  const openItemsModal = async (category: CombinedCategory) => {
    setSelectedCategory(category)
    setLoadingItems(true)
    setShowItemsModal(true)
    
    try {
      const items = await getItemsByCategory(category.uuid, category.type)
      setCategoryItems(items)
      console.log(`Items in ${category.categoryName}:`, items)
    } catch (error) {
      console.error("Error loading items:", error)
      toast.error("Failed to load items")
    } finally {
      setLoadingItems(false)
    }
  }

  const handleExportExcel = () => {
    const exportData = filteredCategories.map((category) => ({
      ID: category.uuid,
      Name: category.categoryName,
      Type: category.type,
      ExpiryDays: category.type === "Ingredient Group" ? (category as IngredientCategory).expiryDays : "N/A",
      UserID: category.userID,
    }))
    
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories")
    XLSX.writeFile(workbook, `categories-export-${Date.now()}.xlsx`)
  }

  // Loading state
  if (loading && totalCategoryCount === 0) {
    return <GroupsSkeleton />
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">Error: {error}</p>
          <Button onClick={() => window.location.reload()} variant="default">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold sm:text-2xl">Groups Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileDown className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    placeholder="Enter category name"
                    value={newCategory.categoryName}
                    onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="categoryType">Category Type</Label>
                  <Select
                    value={newCategory.type}
                    onValueChange={(value: "Menu Item Group" | "Ingredient Group") =>
                      setNewCategory({ ...newCategory, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Menu Item Group">Menu Item Group</SelectItem>
                      <SelectItem value="Ingredient Group">Ingredient Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newCategory.type === "Ingredient Group" && (
                  <div>
                    <Label htmlFor="expiryDays">Expiry Days</Label>
                    <Input
                      id="expiryDays"
                      type="number"
                      min="1"
                      placeholder="3"
                      value={newCategory.expiryDays}
                      onChange={(e) => setNewCategory({ ...newCategory, expiryDays: parseInt(e.target.value) || 3 })}
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory}>Add Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow">
          <p className="text-muted-foreground">Total Categories</p>
          <h3 className="text-2xl font-bold">{totalCategoryCount}</h3>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow">
          <p className="text-muted-foreground">Menu Item Groups</p>
          <h3 className="text-2xl font-bold">{itemCategoryCount}</h3>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow">
          <p className="text-muted-foreground">Ingredient Groups</p>
          <h3 className="text-2xl font-bold">{ingredientCategoryCount}</h3>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search categories..."
            className="max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList>
            <TabsTrigger value="all">All Categories ({totalCategoryCount})</TabsTrigger>
            <TabsTrigger value="menu-items">Menu Item Groups ({itemCategoryCount})</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredient Groups ({ingredientCategoryCount})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="rounded-2xl border bg-card shadow-sm">
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Expiry Days</TableHead>
                      <TableHead>Items Count</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.uuid}>
                        <TableCell className="font-medium">{category.categoryName}</TableCell>
                        <TableCell>
                          <Badge variant={category.type === "Menu Item Group" ? "default" : "secondary"}>
                            {category.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {category.type === "Ingredient Group" 
                            ? (category as IngredientCategory).expiryDays 
                            : "N/A"
                          }
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openItemsModal(category)}
                            className="text-xs"
                          >
                            View Items
                          </Button>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {category.userID.slice(0, 8)}...
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openViewModal(category)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openEditModal(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openDeleteModal(category)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredCategories.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                          No categories found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editCategoryName">Category Name</Label>
              <Input
                id="editCategoryName"
                placeholder="Enter category name"
                value={editCategory.categoryName}
                onChange={(e) => setEditCategory({ ...editCategory, categoryName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editCategoryType">Category Type</Label>
              <Select
                value={editCategory.type}
                onValueChange={(value: "Menu Item Group" | "Ingredient Group") =>
                  setEditCategory({ ...editCategory, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Menu Item Group">Menu Item Group</SelectItem>
                  <SelectItem value="Ingredient Group">Ingredient Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {editCategory.type === "Ingredient Group" && (
              <div>
                <Label htmlFor="editExpiryDays">Expiry Days</Label>
                <Input
                  id="editExpiryDays"
                  type="number"
                  min="1"
                  placeholder="3"
                  value={editCategory.expiryDays}
                  onChange={(e) => setEditCategory({ ...editCategory, expiryDays: parseInt(e.target.value) || 3 })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "<strong>{categoryToDelete?.categoryName}</strong>"? This action
              cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Category Dialog */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <div className="grid gap-2 py-4">
              <p>
                <strong>Name:</strong> {selectedCategory.categoryName}
              </p>
              <p>
                <strong>Type:</strong> {selectedCategory.type}
              </p>
              <p>
                <strong>Expiry Days:</strong>{" "}
                {selectedCategory.type === "Ingredient Group" 
                  ? (selectedCategory as IngredientCategory).expiryDays 
                  : "N/A"
                }
              </p>
              <p>
                <strong>User ID:</strong> {selectedCategory.userID}
              </p>
              <p>
                <strong>Category ID:</strong> {selectedCategory.uuid}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Items Modal */}
      <Dialog open={showItemsModal} onOpenChange={setShowItemsModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Items in "{selectedCategory?.categoryName}" ({categoryItems.length})
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {loadingItems ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading items...</p>
                </div>
              </div>
            ) : categoryItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No items found in this category.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Items will appear here when they are assigned to this category.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        {selectedCategory?.type === "Ingredient Group" && (
                          <>
                            <TableHead>Expiry Days</TableHead>
                            <TableHead>Allergens</TableHead>
                          </>
                        )}
                        {selectedCategory?.type === "Menu Item Group" && (
                          <>
                            <TableHead>Ingredients</TableHead>
                            <TableHead>Allergens</TableHead>
                          </>
                        )}
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryItems.map((item: any) => (
                        <TableRow key={item.uuid || item.menuItemID}>
                          <TableCell className="font-medium">
                            {item.ingredientName || item.menuItemName}
                          </TableCell>
                          {selectedCategory?.type === "Ingredient Group" && (
                            <>
                              <TableCell>{item.expiryDays || "N/A"}</TableCell>
                              <TableCell>
                                {item.allergens?.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {item.allergens.map((allergen: any) => (
                                      <Badge key={allergen.uuid} variant="outline" className="text-xs">
                                        {allergen.allergenName}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">None</span>
                                )}
                              </TableCell>
                            </>
                          )}
                          {selectedCategory?.type === "Menu Item Group" && (
                            <>
                              <TableCell>
                                {item.ingredients?.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {item.ingredients.map((ingredient: any) => (
                                      <Badge key={ingredient.uuid} variant="outline" className="text-xs">
                                        {ingredient.ingredientName}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">None</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {item.allergens?.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {item.allergens.map((allergen: any) => (
                                      <Badge key={allergen.uuid} variant="outline" className="text-xs">
                                        {allergen.allergenName}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">None</span>
                                )}
                              </TableCell>
                            </>
                          )}
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // TODO: Implement edit item functionality
                                  toast.info("Edit item functionality coming soon!")
                                }}
                              >
                                <Pencil className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  // TODO: Implement remove from category functionality
                                  toast.info("Remove from category functionality coming soon!")
                                }}
                              >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Total items: {categoryItems.length}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // TODO: Implement add items to category functionality
                        toast.info("Add items to category functionality coming soon!")
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Items
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // TODO: Implement bulk edit functionality
                        toast.info("Bulk edit functionality coming soon!")
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Bulk Edit
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowItemsModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 