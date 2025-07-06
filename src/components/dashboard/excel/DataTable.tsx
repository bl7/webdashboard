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
import { Badge } from "@/components/ui/badge"
import { Search, Download, Filter } from "lucide-react"
import * as XLSX from "xlsx"

interface DataTableProps {
  data: Array<Record<string, any>>
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No data to display.</p>
        </div>
      </div>
    )
  }

  const headers = Object.keys(data[0])

  // Filter data based on search term
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const downloadFilteredData = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(filteredData)
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Data")
    XLSX.writeFile(wb, `filtered_data_${Date.now()}.xlsx`)
  }

  const formatCellValue = (value: any, header: string): React.ReactNode => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground">-</span>
    }

    // Special formatting for allergens column
    if (header.toLowerCase().includes("allergen")) {
      const allergens = String(value).split(",").map((a: string) => a.trim()).filter(Boolean)
      if (allergens.length === 0 || (allergens.length === 1 && allergens[0].toLowerCase() === "none")) {
        return <Badge variant="outline" className="text-xs">None</Badge>
      }
      return (
        <div className="flex flex-wrap gap-1">
          {allergens.map((allergen: string, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {allergen}
            </Badge>
          ))}
        </div>
      )
    }

    // Special formatting for shelf life
    if (header.toLowerCase().includes("shelf") || header.toLowerCase().includes("expiry")) {
      const numValue = Number(value)
      if (!isNaN(numValue)) {
        return (
          <Badge variant={numValue < 1 ? "destructive" : numValue < 3 ? "default" : "secondary"}>
            {numValue}d
          </Badge>
        )
      }
    }

    return String(value)
  }

  return (
    <div className="space-y-4">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Badge variant="outline" className="text-xs">
            {filteredData.length} of {data.length} rows
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={downloadFilteredData}>
          <Download className="h-4 w-4 mr-2" />
          Export Filtered
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header} className="font-semibold">
                  {header.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, idx) => (
              <TableRow key={idx} className="hover:bg-muted/50">
                {headers.map((header) => (
                  <TableCell key={header} className="max-w-xs">
                    <div className="truncate">
                      {formatCellValue(row[header], header)}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
