"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { toast } from "sonner"
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
import { Plus, Pencil, Trash, FileDown, X, ChevronDown, Loader2 } from "lucide-react"

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
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
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
import { useAllergens } from "@/hooks/useAllergens"
import { useIngredients } from "@/hooks/useIngredients"

type Ingredient = {
  uuid: string
  ingredientName: string
  expiryDays: number
  allergens: { uuid: string; allergenName: string }[]
}

function IngredientsSkeleton() {
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

export default function IngredientsTable() {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const [deletingIngredient, setDeletingIngredient] = useState<Ingredient | null>(null)
  const [newIngredient, setNewIngredient] = useState({
    ingredientName: "",
    expiryDays: 0,
  })
  const [editIngredientData, setEditIngredientData] = useState({
    ingredientName: "",
    expiryDays: 0,
  })
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([])
  const [editSelectedAllergens, setEditSelectedAllergens] = useState<string[]>([])
  const [allergenDropdownOpen, setAllergenDropdownOpen] = useState(false)
  const [editAllergenDropdownOpen, setEditAllergenDropdownOpen] = useState(false)
  const [allergenSearch, setAllergenSearch] = useState("");
  const [editAllergenSearch, setEditAllergenSearch] = useState("");

  // Use the ingredients hook
  const {
    ingredients,
    loading,
    addNewIngredient,
    updateExistingIngredient,
    deleteExistingIngredient,
    filterIngredients,
  } = useIngredients()

  // Use the allergens hook
  const { allergens, isLoading: allergensLoading, error: allergensError } = useAllergens()

  const filteredIngredients = filterIngredients(search)

  // Export filtered ingredients to XLSX
  const exportToXLSX = () => {
    const dataForExport = filteredIngredients.map((ing) => ({
      Name: ing.ingredientName,
      "Expiry Days": ing.expiryDays,
      Allergens:
        ing.allergens.length > 0 ? ing.allergens.map((a) => a.allergenName).join(", ") : "None",
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataForExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ingredients")
    XLSX.writeFile(workbook, "ingredients.xlsx")

    toast.success("Ingredients exported successfully")
  }

  const handleAddIngredient = async () => {
    if (!newIngredient.ingredientName.trim()) {
      toast.error("Ingredient name is required")
      return
    }

    // Duplicate check (case-insensitive, trimmed)
    const exists = ingredients.some(i => i.ingredientName.trim().toLowerCase() === newIngredient.ingredientName.trim().toLowerCase())
    if (exists) {
      toast.error("An ingredient with this name already exists.")
      return
    }

    if (newIngredient.expiryDays <= 0) {
      toast.error("Expiry days must be greater than 0")
      return
    }

    const ingredientData = {
      ingredientName: newIngredient.ingredientName.trim(),
      expiryDays: newIngredient.expiryDays,
      allergenIDs: selectedAllergens,
    }

    const success = await addNewIngredient(ingredientData)
    if (success) {
      setNewIngredient({ ingredientName: "", expiryDays: 0 })
      setSelectedAllergens([])
      setOpen(false)
    }
  }

  const handleUpdateIngredient = async () => {
    if (!editingIngredient) return

    if (!editIngredientData.ingredientName.trim()) {
      toast.error("Ingredient name is required")
      return
    }

    if (editIngredientData.expiryDays <= 0) {
      toast.error("Expiry days must be greater than 0")
      return
    }

    const updateData = {
      ingredientName: editIngredientData.ingredientName.trim(),
      expiryDays: editIngredientData.expiryDays,
      allergenIDs: editSelectedAllergens,
    }

    const success = await updateExistingIngredient(editingIngredient.uuid, updateData)
    console.log(";updated data", updateData)
    if (success) {
      setEditOpen(false)
      setEditingIngredient(null)
      setEditIngredientData({ ingredientName: "", expiryDays: 0 })
      setEditSelectedAllergens([])
    }
  }

  const handleDeleteIngredient = (ingredient: Ingredient) => {
    setDeletingIngredient(ingredient)
    setDeleteOpen(true)
  }

  const confirmDeleteIngredient = async () => {
    if (!deletingIngredient) return

    const success = await deleteExistingIngredient(deletingIngredient.uuid)
    if (success) {
      setDeleteOpen(false)
      setDeletingIngredient(null)
    }
  }

  const handleAllergenToggle = (allergenId: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergenId) ? prev.filter((id) => id !== allergenId) : [...prev, allergenId]
    )
  }

  const handleEditAllergenToggle = (allergenId: string) => {
    setEditSelectedAllergens((prev) =>
      prev.includes(allergenId) ? prev.filter((id) => id !== allergenId) : [...prev, allergenId]
    )
  }

  const removeSelectedAllergen = (allergenId: string) => {
    setSelectedAllergens((prev) => prev.filter((id) => id !== allergenId))
  }

  const removeEditSelectedAllergen = (allergenId: string) => {
    setEditSelectedAllergens((prev) => prev.filter((id) => id !== allergenId))
  }

  const getSelectedAllergenNames = () => {
    return allergens
      .filter((allergen) => selectedAllergens.includes((allergen as any).id))
      .map((allergen) => allergen.name)
  }

  const mapAllergenNamesToIds = (ingredientAllergens: { uuid: string; allergenName: string }[]) => {
    return ingredientAllergens
      .map((ingredientAllergen: { uuid: string; allergenName: string }) => {
        // Find the allergen in your allergens list by matching the name
        const foundAllergen = allergens.find((a) => a.name === ingredientAllergen.allergenName)
        return foundAllergen ? foundAllergen.id : null // or foundAllergen.uuid
      })
      .filter((id): id is string => id !== null) // Type-safe filter to remove null values
  }
  const getEditSelectedAllergenDetails = () => {
    return editSelectedAllergens
      .map((allergenId) => {
        const allergen = allergens.find((a) => a.id === allergenId) // or a.uuid - match your data structure
        return allergen
          ? {
              id: allergenId,
              name: allergen.name,
              category: allergen.category,
            }
          : null
      })
      .filter(
        (allergen): allergen is { id: string; name: string; category: string } => allergen !== null
      )
  }

  const getAvailableAllergens = () => {
    return allergens.filter(
      (allergen) => !editSelectedAllergens.includes(allergen.id) // or allergen.uuid - match your data structure
    )
  }

  const handleAddEditAllergen = (allergenId: string) => {
    setEditSelectedAllergens((prev) => [...prev, allergenId])
  }

  const handleRemoveEditAllergen = (allergenId: string) => {
    setEditSelectedAllergens((prev) => prev.filter((id) => id !== allergenId))
  }

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    setEditIngredientData({
      ingredientName: ingredient.ingredientName,
      expiryDays: ingredient.expiryDays,
    })

    // Map allergen names to IDs by reverse-engineering from your allergens list
    const allergenIds = mapAllergenNamesToIds(ingredient.allergens)
    setEditSelectedAllergens(allergenIds)
    setEditOpen(true)
  }

  // Pagination logic
  const itemsPerPage = 10
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage)
  const paginatedIngredients = filteredIngredients.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  // Loader and skeleton logic
  if (loading || allergensLoading) {
    return <IngredientsSkeleton />
  }

  if (allergensError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">Error: {allergensError || "Failed to load data."}</p>
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
        <h2 className="text-2xl font-semibold">Ingredients Dashboard</h2>
        <div>
          <Button variant="outline" className="mr-5" onClick={exportToXLSX}>
            <FileDown className="mr-2 h-4 w-4" /> Export Data
          </Button>

          {/* Add Ingredient Dialog */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:bg-primary/90">
                <Plus className="mr-1 h-4 w-4" />
                Add Ingredient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Ingredient</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="ingredientName">Name</Label>
                  <Input
                    id="ingredientName"
                    placeholder="E.g. Sugar"
                    value={newIngredient.ingredientName}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, ingredientName: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="expiryDays">Expiry Days</Label>
                  <Input
                    id="expiryDays"
                    type="number"
                    min={1}
                    placeholder="E.g. 7"
                    value={newIngredient.expiryDays}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, expiryDays: Number(e.target.value) })
                    }
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Allergens</Label>
                  <DropdownMenu open={allergenDropdownOpen} onOpenChange={setAllergenDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between text-left font-normal"
                        disabled={allergensLoading || loading}
                      >
                        <span>
                          {allergensLoading
                            ? "Loading allergens..."
                            : selectedAllergens.length === 0
                              ? "Select allergens..."
                              : `${selectedAllergens.length} allergen${selectedAllergens.length === 1 ? "" : "s"} selected`}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80" align="start">
                      <DropdownMenuLabel>Select Allergens</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Input
                        placeholder="Search allergens..."
                        value={allergenSearch}
                        onChange={e => setAllergenSearch(e.target.value)}
                        className="mb-2 w-full px-2 py-1 text-sm"
                      />
                      {allergensError ? (
                        <div className="px-2 py-1 text-sm text-red-500">
                          Error loading allergens: {allergensError}
                        </div>
                      ) : allergensLoading ? (
                        <div className="px-2 py-1 text-sm">Loading allergens...</div>
                      ) : allergens.length === 0 ? (
                        <div className="px-2 py-1 text-sm text-muted-foreground">
                          No allergens available
                        </div>
                      ) : (
                        <div className="max-h-60 overflow-y-auto">
                          {allergens
                            .filter(a => a.name.toLowerCase().includes(allergenSearch.toLowerCase()))
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((allergen) => (
                              <DropdownMenuCheckboxItem
                                key={allergen.id}
                                checked={selectedAllergens.includes(allergen.id)}
                                onCheckedChange={() => handleAllergenToggle(allergen.id)}
                                className="flex items-center space-x-2 px-2 py-2"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{allergen.name}</span>
                                  {allergen.category && (
                                    <span className="text-xs text-muted-foreground">
                                      {allergen.category}
                                    </span>
                                  )}
                                </div>
                              </DropdownMenuCheckboxItem>
                            ))}
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Display selected allergens as badges */}
                  {selectedAllergens.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {getSelectedAllergenNames().map((name, index) => (
                        <Badge
                          key={selectedAllergens[index]}
                          variant="outline"
                          className="text-xs"
                        >
                          {name}
                          <button
                            type="button"
                            className="ml-1 hover:text-destructive"
                            onClick={() => removeSelectedAllergen(selectedAllergens[index])}
                            disabled={loading}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddIngredient}
                  className="bg-primary text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Ingredient Dialog */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Ingredient</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Ingredient Name */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Ingredient Name</Label>
                  <Input
                    placeholder="E.g. Sugar"
                    value={editIngredientData.ingredientName}
                    onChange={(e) =>
                      setEditIngredientData({
                        ...editIngredientData,
                        ingredientName: e.target.value,
                      })
                    }
                    disabled={loading}
                  />
                </div>

                {/* Expiry Days */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">Expiry Days</Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="E.g. 7"
                    value={editIngredientData.expiryDays}
                    onChange={(e) =>
                      setEditIngredientData({
                        ...editIngredientData,
                        expiryDays: Number(e.target.value),
                      })
                    }
                    disabled={loading}
                  />
                </div>

                {/* Allergens Management */}
                <div>
                  <Label className="mb-3 block text-sm font-medium">Manage Allergens</Label>
                  {allergensLoading ? (
                    <div className="text-sm text-muted-foreground">Loading allergens...</div>
                  ) : allergensError ? (
                    <div className="text-sm text-red-500">
                      Error loading allergens: {allergensError}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Current Allergens Display */}
                              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
          <Label className="mb-3 block text-sm font-medium text-orange-800">
                          Current Allergens ({editSelectedAllergens.length})
                        </Label>
                        {editSelectedAllergens.length === 0 ? (
                          <p className="text-sm italic text-muted-foreground">
                            No allergens selected. Add some allergens below.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {getEditSelectedAllergenDetails().map((allergen) => (
                              <div
                                key={allergen.id}
                                className="flex items-center gap-2 rounded-md bg-orange-100 px-3 py-2 text-sm shadow-sm"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{allergen.name}</span>
                                  {allergen.category && (
                                    <span className="text-xs text-muted-foreground">
                                      {allergen.category}
                                    </span>
                                  )}
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-5 w-5 rounded-full hover:bg-orange-200"
                                  onClick={() => handleRemoveEditAllergen(allergen.id)}
                                  title={`Remove ${allergen.name}`}
                                  disabled={loading}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Add More Allergens Section */}
                      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                        <Label className="mb-3 block text-sm font-medium text-blue-800">
                          Add More Allergens
                        </Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                              disabled={getAvailableAllergens().length === 0 || loading}
                            >
                              {getAvailableAllergens().length === 0
                                ? "All allergens selected"
                                : `Add Allergen (${getAvailableAllergens().length} available)`}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="max-h-48 w-full overflow-y-auto">
                            <DropdownMenuLabel>Available Allergens</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Input
                              placeholder="Search allergens..."
                              value={editAllergenSearch}
                              onChange={e => setEditAllergenSearch(e.target.value)}
                              className="mb-2 w-full px-2 py-1 text-sm"
                            />
                            {getAvailableAllergens().filter(a => a.name.toLowerCase().includes(editAllergenSearch.toLowerCase())).length === 0 ? (
                              <div className="px-2 py-2 text-center text-sm text-muted-foreground">
                                No more allergens available
                              </div>
                            ) : (
                              getAvailableAllergens()
                                .filter(a => a.name.toLowerCase().includes(editAllergenSearch.toLowerCase()))
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((allergen) => (
                                  <DropdownMenuItem
                                    key={allergen.id}
                                    onClick={() => handleAddEditAllergen(allergen.id)}
                                    className="cursor-pointer"
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    <div className="flex flex-col">
                                      <span className="font-medium">{allergen.name}</span>
                                      {allergen.category && (
                                        <span className="text-xs text-muted-foreground">
                                          {allergen.category}
                                        </span>
                                      )}
                                    </div>
                                  </DropdownMenuItem>
                                ))
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditOpen(false)
                    setEditingIngredient(null)
                    setEditIngredientData({ ingredientName: "", expiryDays: 0 })
                    setEditSelectedAllergens([])
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateIngredient}
                  disabled={
                    !editIngredientData.ingredientName.trim() ||
                    editIngredientData.expiryDays <= 0 ||
                    loading
                  }
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Ingredient"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the ingredient "{deletingIngredient?.ingredientName}
                  ". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDeleteIngredient}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="my-6 rounded-xl border bg-card p-6 shadow">
          <p className="text-muted-foreground">
            Ingredient{filteredIngredients.length !== 1 ? "s" : ""}
          </p>
          <h3 className="text-2xl font-bold">{filteredIngredients.length}</h3>
        </div>
      </div>

      <div className="rmt-4 overflow-x-auto rounded-2xl border bg-card shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Input
              placeholder="Search ingredients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="m-6 w-full p-6 sm:w-64"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/4">Name</TableHead>
              <TableHead className="w-1/4">Expiry Days</TableHead>
              <TableHead className="w-1/4">Allergens</TableHead>
              <TableHead className="w-1/4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedIngredients.map((ingredient) => (
              <TableRow key={ingredient.uuid}>
                <TableCell>{ingredient.ingredientName}</TableCell>
                <TableCell>{ingredient.expiryDays}</TableCell>
                <TableCell>
                  {ingredient.allergens.length > 0
                    ? ingredient.allergens.map((a) => a.allergenName).join(", ")
                    : "None"}
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-primary"
                    onClick={() => handleEditIngredient(ingredient)}
                    disabled={loading}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteIngredient(ingredient)}
                    disabled={loading}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>

          {/* First page */}
          <Button
            variant={page === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(1)}
            className="min-w-[36px] px-2 py-1"
          >
            1
          </Button>

          {/* Ellipsis before current range */}
          {page > 3 && totalPages > 5 && (
            <span className="px-2 py-1 text-muted-foreground">...</span>
          )}

          {/* Pages around current */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) => p !== 1 && p !== totalPages && Math.abs(p - page) <= 1 // show current, previous, next
            )
            .map((p) => (
              <Button
                key={p}
                variant={page === p ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
                className="min-w-[36px] px-2 py-1"
              >
                {p}
              </Button>
            ))}

          {/* Ellipsis after current range */}
          {page < totalPages - 2 && totalPages > 5 && (
            <span className="px-2 py-1 text-muted-foreground">...</span>
          )}

          {/* Last page */}
          {totalPages > 1 && (
            <Button
              variant={page === totalPages ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(totalPages)}
              className="min-w-[36px] px-2 py-1"
            >
              {totalPages}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
