"use client"

import React, { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileDown } from "lucide-react"
import AppLoader from "@/components/AppLoader"

// Define the log type
interface Log {
  id: number
  user_id: string
  action: string
  details: any
  timestamp: string
}

function LogsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-muted-foreground/20" />
        <div className="h-10 w-32 animate-pulse rounded bg-muted-foreground/20" />
      </div>
      <div className="h-24 animate-pulse rounded-xl bg-muted-foreground/10" />
      <div className="h-96 animate-pulse rounded-2xl bg-muted-foreground/10" />
    </div>
  )
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem("userid")
    setUserId(id)
  }, [])

  useEffect(() => {
    if (!userId) return

    async function fetchLogs() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/logs?user_id=${userId}`)
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || "Failed to fetch logs")
        }
        const data = await res.json()
        setLogs(data.logs)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [userId])

  useEffect(() => {
    const filtered = logs.filter(
      (log) =>
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.details?.message?.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredLogs(filtered)
  }, [search, logs])

  function formatTimestamp(ts: string) {
    return new Date(ts).toLocaleString()
  }

  function renderDetails(details: any) {
    return (
      <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-sm">
        {JSON.stringify(details, null, 2)}
      </pre>
    )
  }

  function exportToXLSX() {
    const dataForExport = filteredLogs.map((log) => ({
      ID: log.id,
      Action: log.action,
      Timestamp: formatTimestamp(log.timestamp),
      Details: typeof log.details === "object" ? JSON.stringify(log.details) : log.details,
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataForExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs")
    XLSX.writeFile(workbook, "logs.xlsx")
  }

  // Pagination logic
  const itemsPerPage = 20
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Show skeleton if loading and no data loaded yet
  if (loading && logs.length === 0) {
    return <LogsSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Activity Log</h2>
        <Button variant="outline" className="mr-5" onClick={exportToXLSX}>
          <FileDown className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="my-6 rounded-xl border bg-card p-6 shadow">
          <p className="text-muted-foreground">Total Logs</p>
          <h3 className="text-2xl font-bold">{filteredLogs.length}</h3>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="m-6 w-full p-6 sm:w-64"
            />
          </div>
        </div>

        {/* In-place loader for subsequent loads */}
        {loading && logs.length > 0 && <AppLoader message="Loading logs..." />}
        {error && <p className="p-6 text-red-600">Error: {error}</p>}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">ID</TableHead>
                <TableHead className="whitespace-nowrap">Action</TableHead>
                <TableHead className="whitespace-nowrap">Timestamp</TableHead>
                <TableHead className="whitespace-nowrap">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map(({ id, action, timestamp, details }) => (
                <TableRow key={id}>
                  <TableCell>{id}</TableCell>
                  <TableCell>{action}</TableCell>
                  <TableCell>{formatTimestamp(timestamp)}</TableCell>
                  <TableCell>{renderDetails(details.message)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

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
