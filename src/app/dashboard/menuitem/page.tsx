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
import { getAllMenuItems } from "@/lib/api"
import { useIngredients } from "@/hooks/useIngredients"
import { toast } from "sonner"

type MenuItem = {
  id: string
  name: string
  ingredients: string
  ingredientIds: string[]
  status: "Active" | "Inactive"
  addedAt: string
}

type MenuItemFormData = {
  name: string
  ingredientIds: string[]
  status: string
}

export default function MenuItemsDashboard() {
  const [query, setQuery] = useState("")
  const [data, setData] = useState<MenuItem[]>([])
  const [selected, setSelected] = useState<MenuItem | null>(null)
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<MenuItemFormData>({
    name: "",
    ingredientIds: [],
    status: "Active",
  })
  const [editItem, setEditItem] = useState<MenuItemFormData>({
    name: "",
    ingredientIds: [],
    status: "Active",
  })
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null)
  const [filterType, setFilterType] = useState<"All" | "Active" | "Inactive">("All")

  const { ingredients, loading: ingredientsLoading } = useIngredients()
  const perPage = 5

  // Helper function to convert ingredient names to IDs
  const getIngredientIdsByNames = (ingredientNames: string[]): string[] => {
    if (!ingredients || ingredients.length === 0) return []

    return ingredientNames
      .map((name) => {
        const ingredient = ingredients.find(
          (ing) => ing.ingredientName.toLowerCase().trim() === name.toLowerCase().trim()
        )
        return ingredient?.uuid || null
      })
      .filter((id) => id !== null) as string[]
  }

  // Helper function to convert ingredient IDs to names
  const getIngredientNamesByIds = (ingredientIds: string[]): string[] => {
    if (!ingredients || ingredients.length === 0) return []

    return ingredientIds
      .map((id) => {
        const ingredient = ingredients.find((ing) => ing.uuid === id)
        return ingredient?.ingredientName || null
      })
      .filter((name) => name !== null) as string[]
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("No token found. Please log in.")
      return
    }

    const fetchMenuItems = async () => {
      setLoading(true)
      try {
        const res = await getAllMenuItems(token)
        if (!res?.data) {
          setError("No data found.")
          return
        }

        const menuItems: MenuItem[] = []
        for (const category of res.data) {
          if (!category.items) continue
          for (const item of category.items) {
            // Get ingredient names from API
            const ingredientNames = item.ingredients?.map((ing: any) => ing.ingredientName) || []

            // Convert names to IDs using our ingredients list
            const ingredientIds = getIngredientIdsByNames(ingredientNames)

            menuItems.push({
              id: item.menuItemID,
              name: item.menuItemName,
              ingredients: ingredientNames.join(", "),
              ingredientIds,
              status: "Active", // default since API does not provide this
              addedAt: new Date().toISOString().split("T")[0],
            })
          }
        }

        setData(menuItems)
        setError(null)
      } catch (err) {
        setError("Failed to fetch menu items.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    // Only fetch menu items after ingredients are loaded
    if (!ingredientsLoading && ingredients.length > 0) {
      fetchMenuItems()
    }
  }, [ingredients, ingredientsLoading])

  const filtered = data.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filterType === "All" ? true : item.status === filterType
    return matchesQuery && matchesFilter
  })

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const maxPages = Math.ceil(filtered.length / perPage)

  const handleExportExcel = () => {
    const exportData = filtered.map((item) => ({
      ID: item.id,
      Name: item.name,
      Ingredients: item.ingredients,
      Status: item.status,
      AddedAt: item.addedAt,
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "MenuItems")
    XLSX.writeFile(workbook, `menu-items-export-${Date.now()}.xlsx`)
  }

  const handleAddItem = async () => {
    try {
      // Here you would call your API to add the menu item
      // For now, we'll simulate it locally
      const selectedIngredients = ingredients.filter((ing) =>
        newItem.ingredientIds.includes(ing.uuid)
      )

      const newMenuItem: MenuItem = {
        id: (Math.random() * 100000).toFixed(0),
        name: newItem.name,
        ingredients: selectedIngredients.map((ing) => ing.ingredientName).join(", "),
        ingredientIds: newItem.ingredientIds,
        status: newItem.status as "Active" | "Inactive",
        addedAt: new Date().toISOString().split("T")[0],
      }

      setData((prev) => [...prev, newMenuItem])
      setShowAddModal(false)
      setNewItem({ name: "", ingredientIds: [], status: "Active" })
      toast.success("Menu item added successfully")
    } catch (err) {
      toast.error("Failed to add menu item")
    }
  }

  const handleEditItem = async () => {
    if (!selected) return

    try {
      // Here you would call your API to update the menu item
      const selectedIngredients = ingredients.filter((ing) =>
        editItem.ingredientIds.includes(ing.uuid)
      )

      const updatedItem: MenuItem = {
        ...selected,
        name: editItem.name,
        ingredients: selectedIngredients.map((ing) => ing.ingredientName).join(", "),
        ingredientIds: editItem.ingredientIds,
        status: editItem.status as "Active" | "Inactive",
      }
      console.log("updated item", updatedItem)
      setData((prev) => prev.map((item) => (item.id === selected.id ? updatedItem : item)))
      setShowEditModal(false)
      setSelected(null)
      toast.success("Menu item updated successfully")
    } catch (err) {
      toast.error("Failed to update menu item")
    }
  }

  const handleDeleteItem = async () => {
    if (!itemToDelete) return

    try {
      // Here you would call your API to delete the menu item
      setData((prev) => prev.filter((item) => item.id !== itemToDelete.id))
      setShowDeleteModal(false)
      setItemToDelete(null)
      toast.success("Menu item deleted successfully")
    } catch (err) {
      toast.error("Failed to delete menu item")
    }
  }

  const openEditModal = (item: MenuItem) => {
    setSelected(item)
    setEditItem({
      name: item.name,
      ingredientIds: [...item.ingredientIds], // This should now have proper IDs
      status: item.status,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (item: MenuItem) => {
    setItemToDelete(item)
    setShowDeleteModal(true)
  }

  const handleAddIngredient = (ingredientId: string, isEdit = false) => {
    if (isEdit) {
      if (!editItem.ingredientIds.includes(ingredientId)) {
        setEditItem((prev) => ({
          ...prev,
          ingredientIds: [...prev.ingredientIds, ingredientId],
        }))
      }
    } else {
      if (!newItem.ingredientIds.includes(ingredientId)) {
        setNewItem((prev) => ({
          ...prev,
          ingredientIds: [...prev.ingredientIds, ingredientId],
        }))
      }
    }
  }

  const handleRemoveIngredient = (ingredientId: string, isEdit = false) => {
    if (isEdit) {
      setEditItem((prev) => ({
        ...prev,
        ingredientIds: prev.ingredientIds.filter((id) => id !== ingredientId),
      }))
    } else {
      setNewItem((prev) => ({
        ...prev,
        ingredientIds: prev.ingredientIds.filter((id) => id !== ingredientId),
      }))
    }
  }

  const getSelectedIngredients = (ingredientIds: string[]) => {
    return ingredients.filter((ing) => ingredientIds.includes(ing.uuid))
  }

  const getAvailableIngredients = (ingredientIds: string[]) => {
    return ingredients.filter((ing) => !ingredientIds.includes(ing.uuid))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Menu Items Dashboard</h2>
        <div>
          <Button variant="outline" className="mr-5" onClick={handleExportExcel} disabled={loading}>
            <FileDown className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button onClick={() => setShowAddModal(true)} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" /> Add Menu Item
          </Button>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-100 p-3 text-red-700">{error}</div>}

      {loading || ingredientsLoading ? (
        <div className="py-8 text-center text-muted-foreground">Loading menu items...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border bg-card p-6 shadow">
              <p className="text-muted-foreground">Active Items</p>
              <h3 className="text-2xl font-bold">
                {data.filter((d) => d.status === "Active").length}
              </h3>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow">
              <p className="text-muted-foreground">Inactive Items</p>
              <h3 className="text-2xl font-bold">
                {data.filter((d) => d.status === "Inactive").length}
              </h3>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-x-auto rounded-2xl border bg-card shadow-sm">
            <div className="mt-4 flex items-center justify-between gap-4 p-5">
              <Input
                placeholder="Search menu items..."
                className="max-w-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
              />

              {/* Status Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[150px] justify-between"
                    disabled={loading}
                  >
                    {filterType}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[150px]">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filterType === "All"}
                    onCheckedChange={() => setFilterType("All")}
                  >
                    All
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterType === "Active"}
                    onCheckedChange={() => setFilterType("Active")}
                  >
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterType === "Inactive"}
                    onCheckedChange={() => setFilterType("Inactive")}
                  >
                    Inactive
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <table className="min-w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Ingredients</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Added</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((item) => (
                  <tr key={item.id} className="transition hover:bg-muted">
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4">{item.ingredients}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-600/20 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-600/20 dark:text-gray-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.addedAt}</td>
                    <td className="flex justify-end gap-2 px-6 py-4 text-right">
                      <Button size="icon" variant="ghost" onClick={() => setSelected(item)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => openEditModal(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => openDeleteModal(item)}
                      >
                        <Trash className="h-4 w-4" />
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

            {/* Pagination */}
            <div className="flex justify-between p-5">
              <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {maxPages}
              </span>
              <Button
                disabled={page >= maxPages}
                onClick={() => setPage((p) => Math.min(maxPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Add Item Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Menu Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />

            <div>
              <Label className="mb-2 block text-sm font-medium">Select Ingredients</Label>
              {ingredientsLoading ? (
                <div className="text-sm text-muted-foreground">Loading ingredients...</div>
              ) : (
                <>
                  {/* Ingredient Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        Add Ingredient
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-48 w-full overflow-y-auto">
                      <DropdownMenuLabel>Available Ingredients</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {getAvailableIngredients(newItem.ingredientIds).length === 0 ? (
                        <div className="px-2 py-1 text-sm text-muted-foreground">
                          No more ingredients available
                        </div>
                      ) : (
                        getAvailableIngredients(newItem.ingredientIds).map((ingredient) => (
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
                  {newItem.ingredientIds.length > 0 && (
                    <div className="mt-3">
                      <Label className="mb-2 block text-sm font-medium">Selected Ingredients</Label>
                      <div className="flex flex-wrap gap-2">
                        {getSelectedIngredients(newItem.ingredientIds).map((ingredient) => (
                          <div
                            key={ingredient.uuid}
                            className="flex items-center gap-2 rounded-md bg-blue-100 px-3 py-1 text-sm dark:bg-blue-900/20"
                          >
                            <span>{ingredient.ingredientName}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-4 w-4 hover:bg-blue-200 dark:hover:bg-blue-800"
                              onClick={() => handleRemoveIngredient(ingredient.uuid)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Status Dropdown for Add Modal */}
            <div>
              <Label className="mb-2 block text-sm font-medium">Status</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {newItem.status}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={newItem.status === "Active"}
                    onCheckedChange={() => setNewItem({ ...newItem, status: "Active" })}
                  >
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={newItem.status === "Inactive"}
                    onCheckedChange={() => setNewItem({ ...newItem, status: "Inactive" })}
                  >
                    Inactive
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={!newItem.name.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div>
              <Label className="mb-2 block text-sm font-medium">Menu Item Name</Label>
              <Input
                placeholder="Menu Item Name"
                value={editItem.name}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
              />
            </div>

            <div>
              <Label className="mb-3 block text-sm font-medium">Manage Ingredients</Label>
              {ingredientsLoading ? (
                <div className="text-sm text-muted-foreground">Loading ingredients...</div>
              ) : (
                <div className="space-y-4">
                  {/* Current Ingredients Display */}
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/50">
                    <Label className="mb-3 block text-sm font-medium text-green-800 dark:text-green-300">
                      Current Ingredients ({editItem.ingredientIds.length})
                    </Label>
                    {editItem.ingredientIds.length === 0 ? (
                      <p className="text-sm italic text-muted-foreground">
                        No ingredients selected. Add some ingredients below.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {getSelectedIngredients(editItem.ingredientIds).map((ingredient) => (
                          <div
                            key={ingredient.uuid}
                            className="flex items-center gap-2 rounded-md bg-green-100 px-3 py-2 text-sm shadow-sm dark:bg-green-900/30"
                          >
                            <span className="font-medium">{ingredient.ingredientName}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-5 w-5 rounded-full hover:bg-green-200 dark:hover:bg-green-800"
                              onClick={() => handleRemoveIngredient(ingredient.uuid, true)}
                              title={`Remove ${ingredient.ingredientName}`}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add More Ingredients Section */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/50">
                    <Label className="mb-3 block text-sm font-medium text-blue-800 dark:text-blue-300">
                      Add More Ingredients
                    </Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          disabled={getAvailableIngredients(editItem.ingredientIds).length === 0}
                        >
                          {getAvailableIngredients(editItem.ingredientIds).length === 0
                            ? "All ingredients selected"
                            : `Add Ingredient (${getAvailableIngredients(editItem.ingredientIds).length} available)`}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="max-h-48 w-full overflow-y-auto">
                        <DropdownMenuLabel>Available Ingredients</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {getAvailableIngredients(editItem.ingredientIds).length === 0 ? (
                          <div className="px-2 py-2 text-center text-sm text-muted-foreground">
                            No more ingredients available
                          </div>
                        ) : (
                          getAvailableIngredients(editItem.ingredientIds).map((ingredient) => (
                            <DropdownMenuItem
                              key={ingredient.uuid}
                              onClick={() => handleAddIngredient(ingredient.uuid, true)}
                              className="cursor-pointer"
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              {ingredient.ingredientName}
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </div>

            {/* Status Dropdown for Edit Modal */}
            <div>
              <Label className="mb-2 block text-sm font-medium">Status</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {editItem.status}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={editItem.status === "Active"}
                    onCheckedChange={() => setEditItem({ ...editItem, status: "Active" })}
                  >
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={editItem.status === "Inactive"}
                    onCheckedChange={() => setEditItem({ ...editItem, status: "Inactive" })}
                  >
                    Inactive
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditItem} disabled={!editItem.name.trim()}>
              Update Menu Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Menu Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete "<strong>{itemToDelete?.name}</strong>"? This action
              cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={!!selected && !showEditModal} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Menu Item Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <p>
              <strong>Name:</strong> {selected?.name}
            </p>
            <p>
              <strong>Ingredients:</strong> {selected?.ingredients || "None"}
            </p>
            <p>
              <strong>Status:</strong> {selected?.status}
            </p>
            <p>
              <strong>Added At:</strong> {selected?.addedAt}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setSelected(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
