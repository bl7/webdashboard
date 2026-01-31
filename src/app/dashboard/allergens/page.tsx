"use client"

import { useState } from "react"
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui"
import { Plus, Eye, Pencil, Trash, FileDown, X } from "lucide-react"
import * as XLSX from "xlsx"
import { useAllergens, type Allergen } from "@/hooks/useAllergens"
import { allergenIconMap } from "../../../components/allergenicons"
import allergenColorMap from "@/components/allergencolormap"
import AppLoader from "@/components/AppLoader"
import { toast } from "sonner"

function AllergensSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-muted-foreground/20" />
        <div className="flex gap-2">
          <div className="h-10 w-32 animate-pulse rounded bg-muted-foreground/20" />
          <div className="h-10 w-32 animate-pulse rounded bg-muted-foreground/20" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 animate-pulse rounded-xl bg-muted-foreground/10" />
        <div className="h-24 animate-pulse rounded-xl bg-muted-foreground/10" />
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-muted-foreground/10" />
    </div>
  )
}

export default function AllergenDashboard() {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Allergen | null>(null)
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newAllergenName, setNewAllergenName] = useState("")
  const [editingAllergen, setEditingAllergen] = useState<Allergen | null>(null)
  const [deletingAllergen, setDeletingAllergen] = useState<Allergen | null>(null)
  const [isOperationLoading, setIsOperationLoading] = useState(false)
  const [filterType, setFilterType] = useState<"All" | "Custom" | "Standard">("All")

  const {
    allergens,
    isLoading: isFetchingAllergens,
    error,
    addAllergen,
    updateAllergenItem,
    deleteAllergenItem,
    customCount,
    standardCount,
    refreshAllergens,
  } = useAllergens()

  const perPage = 14

  const filtered = allergens.filter((d) => {
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase())
    const matchesType =
      filterType === "All" ? true : filterType === "Custom" ? d.isCustom : !d.isCustom
    return matchesQuery && matchesType
  })

  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const maxPages = Math.ceil(filtered.length / perPage)

  const handleExportExcel = () => {
    const exportData = filtered.map((item) => ({
      ID: item.id,
      Name: item.name,
      Category: item.category,
      Severity: item.severity,
      Status: item.status,
      AddedAt: item.addedAt,
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Allergens")
    XLSX.writeFile(workbook, `allergens-export-${Date.now()}.xlsx`)
  }

  const handleAddCustomAllergen = async () => {
    if (!newAllergenName.trim()) return

    // Duplicate check (case-insensitive, trimmed)
    const exists = allergens.some(
      (a) => a.name.trim().toLowerCase() === newAllergenName.trim().toLowerCase()
    )
    if (exists) {
      toast.error("An allergen with this name already exists.")
      return
    }

    setIsOperationLoading(true)
    try {
      await addAllergen(newAllergenName.trim())
      setNewAllergenName("")
      setShowAddModal(false)
    } catch (error) {
      console.error("Failed to add allergen:", error)
      toast.error("Failed to add allergen. Please try again.")
    } finally {
      setIsOperationLoading(false)
    }
  }

  const handleEditAllergen = async () => {
    if (!editingAllergen || !newAllergenName.trim()) return

    setIsOperationLoading(true)
    try {
      await updateAllergenItem(editingAllergen.id, newAllergenName.trim())
      setNewAllergenName("")
      setEditingAllergen(null)
      setShowEditModal(false)
    } catch (error) {
      console.error("Failed to update allergen:", error)
      alert("Failed to update allergen. Please try again.")
    } finally {
      setIsOperationLoading(false)
    }
  }

  const handleDeleteAllergen = async () => {
    if (!deletingAllergen) return

    setIsOperationLoading(true)
    try {
      await deleteAllergenItem(deletingAllergen.id)
      setDeletingAllergen(null)
      setShowDeleteModal(false)
    } catch (error) {
      console.error("Failed to delete allergen:", error)
      alert("Failed to delete allergen. Please try again.")
    } finally {
      setIsOperationLoading(false)
    }
  }

  const openEditModal = (allergen: Allergen) => {
    setEditingAllergen(allergen)
    setNewAllergenName(allergen.name)
    setShowEditModal(true)
  }

  const openDeleteModal = (allergen: Allergen) => {
    setDeletingAllergen(allergen)
    setShowDeleteModal(true)
  }

  // Loading state
  if (isFetchingAllergens && allergens.length === 0) {
    return <AllergensSkeleton />
  }

  // Loader for in-place loading (e.g., during add/edit/delete)
  if (isFetchingAllergens && allergens.length > 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <AppLoader message="Loading allergens..." />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">Error: {error}</p>
          <Button onClick={refreshAllergens} variant="default">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold sm:text-2xl">Allergen Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileDown className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button onClick={() => setShowAddModal(true)} variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Add Allergen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow">
          <p className="text-muted-foreground">Custom Allergens</p>
          <h3 className="text-2xl font-bold">{customCount}</h3>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow">
          <p className="text-muted-foreground">Standard Allergens</p>
          <h3 className="text-2xl font-bold">{standardCount}</h3>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border bg-card shadow-sm">
        <div className="mt-4 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search allergens..."
            className="w-full max-w-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as "All" | "Custom" | "Standard")}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Added</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.map((item) => (
              <tr key={item.id} className="transition hover:bg-muted">
                <td className="px-6 py-4 font-medium">
                  {Array.isArray(item.name)
                    ? item.name.map((a, i) => {
                        const key = a.toLowerCase()
                        const icon = allergenIconMap[key] ?? allergenIconMap.default
                        const color = allergenColorMap[key] ?? allergenColorMap.default

                        return (
                          <span key={a} className="flex items-center">
                            <span className={`${color} mr-1`}>{icon}</span>
                            {a}
                            {i < item.name.length - 1 && ", "}
                          </span>
                        )
                      })
                    : (() => {
                        const key = item.name.toLowerCase()
                        const icon = allergenIconMap[key] ?? allergenIconMap.default
                        const color = allergenColorMap[key] ?? allergenColorMap.default

                        return (
                          <span className="flex items-center">
                            <span className={`${color} mr-1`}>{icon}</span>
                            {item.name}
                          </span>
                        )
                      })()}
                </td>

                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{item.severity}</td>
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
                  {item.isCustom && (
                    <>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditModal(item)}
                        disabled={isOperationLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openDeleteModal(item)}
                        disabled={isOperationLoading}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No allergens found.
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

      {/* View Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Allergen</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <div>
                <strong>Name:</strong> {selected.name}
              </div>
              <div>
                <strong>Category:</strong> {selected.category}
              </div>
              <div>
                <strong>Severity:</strong> {selected.severity}
              </div>
              <div>
                <strong>Status:</strong> {selected.status}
              </div>
              <div>
                <strong>Added:</strong> {selected.addedAt}
              </div>
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

      {/* Add Allergen Dialog */}
      <Dialog open={showAddModal} onOpenChange={() => setShowAddModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Allergen</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter allergen name"
            value={newAllergenName}
            onChange={(e) => setNewAllergenName(e.target.value)}
            disabled={isOperationLoading}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false)
                setNewAllergenName("")
              }}
              disabled={isOperationLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCustomAllergen}
              disabled={!newAllergenName.trim() || isOperationLoading}
            >
              {isOperationLoading ? "Adding..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Allergen Dialog */}
      <Dialog open={showEditModal} onOpenChange={() => setShowEditModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Custom Allergen</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter allergen name"
            value={newAllergenName}
            onChange={(e) => setNewAllergenName(e.target.value)}
            disabled={isOperationLoading}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false)
                setNewAllergenName("")
                setEditingAllergen(null)
              }}
              disabled={isOperationLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditAllergen}
              disabled={!newAllergenName.trim() || isOperationLoading}
            >
              {isOperationLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={() => setShowDeleteModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Allergen</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete "{deletingAllergen?.name}"? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setDeletingAllergen(null)
              }}
              disabled={isOperationLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAllergen}
              disabled={isOperationLoading}
            >
              {isOperationLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
