"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileDown, Printer } from "lucide-react"
import * as XLSX from "xlsx"
import { formatLabelForPrintImage } from "../print/labelFormatter"
import { PrintQueueItem } from "@/types/print"
import { LabelHeight } from "../print/LabelHeightChooser"
import { usePrinter } from "@/context/PrinterContext"

interface PrintLog {
  id: number
  user_id: string
  action: string
  details: {
    itemId: string
    itemName: string
    quantity: number
    labelType: "cook" | "prep" | "ppds"
    printedAt: string
    initial?: string
    labelHeight?: LabelHeight
    printerUsed?: {
      name: string
      uri: string
      state: string
    }
  }
  timestamp: string
}

interface GroupedPrintSession {
  sessionId: string
  timestamp: string
  printedAt: string
  items: PrintLog[]
  printerUsed?: {
    name: string
    uri: string
    state: string
  }
  initial?: string
  labelHeight?: LabelHeight
}

// Define Printer type locally to match PrinterContext
interface Printer {
  name: string
  systemName: string
  driverName: string
  state: string
  location: string
  isDefault: boolean
}

// Enhanced getBestAvailablePrinter function for robust printer selection
function getBestAvailablePrinter(
  selectedPrinter: Printer | null,
  defaultPrinter: Printer | null,
  availablePrinters: Printer[]
): { printer: Printer | null; reason: string } {
  console.log("🖨️ Printer Selection Debug:", {
    selectedPrinter: selectedPrinter?.name,
    defaultPrinter: defaultPrinter?.name,
    availablePrinters: availablePrinters?.slice(0, 5).map(p => p.name),
    availableCount: availablePrinters?.length || 0
  });

  const validPrinters = (availablePrinters || []).filter(printer => 
    printer && 
    printer.name &&
    printer.name.trim() !== "" && 
    printer.name !== "Fallback_Printer" &&
    !printer.name.toLowerCase().includes('fallback')
  );

  if (selectedPrinter && 
      selectedPrinter.name !== "Fallback_Printer" && 
      validPrinters.some(p => p.name === selectedPrinter.name)) {
    return { printer: selectedPrinter, reason: "Selected printer available" };
  }
  
  if (defaultPrinter && 
      defaultPrinter.name !== "Fallback_Printer" && 
      validPrinters.some(p => p.name === defaultPrinter.name)) {
    return { printer: defaultPrinter, reason: "Default printer available" };
  }
  
  if (validPrinters.length > 0) {
    return { printer: validPrinters[0], reason: "First available printer" };
  }
  
  return { printer: null, reason: "No valid printers available" };
}

function PrintSessionsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-muted-foreground/20" />
        <div className="h-10 w-32 animate-pulse rounded bg-muted-foreground/20" />
      </div>
      <div className="h-64 w-full animate-pulse rounded bg-muted-foreground/10" />
    </div>
  )
}

export default function PrintSessionsPage() {
  const [printLogs, setPrintLogs] = useState<PrintLog[]>([])
  const [groupedSessions, setGroupedSessions] = useState<GroupedPrintSession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<GroupedPrintSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [printingStates, setPrintingStates] = useState<{ [key: string]: boolean }>({})

  // Printer context
  const {
    isConnected,
    printers: availablePrinters,
    defaultPrinter,
    selectedPrinter,
    loading: printerLoading,
    print,
  } = usePrinter()

  useEffect(() => {
    const id = localStorage.getItem("userid")
    if (!id) return
  }, [])

  useEffect(() => {
    async function fetchPrintSessions() {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("No authentication token found")
        }

        const res = await fetch(`/api/logs`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.error || "Failed to fetch print sessions")
        }
        const data = await res.json()
        
        // Filter only print_label actions
        const printLabelLogs = (data.logs || []).filter((log: any) => log.action === "print_label")
        setPrintLogs(printLabelLogs)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchPrintSessions()
  }, [])

  // Group logs by print session (same timestamp within 5 seconds)
  useEffect(() => {
    if (printLogs.length === 0) {
      setGroupedSessions([])
      return
    }

    const grouped: { [key: string]: PrintLog[] } = {}
    
    printLogs.forEach(log => {
      const timestamp = new Date(log.timestamp).getTime()
      const printedAt = new Date(log.details.printedAt).getTime()
      
      // Group by timestamp (within 5 seconds) and printer
      const sessionKey = `${timestamp}-${log.details.printerUsed?.name || 'unknown'}`
      
      if (!grouped[sessionKey]) {
        grouped[sessionKey] = []
      }
      grouped[sessionKey].push(log)
    })

    // Convert to GroupedPrintSession array
    const sessions: GroupedPrintSession[] = Object.entries(grouped).map(([sessionId, logs]) => {
      const firstLog = logs[0]
      return {
        sessionId,
        timestamp: firstLog.timestamp,
        printedAt: firstLog.details.printedAt,
        items: logs,
        printerUsed: firstLog.details.printerUsed,
        initial: firstLog.details.initial,
        labelHeight: firstLog.details.labelHeight
      }
    })

    // Sort by timestamp (newest first)
    sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    setGroupedSessions(sessions)
  }, [printLogs])

  useEffect(() => {
    const filtered = groupedSessions.filter(
      (session) => {
        const itemNames = session.items.map(item => item.details.itemName).join(' ')
        return itemNames.toLowerCase().includes(search.toLowerCase())
      }
    )
    setFilteredSessions(filtered)
  }, [search, groupedSessions])

  function formatTimestamp(ts: string) {
    // Use ISO string for SSR safety
    return new Date(ts).toISOString().replace('T', ' ').slice(0, 19)
  }

  function formatPrintedAt(ts: string) {
    // Use ISO string for SSR safety
    return new Date(ts).toISOString().replace('T', ' ').slice(0, 19)
  }

  function getItemNames(session: GroupedPrintSession): string {
    return session.items.map(item => item.details.itemName).join(', ')
  }

  function getTotalQuantity(session: GroupedPrintSession): number {
    return session.items.reduce((total, item) => total + item.details.quantity, 0)
  }

  function getLabelTypes(session: GroupedPrintSession): string {
    const types = [...new Set(session.items.map(item => item.details.labelType))]
    return types.map(type => type.toUpperCase()).join(', ')
  }

  async function handlePrintSession(session: GroupedPrintSession) {
    const sessionId = session.sessionId
    setPrintingStates(prev => ({ ...prev, [sessionId]: true }))
    
    try {
      if (printerLoading) {
        throw new Error("Checking printer status, please wait...")
      }
      
      if (!isConnected) {
        console.warn("⚠️ Printer not connected, but allowing print for debug purposes")
      }

      // Get the best available printer using our helper function
      const printerSelection = getBestAvailablePrinter(selectedPrinter, defaultPrinter, availablePrinters)
      
      if (!printerSelection.printer) {
        console.warn("⚠️ No printer available, but allowing print for debug purposes")
      }

      // Get allergens from localStorage or use empty array
      const allergens = JSON.parse(localStorage.getItem("allergens") || "[]")
      const allergenNames = allergens.map((a: any) => a.allergenName?.toLowerCase() || "")
      
      let successCount = 0
      let failCount = 0
      const failItems: string[] = []

      // Print each item in the session
      for (const log of session.items) {
        try {
          // Create a PrintQueueItem from the log data
          const printItem: PrintQueueItem = {
            uid: log.details.itemId,
            id: log.details.itemId,
            type: "menu", // Default to menu since we don't have this info in logs
            name: log.details.itemName,
            quantity: log.details.quantity,
            printedOn: log.details.printedAt,
            expiryDate: new Date().toISOString().split('T')[0], // Default expiry
            labelType: log.details.labelType,
            ingredients: [], // We don't have ingredients in logs
            allergens: [] // We don't have allergens in logs
          }

          // Use the label height from the log or default to 31mm
          const labelHeight = log.details.labelHeight || "31mm"

          // Generate the label image
          const imageDataUrl = await formatLabelForPrintImage(
            printItem,
            allergenNames,
            {}, // customExpiry
            5, // maxIngredients
            false, // useInitials
            log.details.initial || "", // selectedInitial
            labelHeight
          )

          console.log(`🖨️ Image generated for ${log.details.itemName}, length: ${imageDataUrl.length}`)

          // Print using WebSocket (if connected) or just log for debug
          if (isConnected) {
            await print(imageDataUrl);
            console.log(`✅ Printed ${log.details.itemName} successfully`)
          } else {
            console.log("🖨️ DEBUG: Would print image data:", imageDataUrl.substring(0, 100) + "...")
          }

          successCount++;
        } catch (error) {
          failCount++;
          failItems.push(log.details.itemName);
          console.error(`❌ Print error for item ${log.details.itemName}:`, error);
        }
      }

      if (failCount === 0) {
        const message = isConnected 
          ? `Successfully reprinted ${successCount} labels using ${printerSelection.printer?.name}`
          : `DEBUG: Would reprint ${successCount} labels (printer not connected)`;
        alert(message);
      } else {
        alert(`Reprinted ${successCount} labels, failed ${failCount}: ${failItems.join(", ")}`);
      }
    } catch (error) {
      console.error("Failed to print session:", error)
      alert(`Print failed: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setPrintingStates(prev => ({ ...prev, [sessionId]: false }))
    }
  }

  function exportToXLSX() {
    const dataForExport = filteredSessions.map((session) => ({
      "Session ID": session.sessionId,
      "Items": getItemNames(session),
      "Total Quantity": getTotalQuantity(session),
      "Label Types": getLabelTypes(session),
      "Printed At": formatPrintedAt(session.printedAt),
      "Logged At": formatTimestamp(session.timestamp),
      "Printer Used": session.printerUsed?.name || "Unknown",
      "Initial": session.initial || "None",
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataForExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Print Sessions")
    XLSX.writeFile(workbook, "print_sessions.xlsx")
  }

  // Pagination logic
  const itemsPerPage = 20
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage)
  const paginatedSessions = filteredSessions.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Show skeleton if loading and no data loaded yet
  if (loading && printLogs.length === 0) {
    return <PrintSessionsSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Print Sessions</h2>
        <Button variant="outline" className="mr-5" onClick={exportToXLSX}>
          <FileDown className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="my-6 rounded-xl border bg-card p-6 shadow">
          <p className="text-muted-foreground">Total Print Sessions</p>
          <h3 className="text-2xl font-bold">{filteredSessions.length}</h3>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-card shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Input
              placeholder="Search by item names..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="m-6 w-full p-6 sm:w-64"
            />
          </div>
        </div>

        {/* In-place loader for subsequent loads */}
        {loading && printLogs.length > 0 && <div className="p-6 text-center">Loading print sessions...</div>}
        {error && <p className="p-6 text-red-600">Error: {error}</p>}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Items</TableHead>
                <TableHead className="whitespace-nowrap">Total Quantity</TableHead>
                <TableHead className="whitespace-nowrap">Label Types</TableHead>
                <TableHead className="whitespace-nowrap">Printed At</TableHead>
                <TableHead className="whitespace-nowrap">Printer</TableHead>
                <TableHead className="whitespace-nowrap">Initial</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSessions.map((session) => (
                <TableRow key={session.sessionId}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate" title={getItemNames(session)}>
                      {getItemNames(session)}
                    </div>
                  </TableCell>
                  <TableCell>{isNaN(getTotalQuantity(session)) ? 'N/A' : getTotalQuantity(session)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {[...new Set(session.items.map(item => item.details.labelType))].map((type) => (
                        <span key={type} className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          type === 'cook' ? 'bg-red-100 text-red-800' :
                          type === 'prep' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {type.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{formatPrintedAt(session.printedAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {session.printerUsed?.name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {session.initial ? (
                      <span className="rounded border px-2 py-1 text-xs font-mono">
                        {session.initial}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handlePrintSession(session)}
                      disabled={printingStates[session.sessionId]}
                      className="h-8 px-3"
                    >
                      {printingStates[session.sessionId] ? (
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Printing...
                        </div>
                      ) : (
                        <>
                          <Printer className="mr-1 h-3 w-3" />
                          Print All
                        </>
                      )}
                    </Button>
                  </TableCell>
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
