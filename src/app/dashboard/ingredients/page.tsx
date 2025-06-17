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

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    setEditIngredientData({
      ingredientName: ingredient.ingredientName,
      expiryDays: ingredient.expiryDays,
    })
    setEditSelectedAllergens(ingredient.allergens.map((a) => a.uuid))
    setEditOpen(true)
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

  const getEditSelectedAllergenNames = () => {
    return allergens
      .filter((allergen) => editSelectedAllergens.includes((allergen as any).id))
      .map((allergen) => allergen.name)
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
                          {allergens.map((allergen) => (
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
                          variant="secondary"
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
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Ingredient</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-1">
                  <Label htmlFor="editIngredientName">Name</Label>
                  <Input
                    id="editIngredientName"
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
                <div className="space-y-1">
                  <Label htmlFor="editExpiryDays">Expiry Days</Label>
                  <Input
                    id="editExpiryDays"
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
                <div className="space-y-2">
                  <Label>Allergens</Label>
                  <DropdownMenu
                    open={editAllergenDropdownOpen}
                    onOpenChange={setEditAllergenDropdownOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between text-left font-normal"
                        disabled={allergensLoading || loading}
                      >
                        <span>
                          {allergensLoading
                            ? "Loading allergens..."
                            : editSelectedAllergens.length === 0
                              ? "Select allergens..."
                              : `${editSelectedAllergens.length} allergen${editSelectedAllergens.length === 1 ? "" : "s"} selected`}
                        </span>
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80" align="start">
                      <DropdownMenuLabel>Select Allergens</DropdownMenuLabel>
                      <DropdownMenuSeparator />
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
                          {allergens.map((allergen) => (
                            <DropdownMenuCheckboxItem
                              key={allergen.id}
                              checked={editSelectedAllergens.includes(allergen.id)}
                              onCheckedChange={() => handleEditAllergenToggle(allergen.id)}
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
                  {editSelectedAllergens.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {getEditSelectedAllergenNames().map((name, index) => (
                        <Badge
                          key={editSelectedAllergens[index]}
                          variant="secondary"
                          className="text-xs"
                        >
                          {name}
                          <button
                            type="button"
                            className="ml-1 hover:text-destructive"
                            onClick={() => removeEditSelectedAllergen(editSelectedAllergens[index])}
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
                  onClick={handleUpdateIngredient}
                  className="bg-primary text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update"
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
            {filteredIngredients.map((ingredient) => (
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
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
