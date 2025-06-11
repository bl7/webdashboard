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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui" // Assuming you have Select component, otherwise can replace with <select>
import { Plus, Eye, Pencil, Trash, FileDown, X } from "lucide-react"
import * as XLSX from "xlsx"
import { getAllAllergens, addAllergens } from "@/lib/api"
import { allergenIconMap } from "../../../components/allergenicons"
import allergenColorMap from "@/components/allergencolormap"
type Allergen = {
  id: number
  name: string
  category: string
  severity: "Low" | "Medium" | "High"
  status: "Active" | "Inactive"
  addedAt: string
  isCustom: boolean
}

function estimateSeverity(name: string): "Low" | "Medium" | "High" {
  const lower = name.toLowerCase()
  if (["peanut", "shellfish", "tree nut"].some((k) => lower.includes(k))) return "High"
  if (["gluten", "dairy", "soy"].some((k) => lower.includes(k))) return "Medium"
  return "Low"
}

export default function AllergenDashboard() {
  const [query, setQuery] = useState("")
  const [data, setData] = useState<Allergen[]>([])
  const [selected, setSelected] = useState<Allergen | null>(null)
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAllergenName, setNewAllergenName] = useState("")

  // New state to track filter type: "All" | "Custom" | "Standard"
  const [filterType, setFilterType] = useState<"All" | "Custom" | "Standard">("All")

  const perPage = 5

  // Filter data by query AND filterType
  const filtered = data.filter((d) => {
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase())
    const matchesType =
      filterType === "All" ? true : filterType === "Custom" ? d.isCustom : !d.isCustom // Standard
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

  const handleAddCustomAllergen = () => {
    const token = localStorage.getItem("token")
    const newItem: Allergen = {
      id: Date.now(),
      name: newAllergenName,
      category: "Custom",
      severity: estimateSeverity(newAllergenName),
      status: "Active",
      addedAt: new Date().toISOString().split("T")[0],
      isCustom: true,
    }
    console.log(newItem, token)
    setData([newItem, ...data])
    addAllergens(newItem.name, token)
    console.log("added")
    setNewAllergenName("")
    setShowAddModal(false)
  }

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((a) => a.id !== id))
  }

  const handleEdit = (id: number, newName: string) => {
    setData((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, name: newName, severity: estimateSeverity(newName) } : a
      )
    )
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return console.error("No access token")

    const fetchAllergens = async () => {
      try {
        const res = await getAllAllergens(token)
        if (!res?.data) return

        const mapped = res.data.map(
          (item: any): Allergen => ({
            id: item.id,
            name: item.allergenName,
            category: item.isCustom ? "Custom" : "Standard",
            severity: estimateSeverity(item.allergenName),
            status: item.isActive ? "Active" : "Inactive",
            addedAt: item.createdAt.split("T")[0],
            isCustom: item.isCustom,
          })
        )
        setData(mapped)
      } catch (err) {
        console.error("Failed to fetch allergens:", err)
      }
    }

    fetchAllergens()
  }, [])

  const customCount = data.filter((d) => d.isCustom).length
  const standardCount = data.filter((d) => !d.isCustom).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Allergen Dashboard</h2>
        <div>
          <Button variant="outline" className="mr-5" onClick={handleExportExcel}>
            <FileDown className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Allergen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <div className="mt-4 flex items-center justify-between gap-4 p-5">
          <Input
            placeholder="Search allergens..."
            className="max-w-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* Filter Select */}
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as "All" | "Custom" | "Standard")}
          >
            <SelectTrigger className="w-[150px]">
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
                        onClick={() => {
                          const newName = prompt("Edit allergen name:", item.name)
                          if (newName) handleEdit(item.id, newName)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
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
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomAllergen} disabled={!newAllergenName.trim()}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
