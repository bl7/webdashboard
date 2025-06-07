"use client"

import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
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
// import { Pencil, Trash2, Plus, Download, FileDown } from "lucide-react"
import { Plus, Eye, Pencil, Trash, FileDown, X } from "lucide-react"

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
import { getAllIngredients, addIngredient } from "@/lib/api"

type Ingredient = {
  uuid: string
  ingredientName: string
  expiryDays: number
  allergens: { uuid: string; allergenName: string }[]
}

export default function IngredientsTable() {
  const [search, setSearch] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [open, setOpen] = useState(false)
  const [newIngredient, setNewIngredient] = useState({
    ingredientName: "",
    expiryDays: 0,
  })

  useEffect(() => {
    const fetchIngredients = async () => {
      const token = localStorage.getItem("token")
      if (!token) return
      try {
        const data = await getAllIngredients(token)
        setIngredients(Array.isArray(data) ? data : data.data)
      } catch (err) {
        console.error("Error fetching ingredients:", err)
      }
    }
    fetchIngredients()
  }, [])

  const filteredIngredients = ingredients.filter((item) =>
    item.ingredientName?.toLowerCase().includes(search.toLowerCase())
  )

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
  }

  const handleAddIngredient = async () => {
    if (!newIngredient.ingredientName || newIngredient.expiryDays <= 0) return
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const added = await addIngredient(newIngredient, token)
      setIngredients([...ingredients, added])
      setNewIngredient({ ingredientName: "", expiryDays: 0 })
      setOpen(false)
    } catch (err) {
      console.error("Error adding ingredient:", err)
    }
  }

  return (
    <div space-y-6>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Ingredients Dashboard</h2>
        <div>
          <Button variant="outline" className="mr-5" onClick={exportToXLSX}>
            <FileDown className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:bg-primary/90">
                <Plus className="mr-1 h-4 w-4" />
                Add Ingredient
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddIngredient} className="bg-primary text-white">
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  <Button size="icon" variant="ghost" className="text-muted-foreground">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-white">
                    <Trash className="h-4 w-4 text-red-500" />
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
