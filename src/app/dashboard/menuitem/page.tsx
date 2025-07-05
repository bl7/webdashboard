"use client"

import { useState, useEffect } from "react"
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
} from "@/components/ui"
import { Plus, Eye, Pencil, Trash, FileDown, X, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import * as XLSX from "xlsx"
import { useMenuItems, type MenuItem } from "@/hooks/useMenuItem"
import { useIngredients } from "@/hooks/useIngredients"
import { toast } from "sonner"

type MenuItemFormData = {
  menuItemName: string
  ingredientIDs: string[]
  categoryID?: string
  menuItemID?: string
}

function MenuItemsSkeleton() {
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

export default function MenuItemsDashboard() {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<MenuItem | null>(null)
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newItem, setNewItem] = useState<MenuItemFormData>({
    menuItemName: "",
    ingredientIDs: [],
  })
  const [editItem, setEditItem] = useState<MenuItemFormData>({
    menuItemName: "",
    ingredientIDs: [],
  })
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null)

  const { 
    menuItems, 
    loading, 
    error, 
    addNewMenuItem, 
    updateExistingMenuItem, 
    deleteExistingMenuItem 
  } = useMenuItems()
  
  const { ingredients, loading: ingredientsLoading } = useIngredients()
  const perPage = 10

  const filtered = menuItems.filter((item) =>
    item.menuItemName.toLowerCase().includes(query.toLowerCase())
  )

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const maxPages = Math.ceil(filtered.length / perPage)

  const handleExportExcel = () => {
    const exportData = filtered.map((item) => ({
      ID: item.menuItemID,
      Name: item.menuItemName,
      Ingredients: item.ingredients.map(ing => ing.ingredientName).join(", "),
      Allergens: item.allergens.map(all => all.allergenName).join(", "),
      ExpiryDays: item.expiryDays || "N/A",
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "MenuItems")
    XLSX.writeFile(workbook, `menu-items-export-${Date.now()}.xlsx`)
  }

  const handleAddItem = async () => {
    if (!newItem.menuItemName.trim()) {
      toast.error("Menu item name is required")
      return
    }

    // Duplicate check (case-insensitive, trimmed)
    const exists = menuItems.some(i => i.menuItemName.trim().toLowerCase() === newItem.menuItemName.trim().toLowerCase())
    if (exists) {
      toast.error("A menu item with this name already exists.")
      return
    }

    if (newItem.ingredientIDs.length === 0) {
      toast.error("At least one ingredient is required")
      return
    }

    const success = await addNewMenuItem({
      menuItemName: newItem.menuItemName.trim(),
      ingredientIDs: newItem.ingredientIDs,
      categoryID: newItem.categoryID,
    })

    if (success) {
      setNewItem({ menuItemName: "", ingredientIDs: [] })
      setShowAddModal(false)
    }
  }

  const handleEditItem = async () => {
    if (!editItem.menuItemName.trim()) {
      toast.error("Menu item name is required")
      return
    }

    if (!editItem.menuItemID) {
      toast.error("Menu item ID is missing")
      return
    }

    const success = await updateExistingMenuItem(editItem.menuItemID, {
      menuItemName: editItem.menuItemName.trim(),
      ingredientIDs: editItem.ingredientIDs,
      categoryID: editItem.categoryID,
    })

    if (success) {
      setEditItem({ menuItemName: "", ingredientIDs: [] })
      setShowEditModal(false)
    }
  }

  const handleDeleteItem = async () => {
    if (!itemToDelete) return

    const success = await deleteExistingMenuItem(itemToDelete.menuItemID)
    if (success) {
      setItemToDelete(null)
      setShowDeleteModal(false)
    }
  }

  const openEditModal = (item: MenuItem) => {
    setEditItem({
      menuItemName: item.menuItemName,
      ingredientIDs: item.ingredients.map(ing => ing.uuid),
      categoryID: item.categoryID,
      menuItemID: item.menuItemID,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (item: MenuItem) => {
    setItemToDelete(item)
    setShowDeleteModal(true)
  }

  const handleAddIngredient = (ingredientId: string, isEdit = false) => {
    if (isEdit) {
      setEditItem((prev) => ({
        ...prev,
        ingredientIDs: prev.ingredientIDs.includes(ingredientId)
          ? prev.ingredientIDs
          : [...prev.ingredientIDs, ingredientId],
      }))
    } else {
      setNewItem((prev) => ({
        ...prev,
        ingredientIDs: prev.ingredientIDs.includes(ingredientId)
          ? prev.ingredientIDs
          : [...prev.ingredientIDs, ingredientId],
      }))
    }
  }

  const handleRemoveIngredient = (ingredientId: string, isEdit = false) => {
    if (isEdit) {
      setEditItem((prev) => ({
        ...prev,
        ingredientIDs: prev.ingredientIDs.filter((id) => id !== ingredientId),
      }))
    } else {
      setNewItem((prev) => ({
        ...prev,
        ingredientIDs: prev.ingredientIDs.filter((id) => id !== ingredientId),
      }))
    }
  }

  const getSelectedIngredients = (ingredientIds: string[]) => {
    return ingredients.filter((ing) => ingredientIds.includes(ing.uuid))
  }

  const getAvailableIngredients = (ingredientIds: string[]) => {
    return ingredients.filter((ing) => !ingredientIds.includes(ing.uuid))
  }

  // Loading state
  if (loading && menuItems.length === 0) {
    return <MenuItemsSkeleton />
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Menu Items Dashboard</h2>
        <div>
          <Button variant="outline" className="mr-5" onClick={handleExportExcel}>
            <FileDown className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button onClick={() => setShowAddModal(true)} variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Add Menu Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-6 shadow">
          <p className="text-muted-foreground">Total Menu Items</p>
          <h3 className="text-2xl font-bold">{menuItems.length}</h3>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow">
          <p className="text-muted-foreground">Items with Allergens</p>
          <h3 className="text-2xl font-bold">
            {menuItems.filter((d) => d.allergens.length > 0).length}
          </h3>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border bg-card shadow-sm">
        <div className="mt-4 flex items-center justify-between gap-4 p-5">
          <Input
            placeholder="Search menu items..."
            className="max-w-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
        </div>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Ingredients</th>
              <th className="px-6 py-4">Allergens</th>
              <th className="px-6 py-4">Expiry Days</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.map((item) => (
              <tr key={item.menuItemID} className="transition hover:bg-muted">
                <td className="px-6 py-4 font-medium">{item.menuItemName}</td>
                <td className="px-6 py-4">{item.ingredients.map(ing => ing.ingredientName).join(", ")}</td>
                <td className="px-6 py-4">
                  {item.allergens.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.allergens.map((allergen) => (
                        <span
                          key={allergen.uuid}
                          className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800"
                        >
                          {allergen.allergenName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </td>
                <td className="px-6 py-4">{item.expiryDays || "N/A"}</td>
                <td className="flex justify-end gap-2 px-6 py-4 text-right">
                  <Button size="icon" variant="ghost" onClick={() => setSelected(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEditModal(item)}
                    disabled={loading}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openDeleteModal(item)}
                    disabled={loading}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No menu items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>

        {/* First page */}
        <Button
          variant={page === 1 ? "default" : "outline"}
          onClick={() => setPage(1)}
          className="min-w-[36px] px-2 py-1"
        >
          1
        </Button>

        {/* Ellipsis before current range */}
        {page > 3 && maxPages > 5 && <span className="px-2 py-1 text-muted-foreground">...</span>}

        {/* Pages around current */}
        {Array.from({ length: maxPages }, (_, i) => i + 1)
          .filter(
            (p) => p !== 1 && p !== maxPages && Math.abs(p - page) <= 1 // show current, previous, next
          )
          .map((p) => (
            <Button
              key={p}
              variant={page === p ? "default" : "outline"}
              onClick={() => setPage(p)}
              className="min-w-[36px] px-2 py-1"
            >
              {p}
            </Button>
          ))}

        {/* Ellipsis after current range */}
        {page < maxPages - 2 && maxPages > 5 && (
          <span className="px-2 py-1 text-muted-foreground">...</span>
        )}

        {/* Last page */}
        {maxPages > 1 && (
          <Button
            variant={page === maxPages ? "default" : "outline"}
            onClick={() => setPage(maxPages)}
            className="min-w-[36px] px-2 py-1"
          >
            {maxPages}
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.min(maxPages, p + 1))}
          disabled={page === maxPages}
        >
          Next
        </Button>
      </div>

      {/* Add Menu Item Dialog */}
      <Dialog open={showAddModal} onOpenChange={() => setShowAddModal(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Menu Item Name</Label>
              <Input
                id="name"
                placeholder="Menu Item Name"
                value={newItem.menuItemName}
                onChange={(e) => setNewItem({ ...newItem, menuItemName: e.target.value })}
              />
            </div>

            <div>
              <Label>Ingredients</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    disabled={getAvailableIngredients(newItem.ingredientIDs).length === 0}
                  >
                    {getAvailableIngredients(newItem.ingredientIDs).length === 0
                      ? "All ingredients selected"
                      : `Add Ingredient (${getAvailableIngredients(newItem.ingredientIDs).length} available)`}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuLabel>Available Ingredients</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {getAvailableIngredients(newItem.ingredientIDs).length === 0 ? (
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      No more ingredients available
                    </div>
                  ) : (
                    getAvailableIngredients(newItem.ingredientIDs).map((ingredient) => (
                      <DropdownMenuItem
                        key={ingredient.uuid}
                        onClick={() => handleAddIngredient(ingredient.uuid)}
                      >
                        {ingredient.ingredientName}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Selected Ingredients */}
              {newItem.ingredientIDs.length > 0 && (
                <div className="mt-3">
                  <Label className="mb-2 block text-sm font-medium">Selected Ingredients</Label>
                  <div className="flex flex-wrap gap-2">
                    {getSelectedIngredients(newItem.ingredientIDs).map((ingredient) => (
                      <div
                        key={ingredient.uuid}
                        className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm"
                      >
                        <span>{ingredient.ingredientName}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-blue-200"
                          onClick={() => handleRemoveIngredient(ingredient.uuid)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false)
                setNewItem({ menuItemName: "", ingredientIDs: [] })
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={!newItem.menuItemName.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Item Dialog */}
      <Dialog open={showEditModal} onOpenChange={() => setShowEditModal(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Menu Item Name</Label>
              <Input
                id="edit-name"
                placeholder="Menu Item Name"
                value={editItem.menuItemName}
                onChange={(e) => setEditItem({ ...editItem, menuItemName: e.target.value })}
              />
            </div>

            <div>
              <Label>Ingredients</Label>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <Label className="mb-3 block text-sm font-medium text-green-800">
                  Current Ingredients ({editItem.ingredientIDs.length})
                </Label>
                {editItem.ingredientIDs.length === 0 ? (
                  <p className="text-sm italic text-muted-foreground">
                    No ingredients selected. Add some ingredients below.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {getSelectedIngredients(editItem.ingredientIDs).map((ingredient) => (
                      <div
                        key={ingredient.uuid}
                        className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800"
                      >
                        <span>{ingredient.ingredientName}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-green-200"
                          onClick={() => handleRemoveIngredient(ingredient.uuid, true)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    disabled={getAvailableIngredients(editItem.ingredientIDs).length === 0}
                  >
                    {getAvailableIngredients(editItem.ingredientIDs).length === 0
                      ? "All ingredients selected"
                      : `Add Ingredient (${getAvailableIngredients(editItem.ingredientIDs).length} available)`}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuLabel>Available Ingredients</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {getAvailableIngredients(editItem.ingredientIDs).length === 0 ? (
                    <div className="px-2 py-2 text-center text-sm text-muted-foreground">
                      No more ingredients available
                    </div>
                  ) : (
                    getAvailableIngredients(editItem.ingredientIDs).map((ingredient) => (
                      <DropdownMenuItem
                        key={ingredient.uuid}
                        onClick={() => handleAddIngredient(ingredient.uuid, true)}
                      >
                        {ingredient.ingredientName}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false)
                setEditItem({ menuItemName: "", ingredientIDs: [] })
                setSelected(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditItem} disabled={!editItem.menuItemName.trim()}>
              Update Menu Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={() => setShowDeleteModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Menu Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "<strong>{itemToDelete?.menuItemName}</strong>"? This action
              cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setItemToDelete(null)
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Menu Item</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid gap-2 py-4">
              <p>
                <strong>Name:</strong> {selected.menuItemName}
              </p>
              <p>
                <strong>Ingredients:</strong> {selected.ingredients.map(ing => ing.ingredientName).join(", ")}
              </p>
              <p>
                <strong>Allergens:</strong>{" "}
                {selected.allergens.length > 0
                  ? selected.allergens.map(all => all.allergenName).join(", ")
                  : "None"}
              </p>
              <p>
                <strong>Expiry Days:</strong> {selected.expiryDays || "N/A"}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelected(null)}>
              <X className="mr-2 h-4 w-4" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
