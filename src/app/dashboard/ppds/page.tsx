"use client"

import React, { useEffect, useState, useMemo, useRef } from "react"
import { getAllMenuItems, getAllIngredients } from "@/lib/api"
import { usePrinter } from "@/context/PrinterContext"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { toPng } from "html-to-image"
import { PPDSLabelRenderer } from "./PPDSLabelRenderer"
import { logAction } from "@/lib/logAction"
import ReactDOM from "react-dom/client"

function getPrinterName(printer: any): string {
  if (!printer) return ""
  if (typeof printer === "string") return printer
  if (typeof printer.name === "object" && typeof printer.name.name === "string")
    return printer.name.name
  if (typeof printer.name === "string") return printer.name
  return ""
}
function getBestAvailablePrinter(
  selectedPrinter: any,
  defaultPrinter: any,
  availablePrinters: any[]
) {
  const validPrinters = (availablePrinters || []).filter((printer) => {
    const name = getPrinterName(printer)
    return (
      name &&
      name.trim() !== "" &&
      name !== "Fallback_Printer" &&
      !name.toLowerCase().includes("fallback")
    )
  })
  if (
    selectedPrinter &&
    selectedPrinter.name !== "Fallback_Printer" &&
    validPrinters.some((p) => p.name === selectedPrinter.name)
  ) {
    return { printer: selectedPrinter, reason: "Selected printer available" }
  }
  if (
    defaultPrinter &&
    defaultPrinter.name !== "Fallback_Printer" &&
    validPrinters.some((p) => p.name === defaultPrinter.name)
  ) {
    return { printer: defaultPrinter, reason: "Default printer available" }
  }
  if (validPrinters.length > 0) {
    return { printer: validPrinters[0], reason: "First available printer" }
  }
  return { printer: null, reason: "No valid printers available" }
}

export default function PPDSPage() {
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [printQueue, setPrintQueue] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expiryDays, setExpiryDays] = useState<number>(2)
  const [storageInfo, setStorageInfo] = useState("")
  const [allIngredients, setAllIngredients] = useState<any[]>([])
  const itemsPerPage = 8
  const { printers, selectedPrinter, selectPrinter, print, isConnected } = usePrinter()
  const { profile } = useAuth()
  const businessName = profile?.company_name || "InstaLabel Ltd"
  // Replace selectedPrinterSystemName with selectedPrinterName
  const [selectedPrinterName, setSelectedPrinterName] = useState<string>("")
  const [osType, setOsType] = useState<"mac" | "windows" | "other">("other")

  // Print logic (now real PNG generation and print)
  async function handlePrint() {
    if (printQueue.length === 0) {
      alert("No items in print queue")
      return
    }
    if (!isConnected) {
      alert("Printer not connected")
      return
    }
    // Find printer by name
    const selectedPrinterObj =
      printers.find((p) => getPrinterName(p) === selectedPrinterName) || printers[0]
    const printerSelection = getBestAvailablePrinter(selectedPrinterObj, printers[0], printers)
    if (!printerSelection.printer) {
      alert("No valid printer available")
      return
    }

    console.log("🖨️ Starting PPDS print process for", printQueue.length, "items")
    const sessionId = `ppds-session-${Date.now()}-${Math.random().toString(36).slice(2)}`
    let successCount = 0
    let failCount = 0
    const failItems: string[] = []

    try {
      for (const item of printQueue) {
        try {
          console.log(`🖨️ Processing PPDS item: ${item.name} (quantity: ${item.quantity})`)

          // Print multiple copies of the same label
          for (let i = 0; i < item.quantity; i++) {
            // Render label to PNG using html-to-image
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

            // Render PPDSLabelRenderer into container
            const root = ReactDOM.createRoot(container)
            root.render(
              <PPDSLabelRenderer
                item={{ ...item }}
                storageInfo={storageInfo}
                businessName={businessName}
                allIngredients={allIngredients}
              />
            )

            // Wait for React to render
            await new Promise((resolve) => setTimeout(resolve, 300))
            container.style.visibility = "visible"

            const imageDataUrl = await toPng(container, {
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

            console.log(
              `🖨️ PPDS image generated for ${item.name} copy ${i + 1}/${item.quantity}, length: ${imageDataUrl.length}`
            )

            // Print using WebSocket (if connected) or just log for debug
            if (isConnected) {
              await print(imageDataUrl, undefined, { labelHeight: "80mm" })
              console.log(
                `✅ Printed PPDS ${item.name} copy ${i + 1}/${item.quantity} successfully`
              )
            } else {
              console.log(
                "🖨️ DEBUG: Would print PPDS image data:",
                imageDataUrl.substring(0, 100) + "..."
              )
            }
          }

          // Log the print action ONCE per item with correct quantity
          await logAction("print_label", {
            labelType: "ppds",
            itemId: item.uid || item.id,
            itemName: item.name,
            quantity: item.quantity || 1,
            printedAt: new Date().toISOString(),
            expiryDate: item.expiryDate || calculateExpiryDate(expiryDays),
            initial: "", // No initials in PPDS
            labelHeight: "80mm",
            printerUsed: printerSelection.printer || "Debug Mode",
            sessionId,
          })

          successCount++
        } catch (err) {
          failCount++
          failItems.push(item.name)
          console.error("❌ PPDS print error for item", item.name, err)
        }
      }

      console.log(`🖨️ PPDS print completed: ${successCount} successful, ${failCount} failed`)

      if (failCount > 0) {
        console.warn("⚠️ Some PPDS items failed to print:", failItems)
        alert(
          `PPDS print completed with errors: ${successCount} successful, ${failCount} failed. Failed items: ${failItems.join(", ")}`
        )
      } else if (successCount > 0) {
        alert(`Successfully printed ${successCount} PPDS label(s)`)
      }

      // Clear print queue after completion
      setPrintQueue([])
    } catch (error) {
      console.error("❌ Error during PPDS print:", error)
      alert(`PPDS print failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // Fetch menu items
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    setIsLoading(true)
    getAllMenuItems(token)
      .then((res) => {
        const categories = res?.data || []
        const formatted: any[] = []
        let i = 0
        for (const category of categories) {
          for (const item of category.items || []) {
            const id = item.menuItemID ?? `menu-${i}-${Date.now()}`
            const name = item.menuItemName || `Menu Item ${i + 1}`
            if (name && name.trim()) {
              formatted.push({
                id,
                name,
                printedOn: new Date().toISOString().split("T")[0],
                expiryDate: calculateExpiryDate(expiryDays),
                ingredients:
                  item.ingredients?.map((ing: any) => ing.ingredientName || "Unknown") || [], // keep as names
              })
            }
            i++
          }
        }
        setMenuItems(formatted)
      })
      .catch((err) => setError(`Menu fetch error: ${err.message}`))
      .finally(() => setIsLoading(false))
  }, [expiryDays])

  // Fetch all ingredients (with allergens)
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    getAllIngredients(token).then((data) => {
      const items = (Array.isArray(data) ? data : data.data) || []
      setAllIngredients(items)
    })
  }, [])

  // Fetch expiry days for PPDS
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    fetch("/api/label-settings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const found = (data.settings || []).find((s: any) => s.label_type === "ppds")
        setExpiryDays(found ? parseInt(found.expiry_days) : 2)
      })
      .catch(() => setExpiryDays(2))
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const platform = window.navigator.platform.toLowerCase()
      if (platform.includes("mac")) setOsType("mac")
      else if (platform.includes("win")) setOsType("windows")
      else setOsType("other")
    }
  }, [])
  useEffect(() => {
    console.log("[PPDS Print] Detected OS:", osType)
  }, [osType])

  function calculateExpiryDate(days: number) {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().split("T")[0]
  }

  // Pagination and search
  const filteredMenuItems = useMemo(
    () =>
      !searchTerm
        ? menuItems
        : menuItems.filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [menuItems, searchTerm]
  )
  const paginatedMenuItems = useMemo(
    () => filteredMenuItems.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filteredMenuItems, page]
  )
  const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage)

  // Print queue logic
  function addToPrintQueue(item: any) {
    if (printQueue.some((q) => q.id === item.id)) return
    setPrintQueue((prev) => [
      ...prev,
      {
        ...item,
        uid: `menu-${item.id}-${Date.now()}`,
        quantity: 1,
        // Only include serializable fields
        // Do NOT include any printer/device object
      },
    ])
  }
  function updateQuantity(uid: string, quantity: number) {
    setPrintQueue((prev) =>
      prev.map((q) => (q.uid === uid ? { ...q, quantity: Math.max(1, quantity) } : q))
    )
  }
  function removeFromQueue(uid: string) {
    setPrintQueue((prev) => prev.filter((q) => q.uid !== uid))
  }
  function clearPrintQueue() {
    setPrintQueue([])
  }

  return (
    <div className="min-h-screen space-y-10 bg-gray-50 px-2 py-8 md:px-8">
      <h1 className="mb-4 text-2xl font-bold">PPDS Labels</h1>
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Left Section: Printer Chooser & Menu Items List */}
        <div className="min-w-[340px] flex-1">
          {/* Printer Chooser at the top */}
          <div className="mb-6 rounded-xl border bg-white p-4 shadow-lg">
            {isConnected ? (
              <>
                <div className="mb-4 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-4 shadow-sm">
                  <div className="mb-2 font-semibold text-purple-900">Available Printers</div>
                  {printers.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      <select
                        value={selectedPrinterName}
                        onChange={(e) => {
                          setSelectedPrinterName(e.target.value)
                          const printer = printers.find(
                            (p: any) => getPrinterName(p) === e.target.value
                          )
                          selectPrinter(printer || null)
                        }}
                        className="rounded border border-purple-300 bg-white px-2 py-1 text-sm text-black"
                      >
                        <option value="">Select Printer</option>
                        {printers.map((printer: any) => {
                          const printerName = getPrinterName(printer)
                          return (
                            <option key={printerName} value={printerName}>
                              {printerName} {printer.isDefault ? "(Default)" : ""}
                            </option>
                          )
                        })}
                      </select>
                      <div className="mt-1 text-xs text-gray-700">
                        {printers.length} printer(s) detected
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">No printers detected</div>
                  )}
                </div>
              </>
            ) : (
              <div className="mb-4 rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white p-4 text-red-700 shadow-sm">
                No printers detected
              </div>
            )}
          </div>
          {/* Menu Items List */}
          <div className="mb-8 rounded-xl border bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Menu Items</h2>
            </div>
            <div className="mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search menu items..."
                className="w-full rounded-lg border-2 border-purple-200 px-5 py-3 text-base transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            <div className="mb-8">
              {paginatedMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="mb-3 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 transition hover:shadow-md"
                >
                  <div className="min-w-0 flex-1">
                    <p className="whitespace-normal break-words font-semibold text-gray-900">
                      {item.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => addToPrintQueue(item)}
                      disabled={printQueue.some((q) => q.id === item.id)}
                      variant="purple"
                    >
                      {printQueue.some((q) => q.id === item.id) ? "Added" : "Add"}
                    </Button>
                  </div>
                </div>
              ))}
              {/* Pagination */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="min-w-[80px] text-center text-sm text-gray-700">
                  {page} of {totalPages}
                </span>
                <Button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Right Section: Print Queue */}
        <div className="min-w-[340px] flex-1">
          <div className="mb-8 rounded-xl border bg-white p-6 shadow-lg">
            {/* Storage Info Input at the top */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">Storage Instruction (short):</label>
              <input
                type="text"
                value={storageInfo}
                onChange={(e) => setStorageInfo(e.target.value)}
                maxLength={60}
                placeholder="e.g. Keep refrigerated below 5°C"
                className="w-full rounded border px-2 py-1 text-sm"
              />
            </div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-purple-800">Print Queue</h2>
              <div className="flex gap-2">
                <Button
                  onClick={handlePrint}
                  disabled={
                    printQueue.length === 0 ||
                    printers.length === 0 ||
                    !printers.find((p) => getPrinterName(p) === selectedPrinterName)
                  }
                  variant="purple"
                >
                  Print Labels
                </Button>
                <Button
                  onClick={clearPrintQueue}
                  disabled={printQueue.length === 0}
                  variant="outline"
                  aria-label="Clear print queue"
                >
                  Clear Queue
                </Button>
              </div>
            </div>
            <div className="mb-8 max-h-[700px] w-full overflow-y-auto rounded-2xl border-2 border-purple-300 bg-white shadow-xl">
              <div className="px-8 pb-8 pt-4">
                {printQueue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <svg
                      className="mb-4 h-12 w-12 text-purple-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01"
                      />
                    </svg>
                    <p className="text-lg italic text-gray-400">
                      Your print queue is empty.
                      <br />
                      Add items to get started!
                    </p>
                  </div>
                ) : (
                  printQueue
                    .filter((item) => item.name && item.name.trim() !== "")
                    .map((item) => (
                      <div
                        key={item.uid}
                        className="mb-4 flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 transition-shadow hover:shadow-lg"
                      >
                        <div className="whitespace-normal break-words font-semibold text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">Expires: {item.expiryDate}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.uid, Number(e.target.value))}
                            className="w-16 rounded-md border border-gray-300 bg-white px-3 py-1 text-center text-sm text-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          />
                          <Button
                            onClick={() => removeFromQueue(item.uid)}
                            variant="outline"
                            className="border-none bg-red-600 text-white shadow-none hover:bg-red-700 focus:bg-red-700"
                            aria-label={`Remove ${item.name} from queue`}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Label Preview as a wide section below both columns */}
      <div className="mt-8 w-full rounded-xl border bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold">Label Preview</h2>
        {printQueue.length === 0 ? (
          <p className="text-gray-500">No label selected.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {printQueue.map((item) => (
              <PPDSLabelRenderer
                key={item.uid}
                item={item}
                storageInfo={storageInfo}
                businessName={businessName}
                allIngredients={allIngredients}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
