"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileDown, Printer } from "lucide-react"
import * as XLSX from "xlsx"
import { formatLabelForPrintImage } from "../print/labelFormatter"
import { PPDSLabelRenderer } from "../ppds/PPDSLabelRenderer"
import { toPng } from "html-to-image"
import ReactDOM from "react-dom/client"
import { PrintQueueItem } from "@/types/print"
import { LabelHeight } from "../print/LabelHeightChooser"
import { usePrinter } from "@/context/PrinterContext"
import useBillingData from "../profile/hooks/useBillingData"
import { getAllIngredients, getAllMenuItems } from "@/lib/api"

// Helper function for expiry date calculation
function calculateExpiryDate(labelType: "cooked" | "prep" | "ppds" | "ppd" | "default"): string {
  const today = new Date()
  const expiryDays =
    labelType === "cooked"
      ? 3
      : labelType === "prep"
        ? 3
        : labelType === "default"
          ? 2
          : labelType === "ppds"
            ? 5
            : labelType === "ppd"
              ? 5
              : 3

  today.setDate(today.getDate() + expiryDays)
  return today.toISOString().split("T")[0]
}

interface PrintLog {
  id: number
  user_id: string
  action: string
  details: {
    itemId: string
    itemName: string
    quantity: number
    labelType: "cooked" | "prep" | "ppds" | "ppd" | "default"
    printedAt: string
    initial?: string
    labelHeight?: LabelHeight
    printerUsed?: {
      name: string
      uri: string
      state: string
    }
    sessionId?: string
    bulkPrintListId?: string
    bulkPrintListName?: string
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
    availablePrinters: availablePrinters?.slice(0, 5).map((p) => p.name), // Limit log spam
    availableCount: availablePrinters?.length || 0,
  })

  // Ensure we have a valid array
  const validPrinters = (availablePrinters || []).filter((printer) => {
    const name = getPrinterName(printer)
    return (
      name &&
      name.trim() !== "" &&
      name !== "Fallback_Printer" &&
      !name.toLowerCase().includes("fallback")
    )
  })

  console.log(
    "🖨️ Valid printers after filtering:",
    validPrinters.map((p) => p.name)
  )

  // First priority: selected printer (if it exists in valid printers)
  if (
    selectedPrinter &&
    selectedPrinter.name !== "Fallback_Printer" &&
    validPrinters.some((p) => p.name === selectedPrinter.name)
  ) {
    console.log("🖨️ ✅ Using selected printer:", selectedPrinter.name)
    return { printer: selectedPrinter, reason: "Selected printer available" }
  }

  // Second priority: default printer (if it exists in valid printers)
  if (
    defaultPrinter &&
    defaultPrinter.name !== "Fallback_Printer" &&
    validPrinters.some((p) => p.name === defaultPrinter.name)
  ) {
    console.log("🖨️ ✅ Using default printer:", defaultPrinter.name)
    return { printer: defaultPrinter, reason: "Default printer available" }
  }

  // Third priority: first available valid printer
  if (validPrinters.length > 0) {
    console.log("🖨️ ✅ Using first available printer:", validPrinters[0].name)
    return { printer: validPrinters[0], reason: "First available printer" }
  }

  console.log("🖨️ ❌ No valid printers available")
  return { printer: null, reason: "No valid printers available" }
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

// Helper to get printer name
function getPrinterName(printer: any): string {
  if (!printer) return ""
  if (typeof printer === "string") return printer
  if (typeof printer.name === "object" && typeof printer.name.name === "string")
    return printer.name.name
  if (typeof printer.name === "string") return printer.name
  return ""
}

// Helper to find ingredients for a menu item
function findMenuItemIngredients(itemId: string, allMenuItems: any[]): any[] {
  const menuItem = allMenuItems.find((item) => item.menuItemID === itemId || item.id === itemId)
  return menuItem?.ingredients || []
}

export default function PrintSessionsPage() {
  const [printLogs, setPrintLogs] = useState<PrintLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<PrintLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [printingStates, setPrintingStates] = useState<{ [key: string]: boolean }>({})
  const [selectedPrinterName, setSelectedPrinterName] = useState<string>("")
  const [osType, setOsType] = useState<"mac" | "windows" | "other">("other")

  // Data for ingredients and menu items
  const [allIngredients, setAllIngredients] = useState<any[]>([])
  const [allMenuItems, setAllMenuItems] = useState<any[]>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [itemsPerPage] = useState(20)

  // Filter state
  const [dateFrom, setDateFrom] = useState("")
  const [actionFilter, setActionFilter] = useState("print_label")

  // Printer context
  const {
    isConnected,
    printers: availablePrinters,
    defaultPrinter,
    selectedPrinter,
    selectPrinter,
    loading: printerLoading,
    print,
  } = usePrinter()

  // Subscription status
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userid") || "test-user" : "test-user"
  const { subscription, loading: subLoading } = useBillingData(userId)
  const subBlocked =
    !subscription || (subscription.status !== "active" && subscription.status !== "trialing")

  useEffect(() => {
    const id = localStorage.getItem("userid")
    if (!id) return
  }, [])

  // Fetch ingredients and menu items data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const [ingredientsData, menuItemsData] = await Promise.all([
          getAllIngredients(token),
          getAllMenuItems(token),
        ])

        setAllIngredients(
          Array.isArray(ingredientsData) ? ingredientsData : ingredientsData?.data || []
        )

        // Flatten menu items from categories
        const menuItems = []
        const categories = Array.isArray(menuItemsData) ? menuItemsData : menuItemsData?.data || []
        for (const category of categories) {
          for (const item of category.items || []) {
            menuItems.push({
              ...item,
              categoryName: category.categoryName,
            })
          }
        }
        setAllMenuItems(menuItems)
      } catch (error) {
        console.error("Error fetching ingredients and menu items:", error)
      }
    }

    fetchData()
  }, [])

  const fetchPrintSessions = async (page: number = 1, reset: boolean = true) => {
    if (reset) {
      setLoading(true)
      setError(null)
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        action: actionFilter,
      })

      if (dateFrom) {
        params.append("dateFrom", dateFrom)
      }

      const res = await fetch(`/api/logs?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to fetch print sessions")
      }

      const data = await res.json()
      const printLogs: PrintLog[] = data.logs || []

      if (reset) {
        setPrintLogs(printLogs)
      } else {
        setPrintLogs((prev) => [...prev, ...printLogs])
      }

      // Update pagination state
      setCurrentPage(data.pagination.currentPage)
      setTotalPages(data.pagination.totalPages)
      setTotalCount(data.pagination.totalCount)
      setHasMore(data.pagination.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrintSessions(1, true)
  }, [dateFrom, actionFilter])

  // Filter logs by search term
  useEffect(() => {
    const filtered = printLogs.filter((log) => {
      return log.details.itemName.toLowerCase().includes(search.toLowerCase())
    })
    setFilteredLogs(filtered)
  }, [search, printLogs])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const platform = window.navigator.platform.toLowerCase()
      if (platform.includes("mac")) setOsType("mac")
      else if (platform.includes("win")) setOsType("windows")
      else setOsType("other")
    }
  }, [])
  useEffect(() => {
    console.log("[Print Sessions] Detected OS:", osType)
  }, [osType])

  function formatTimestamp(ts: string) {
    // Use ISO string for SSR safety
    return new Date(ts).toISOString().replace("T", " ").slice(0, 19)
  }

  function formatPrintedAt(ts: string) {
    // Use ISO string for SSR safety
    return new Date(ts).toISOString().replace("T", " ").slice(0, 19)
  }

  function getItemNames(session: GroupedPrintSession): string {
    return session.items.map((item) => item.details.itemName).join(", ")
  }

  function getTotalQuantity(session: GroupedPrintSession): number {
    return session.items.reduce((total, item) => total + item.details.quantity, 0)
  }

  function getLabelTypes(session: GroupedPrintSession): string {
    const types = [...new Set(session.items.map((item) => item.details.labelType))]
    return types
      .map((type) => {
        if (type === "ppd") return "PPDS 40mm"
        if (type === "ppds") return "PPDS 80mm"
        return type.toUpperCase()
      })
      .join(", ")
  }

  async function handlePrintLog(log: PrintLog) {
    const logId = log.id.toString()

    if (printingStates[logId]) {
      console.log("Already printing this log")
      return
    }

    setPrintingStates((prev) => ({ ...prev, [logId]: true }))

    try {
      console.log("🖨️ Starting re-print for log:", log.id, log.details.itemName)
      console.log("🖨️ Printer connection status:", isConnected)
      console.log("🖨️ Available printers:", availablePrinters.length)
      console.log("🖨️ Selected printer:", selectedPrinterName)

      // Find printer by name
      const selectedPrinterObj =
        availablePrinters.find((p) => getPrinterName(p) === selectedPrinterName) ||
        availablePrinters[0]
      const printerSelection = getBestAvailablePrinter(
        selectedPrinterObj,
        defaultPrinter,
        availablePrinters
      )

      if (!isConnected) {
        console.warn("⚠️ Printer not connected, but allowing print for debug purposes")
        // Don't return, continue with printing for debug
      }

      if (!printerSelection.printer) {
        console.warn("⚠️ No printer available, but allowing print for debug purposes")
        // Don't return, continue with printing for debug
      }

      let successCount = 0
      let failCount = 0
      const failItems: string[] = []

      // Find ingredients for this menu item
      const itemIngredients = findMenuItemIngredients(log.details.itemId, allMenuItems)

      // Create a PrintQueueItem from the log data
      const printItem: PrintQueueItem = {
        uid: log.details.itemId,
        id: log.details.itemId,
        type: "menu", // Default to menu since we don't have this info in logs
        name: log.details.itemName,
        quantity: log.details.quantity,
        printedOn: new Date().toISOString().split("T")[0], // Today's date
        expiryDate: calculateExpiryDate(log.details.labelType), // Proper expiry calculation
        labelType: log.details.labelType,
        ingredients: itemIngredients.map((ing: any) => ing.ingredientName || ing.name || "Unknown"),
        allergens: [], // We don't have allergens in logs
      }

      // Use the label height from the log or default to 40mm
      const labelHeight = log.details.labelHeight || "40mm"

      // Print multiple copies based on quantity
      for (let i = 0; i < log.details.quantity; i++) {
        try {
          // Generate the label image based on label type
          let imageDataUrl: string

          if (log.details.labelType === "ppds") {
            // PPDS (PPDS 80mm) - use same approach as PPDS page
            console.log("🖨️ Using PPDS page approach for 80mm labels in handlePrintLog")

            // Create container for 80mm PPDS label (same as PPDS page)
            const container = document.createElement("div")
            container.style.position = "absolute"
            container.style.top = "0"
            container.style.left = "0"
            container.style.width = "56mm"
            container.style.height = "80mm"
            container.style.backgroundColor = "white"
            container.style.zIndex = "-1"
            container.style.visibility = "hidden"
            document.body.appendChild(container)

            // Render PPDSLabelRenderer into container (same as PPDS page)
            const root = ReactDOM.createRoot(container)
            root.render(
              <PPDSLabelRenderer
                item={printItem}
                storageInfo="Keep refrigerated"
                businessName="InstaLabel"
                allIngredients={allIngredients}
              />
            )

            // Wait for React to render and generate image (same as PPDS page)
            await new Promise((resolve) => setTimeout(resolve, 300))
            container.style.visibility = "visible"

            imageDataUrl = await toPng(container, {
              cacheBust: true,
              width: container.offsetWidth,
              height: container.offsetHeight,
              style: {
                transform: "scale(1)",
                transformOrigin: "top left",
              },
            })

            root.unmount()
            document.body.removeChild(container)
          } else {
            // Other label types - use default function
            imageDataUrl = await formatLabelForPrintImage(
              printItem,
              [], // allergenNames - empty since we don't have this in logs
              {}, // customExpiry
              5, // maxIngredients
              false, // useInitials
              log.details.initial || "", // selectedInitial
              labelHeight,
              allIngredients.map((ing) => ({
                uuid: String(ing.id || ing.ingredientID),
                ingredientName: ing.ingredientName || ing.name,
                allergens: ing.allergens || [],
              }))
            )
          }

          console.log(
            `🖨️ Image generated for ${log.details.itemName} copy ${i + 1}/${log.details.quantity}, length: ${imageDataUrl?.length || 0}`
          )
          console.log("🖨️ PrintItem ingredients in handlePrintLog:", printItem.ingredients)
          console.log("🖨️ AllIngredients count in handlePrintLog:", allIngredients.length)

          if (!imageDataUrl) {
            failCount++
            failItems.push(log.details.itemName)
            console.error(
              `❌ Print error for item ${log.details.itemName}: imageDataUrl is undefined`
            )
            continue
          }

          // Print using WebSocket (if connected) or just log for debug
          if (isConnected) {
            // Use correct label height for PPDS labels
            const printLabelHeight = log.details.labelType === "ppds" ? "80mm" : labelHeight
            await print(imageDataUrl, undefined, { labelHeight: printLabelHeight })
            console.log(
              `✅ Printed ${log.details.itemName} copy ${i + 1}/${log.details.quantity} successfully`
            )
          } else {
            console.log("🖨️ DEBUG: Would print image data:", imageDataUrl.substring(0, 100) + "...")
          }

          successCount++
        } catch (itemErr) {
          failCount++
          failItems.push(log.details.itemName)
          console.error("❌ Print error for item", log.details.itemName, itemErr)
        }
      }

      console.log(`🖨️ Re-print completed: ${successCount} successful, ${failCount} failed`)

      if (failCount > 0) {
        console.warn("⚠️ Some items failed to print:", failItems)
        alert(
          `Print completed with errors: ${successCount} successful, ${failCount} failed. Failed items: ${failItems.join(", ")}`
        )
      } else if (successCount > 0) {
        alert(`Successfully printed ${successCount} label(s)`)
      }
    } catch (error) {
      console.error("❌ Error during re-print:", error)
      alert(`Print failed: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setPrintingStates((prev) => ({ ...prev, [logId]: false }))
    }
  }

  async function handlePrintSession(session: GroupedPrintSession) {
    const sessionId = session.sessionId
    setPrintingStates((prev) => ({ ...prev, [sessionId]: true }))

    try {
      console.log("🖨️ Starting print session:", sessionId, "Items:", session.items.length)
      console.log("🖨️ Printer connection status:", isConnected)
      console.log("🖨️ Available printers:", availablePrinters.length)
      console.log("🖨️ Selected printer:", selectedPrinterName)
      console.log("🖨️ Printer loading:", printerLoading)

      if (printerLoading) {
        throw new Error("Checking printer status, please wait...")
      }

      if (!isConnected) {
        console.warn("⚠️ Printer not connected, but allowing print for debug purposes")
      }

      // Use selected printer from dropdown
      const printerToUse =
        availablePrinters.find(
          (p: any) => p.name === selectedPrinterName || p.systemName === selectedPrinterName
        ) ||
        selectedPrinter ||
        defaultPrinter

      console.log("🖨️ Printer selection debug:", {
        selectedPrinterName,
        printerToUse: printerToUse?.name,
        selectedPrinter: selectedPrinter?.name,
        defaultPrinter: defaultPrinter?.name,
        availablePrinters: availablePrinters.map((p) => p.name),
      })

      if (printerToUse) selectPrinter(printerToUse)

      // Get the best available printer using our helper function
      const printerSelection = getBestAvailablePrinter(
        printerToUse,
        defaultPrinter,
        availablePrinters
      )

      console.log("🖨️ Final printer selection:", {
        printer: printerSelection.printer?.name,
        reason: printerSelection.reason,
      })

      if (!printerSelection.printer) {
        console.warn("⚠️ No printer available, but allowing print for debug purposes")
      }

      // Get allergens from localStorage or use empty array
      const allergens = JSON.parse(localStorage.getItem("allergens") || "[]")
      const allergenNames = allergens.map((a: any) => a.allergenName?.toLowerCase() || "")

      // Fetch label settings for proper expiry calculation
      const token = localStorage.getItem("token")
      let labelSettings: any[] = []
      if (token) {
        try {
          const settingsRes = await fetch("/api/label-settings", {
            headers: { Authorization: `Bearer ${token}` },
          })
          const settingsData = await settingsRes.json()
          labelSettings = settingsData.settings || []
        } catch (error) {
          console.warn("Failed to fetch label settings, using defaults")
        }
      }

      // Helper function to calculate expiry date based on label type
      const calculateExpiryDate = (labelType: string): string => {
        const today = new Date()

        if (labelType === "defrost") {
          // Defrost labels expire in 24 hours (1 day)
          today.setDate(today.getDate() + 1)
          return today.toISOString().split("T")[0]
        }

        // Get expiry days from settings or use defaults
        const setting = labelSettings.find((s: any) => s.label_type === labelType)
        const expiryDays = setting
          ? parseInt(setting.expiry_days)
          : labelType === "cooked"
            ? 1
            : labelType === "prep"
              ? 3
              : labelType === "default"
                ? 2
                : labelType === "ppds"
                  ? 5
                  : 3

        today.setDate(today.getDate() + expiryDays)
        return today.toISOString().split("T")[0]
      }

      let successCount = 0
      let failCount = 0
      const failItems: string[] = []

      // Print each item in the session
      for (const log of session.items) {
        try {
          // Find ingredients for this menu item
          const itemIngredients = findMenuItemIngredients(log.details.itemId, allMenuItems)

          // Create a PrintQueueItem from the log data
          const printItem: PrintQueueItem = {
            uid: log.details.itemId,
            id: log.details.itemId,
            type: "menu", // Default to menu since we don't have this info in logs
            name: log.details.itemName,
            quantity: log.details.quantity,
            printedOn: new Date().toISOString().split("T")[0], // Today's date
            expiryDate: calculateExpiryDate(log.details.labelType), // Proper expiry calculation
            labelType: log.details.labelType,
            ingredients: itemIngredients.map(
              (ing: any) => ing.ingredientName || ing.name || "Unknown"
            ), // Array of strings
            allergens: [], // We don't have allergens in logs
          }

          // Determine label height and print function based on label type
          let labelHeight = log.details.labelHeight || "40mm"
          let imageDataUrl: string

          console.log(
            `🖨️ Generating image for ${log.details.itemName}, labelType: ${log.details.labelType}, labelHeight: ${labelHeight}`
          )
          console.log("🖨️ PrintItem ingredients:", printItem.ingredients)
          console.log("🖨️ AllIngredients count:", allIngredients.length)

          if (log.details.labelType === "ppd") {
            // PPD (PPDS 40mm) - use label print page function
            labelHeight = "40mm"
            console.log("🖨️ Using formatLabelForPrintImage for PPD")
            imageDataUrl = await formatLabelForPrintImage(
              printItem,
              allergenNames,
              {}, // customExpiry
              5, // maxIngredients
              false, // useInitials
              log.details.initial || "", // selectedInitial
              labelHeight
            )
          } else if (log.details.labelType === "ppds") {
            // PPDS (PPDS 80mm) - use same approach as PPDS page
            labelHeight = "80mm"
            console.log("🖨️ Using PPDS page approach for 80mm labels")

            // Create container for 80mm PPDS label (same as PPDS page)
            const container = document.createElement("div")
            container.style.position = "absolute"
            container.style.top = "0"
            container.style.left = "0"
            container.style.width = "56mm"
            container.style.height = "80mm"
            container.style.backgroundColor = "white"
            container.style.zIndex = "-1"
            container.style.visibility = "hidden"
            document.body.appendChild(container)

            // Render PPDSLabelRenderer into container (same as PPDS page)
            const root = ReactDOM.createRoot(container)
            root.render(
              <PPDSLabelRenderer
                item={printItem}
                storageInfo="Keep refrigerated"
                businessName="InstaLabel"
                allIngredients={allIngredients}
              />
            )

            // Wait for React to render and generate image (same as PPDS page)
            await new Promise((resolve) => setTimeout(resolve, 300))
            container.style.visibility = "visible"

            imageDataUrl = await toPng(container, {
              cacheBust: true,
              width: container.offsetWidth,
              height: container.offsetHeight,
              style: {
                transform: "scale(1)",
                transformOrigin: "top left",
              },
            })

            root.unmount()
            document.body.removeChild(container)
          } else {
            // Other label types - use default function
            console.log("🖨️ Using formatLabelForPrintImage for other label types")
            imageDataUrl = await formatLabelForPrintImage(
              printItem,
              allergenNames,
              {}, // customExpiry
              5, // maxIngredients
              false, // useInitials
              log.details.initial || "", // selectedInitial
              labelHeight,
              allIngredients.map((ing) => ({
                uuid: String(ing.id || ing.ingredientID),
                ingredientName: ing.ingredientName || ing.name,
                allergens: ing.allergens || [],
              }))
            )
          }

          console.log(
            `🖨️ Image generated for ${log.details.itemName}, length: ${imageDataUrl?.length || 0}`
          )

          if (!imageDataUrl) {
            failCount++
            failItems.push(log.details.itemName)
            console.error(
              `❌ Print error for item ${log.details.itemName}: imageDataUrl is undefined`
            )
            continue
          }

          // Print using WebSocket (if connected) or just log for debug
          if (isConnected) {
            // Use correct label height for PPDS labels
            const printLabelHeight = log.details.labelType === "ppds" ? "80mm" : labelHeight
            await print(imageDataUrl, undefined, { labelHeight: printLabelHeight })
            console.log(`✅ Printed ${log.details.itemName} successfully`)
          } else {
            console.log("🖨️ DEBUG: Would print image data:", imageDataUrl.substring(0, 100) + "...")
          }

          successCount++
        } catch (error) {
          failCount++
          failItems.push(log.details.itemName)
          console.error(`❌ Print error for item ${log.details.itemName}:`, error)
        }
      }

      if (failCount === 0) {
        const message = isConnected
          ? `Successfully reprinted ${successCount} labels using ${printerSelection.printer?.name}`
          : `DEBUG: Would reprint ${successCount} labels (printer not connected)`
        alert(message)
      } else {
        alert(`Reprinted ${successCount} labels, failed ${failCount}: ${failItems.join(", ")}`)
      }
    } catch (error) {
      console.error("Failed to print session:", error)
      alert(`Print failed: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setPrintingStates((prev) => ({ ...prev, [sessionId]: false }))
    }
  }

  function exportToXLSX() {
    const dataForExport = filteredLogs.map((log) => ({
      "Log ID": log.id,
      "Item Name": log.details.itemName,
      Quantity: log.details.quantity,
      "Label Type":
        log.details.labelType === "ppd"
          ? "PPDS 40mm"
          : log.details.labelType === "ppds"
            ? "PPDS 80mm"
            : log.details.labelType.toUpperCase(),
      "Printed At": formatPrintedAt(log.details.printedAt),
      "Logged At": formatTimestamp(log.timestamp),
      "Printer Used":
        typeof log.details.printerUsed === "string"
          ? log.details.printerUsed
          : log.details.printerUsed?.name || "Unknown",
      Initial: log.details.initial || "None",
      "Session ID": log.details.sessionId || "N/A",
      "Bulk Print List": log.details.bulkPrintListName || "Regular Print",
    }))

    const worksheet = XLSX.utils.json_to_sheet(dataForExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Print Logs")
    XLSX.writeFile(workbook, "print_logs.xlsx")
  }

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    fetchPrintSessions(newPage, true)
  }

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchPrintSessions(currentPage + 1, false)
    }
  }

  // Filter handlers
  const handleDateFilterChange = (newDate: string) => {
    setDateFrom(newDate)
    setCurrentPage(1)
  }

  const handleActionFilterChange = (newAction: string) => {
    setActionFilter(newAction)
    setCurrentPage(1)
  }

  // Show skeleton if loading and no data loaded yet
  if (loading && printLogs.length === 0) {
    return <PrintSessionsSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Print Logs</h2>
        <Button variant="outline" className="mr-5" onClick={exportToXLSX}>
          <FileDown className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>
      {/* Printer Chooser */}
      <div className="mb-4">
        <label className="mb-2 block font-medium">Select Printer:</label>
        <select
          className="w-full rounded border px-2 py-1"
          value={selectedPrinterName}
          onChange={(e) => {
            setSelectedPrinterName(e.target.value)
            const printer = availablePrinters.find((p) => getPrinterName(p) === e.target.value)
            if (printer) selectPrinter(printer)
          }}
        >
          <option value="">Select a printer</option>
          {availablePrinters.map((printer) => {
            const printerName = getPrinterName(printer)
            return (
              <option key={printerName} value={printerName}>
                {printerName}
              </option>
            )
          })}
        </select>
        {availablePrinters.length === 0 && (
          <div className="mt-2 text-xs text-red-600">No printers detected</div>
        )}
        {availablePrinters.length > 0 &&
          !availablePrinters.find((p) => getPrinterName(p) === selectedPrinterName) && (
            <div className="mt-2 text-xs text-red-600">
              Selected printer is not available. Please select another.
            </div>
          )}
        {!isConnected && <div className="mt-2 text-xs text-red-600">Printer not connected</div>}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="my-6 rounded-xl border bg-card p-6 shadow">
          <p className="text-muted-foreground">Total Print Logs</p>
          <h3 className="text-2xl font-bold">{totalCount}</h3>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-4 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="dateFrom">Date From</Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => handleDateFilterChange(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="actionFilter">Action Type</Label>
          <select
            id="actionFilter"
            value={actionFilter}
            onChange={(e) => handleActionFilterChange(e.target.value)}
            className="h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="print_label">Print Label</option>
            <option value="all">All Actions</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Clear Filters</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDateFrom("")
              setActionFilter("print_label")
              setCurrentPage(1)
            }}
            className="h-10"
          >
            Clear
          </Button>
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
        {loading && printLogs.length > 0 && (
          <div className="p-6 text-center">Loading print sessions...</div>
        )}
        {error && <p className="p-6 text-red-600">Error: {error}</p>}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Item Name</TableHead>
                <TableHead className="whitespace-nowrap">Quantity</TableHead>
                <TableHead className="whitespace-nowrap">Label Type</TableHead>
                <TableHead className="whitespace-nowrap">Printed At</TableHead>
                <TableHead className="whitespace-nowrap">Logged At</TableHead>
                <TableHead className="whitespace-nowrap">Printer</TableHead>
                <TableHead className="whitespace-nowrap">Initial</TableHead>
                <TableHead className="whitespace-nowrap">Session ID</TableHead>
                <TableHead className="whitespace-nowrap">Bulk Print</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {printLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="max-w-xs font-medium">
                    <div className="truncate" title={log.details.itemName}>
                      {log.details.itemName}
                    </div>
                  </TableCell>
                  <TableCell>{log.details.quantity}</TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        log.details.labelType === "cooked"
                          ? "bg-red-100 text-red-800"
                          : log.details.labelType === "prep"
                            ? "bg-purple-100 text-blue-800"
                            : log.details.labelType === "default"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-green-100 text-green-800"
                      }`}
                    >
                      {log.details.labelType === "ppd"
                        ? "PPDS 40mm"
                        : log.details.labelType === "ppds"
                          ? "PPDS 80mm"
                          : log.details.labelType.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>{formatPrintedAt(log.details.printedAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTimestamp(log.timestamp)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {typeof log.details.printerUsed === "string"
                      ? log.details.printerUsed
                      : log.details.printerUsed && typeof log.details.printerUsed.name === "string"
                        ? log.details.printerUsed.name
                        : "Unknown"}
                  </TableCell>
                  <TableCell>
                    {log.details.initial ? (
                      <span className="rounded border px-2 py-1 font-mono text-xs">
                        {log.details.initial}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {log.details.sessionId ? log.details.sessionId.slice(-8) : "N/A"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.details.bulkPrintListName ? (
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                        {log.details.bulkPrintListName}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Regular</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handlePrintLog(log)}
                      disabled={
                        printingStates[log.id] ||
                        subBlocked ||
                        availablePrinters.length === 0 ||
                        !availablePrinters.find((p) => getPrinterName(p) === selectedPrinterName)
                      }
                      className="h-8 px-3"
                      title={
                        subBlocked
                          ? "Printing is disabled due to your subscription status."
                          : availablePrinters.length === 0
                            ? "No printers available"
                            : !availablePrinters.find(
                                  (p) => getPrinterName(p) === selectedPrinterName
                                )
                              ? "No valid printer selected"
                              : printingStates[log.id]
                                ? "Printing in progress"
                                : "Print this label"
                      }
                    >
                      {printingStates[log.id] ? (
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Printing...
                        </div>
                      ) : (
                        <>
                          <Printer className="mr-1 h-3 w-3" />
                          Print
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="mt-4 flex flex-col gap-4">
          {/* Pagination Info */}
          <div className="text-center text-sm text-muted-foreground">
            Showing {printLogs.length} of {totalCount} logs (Page {currentPage} of {totalPages})
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </Button>

            {/* First page */}
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(1)}
              className="min-w-[36px] px-2 py-1"
              disabled={loading}
            >
              1
            </Button>

            {/* Ellipsis before current range */}
            {currentPage > 3 && totalPages > 5 && (
              <span className="px-2 py-1 text-muted-foreground">...</span>
            )}

            {/* Pages around current */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p !== 1 && p !== totalPages && Math.abs(p - currentPage) <= 1 // show current, previous, next
              )
              .map((p) => (
                <Button
                  key={p}
                  variant={currentPage === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(p)}
                  className="min-w-[36px] px-2 py-1"
                  disabled={loading}
                >
                  {p}
                </Button>
              ))}

            {/* Ellipsis after current range */}
            {currentPage < totalPages - 2 && totalPages > 5 && (
              <span className="px-2 py-1 text-muted-foreground">...</span>
            )}

            {/* Last page */}
            {totalPages > 1 && (
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                className="min-w-[36px] px-2 py-1"
                disabled={loading}
              >
                {totalPages}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </Button>
          </div>

          {/* Load More Button (Alternative to pagination) */}
          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6"
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
