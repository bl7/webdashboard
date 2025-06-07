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
} from "@/components/ui"
import { Plus, Eye, Pencil, Trash, FileDown } from "lucide-react"
import * as XLSX from "xlsx"
import { getAllMenuItems } from "@/lib/api"

type MenuItem = {
  id: string
  name: string
  ingredients: string
  status: "Active" | "Inactive"
  addedAt: string
}

export default function MenuItemsDashboard() {
  const [query, setQuery] = useState("")
  const [data, setData] = useState<MenuItem[]>([])
  const [selected, setSelected] = useState<MenuItem | null>(null)
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newItem, setNewItem] = useState<{ name: string; ingredients: string; status: string }>({
    name: "",
    ingredients: "",
    status: "",
  })
  const [filterType, setFilterType] = useState<"All" | "Active" | "Inactive">("All")

  const perPage = 5

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
            menuItems.push({
              id: item.menuItemID,
              name: item.menuItemName,
              ingredients: item.ingredients
                ? item.ingredients.map((ing: any) => ing.ingredientName).join(", ")
                : "",
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

    fetchMenuItems()
  }, [])

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

      {loading ? (
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
              <Select
                value={filterType}
                onValueChange={(value) => setFilterType(value as "All" | "Active" | "Inactive")}
                disabled={loading}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
                      <Button size="icon" variant="ghost">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-red-500">
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Menu Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <Input
              placeholder="Ingredients (comma separated)"
              value={newItem.ingredients}
              onChange={(e) => setNewItem({ ...newItem, ingredients: e.target.value })}
            />
            <Select
              value={newItem.status}
              onValueChange={(value) => setNewItem({ ...newItem, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setData((prev) => [
                  ...prev,
                  {
                    id: (Math.random() * 100000).toFixed(0),
                    name: newItem.name,
                    ingredients: newItem.ingredients,
                    status:
                      newItem.status === "" ? "Active" : (newItem.status as "Active" | "Inactive"),
                    addedAt: new Date().toISOString().split("T")[0],
                  },
                ])
                setShowAddModal(false)
                setNewItem({ name: "", ingredients: "", status: "" })
              }}
              disabled={!newItem.name.trim()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
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
