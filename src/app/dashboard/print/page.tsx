"use client"

import React, { useEffect, useState, useMemo, useRef } from "react"
import { PrintQueueItem } from "@/types/print"
import { getAllAllergens } from "@/lib/api"
import { getAllMenuItems, getAllIngredients } from "@/lib/api"
import { Allergen } from "@/types/allergen"
import { formatLabelForPrint, LabelHeight, getLabelDimensions } from "./labelFormatter"
import LabelPreview from "./PreviewLabel"
import LabelHeightChooser from "./LabelHeightChooser"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

const itemsPerPage = 5

function calculateExpiryDate(days: number): string {
  const today = new Date()
  today.setDate(today.getDate() + days)
  return today.toISOString().split("T")[0]
}

function getDefaultExpiryDays(type: "cook" | "prep" | "ppds"): number {
  switch (type) {
    case "cook":
      return 1
    case "prep":
      return 3
    case "ppds":
      return 5
    default:
      return 3
  }
}

type TabType = "ingredients" | "menu"

type IngredientItem = {
  id: number | string
  name: string
  allergens: Allergen[]
  printedOn: string
  expiryDate: string
}

type MenuItem = {
  id: number | string
  name: string
  printedOn: string
  expiryDate: string
  ingredients: string[]
}

interface PrinterStatus {
  isConnected: boolean
  printerName: string
  status: string
}

export default function LabelDemo() {
  const [printerStatus, setPrinterStatus] = useState<PrinterStatus>({
    isConnected: false,
    printerName: "No Printer",
    status: "Checking connection...",
  })
  const [printQueue, setPrintQueue] = useState<PrintQueueItem[]>([])
  const [allergens, setAllergens] = useState<Allergen[]>([])
  const [customExpiry, setCustomExpiry] = useState<Record<string, string>>({})
  const [ingredients, setIngredients] = useState<IngredientItem[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activeTab, setActiveTab] = useState<TabType>("ingredients")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expiryDays, setExpiryDays] = useState<Record<string, string>>({})
  const [customInitials, setCustomInitials] = useState<string[]>([])
  const [useInitials, setUseInitials] = useState<boolean>(true)
  const [selectedInitial, setSelectedInitial] = useState<string>("")
  const [labelHeight, setLabelHeight] = useState<LabelHeight>("40mm")
  const [feedbackMsg, setFeedbackMsg] = useState<string>("")
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "">("")
  const feedbackTimeout = useRef<NodeJS.Timeout | null>(null)

  const showFeedback = (msg: string, type: "success" | "error" = "success") => {
    setFeedbackMsg(msg)
    setFeedbackType(type)
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current)
    feedbackTimeout.current = setTimeout(() => {
      setFeedbackMsg("")
      setFeedbackType("")
    }, 3000)
  }

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userid") || "test-user" : "test-user"

  // Check printer connection status
  const checkPrinterStatus = async () => {
    try {
      const ws = new WebSocket("ws://localhost:8080")

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: "check-printer-status" }))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === "printer-status") {
            setPrinterStatus({
              isConnected: data.isConnected || false,
              printerName: data.printerName || "No Printer",
              status: data.status || "Unknown",
            })
          }
        } catch (err) {
          console.error("Error parsing printer status:", err)
        }
        ws.close()
      }

      ws.onerror = () => {
        setPrinterStatus({
          isConnected: false,
          printerName: "No Printer",
          status: "Server connection failed",
        })
        ws.close()
      }

      ws.onclose = (event) => {
        if (event.code !== 1000) {
          setPrinterStatus({
            isConnected: false,
            printerName: "No Printer",
            status: "Connection lost",
          })
        }
      }
    } catch (err) {
      setPrinterStatus({
        isConnected: false,
        printerName: "No Printer",
        status: "Connection error",
      })
    }
  }

  useEffect(() => {
    checkPrinterStatus()
    // Check printer status every 30 seconds
    const interval = setInterval(checkPrinterStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsRes, initialsRes] = await Promise.all([
          fetch(`/api/label-settings?user_id=${userId}`),
          fetch(`/api/label-initials?user_id=${userId}`),
        ])

        const settingsData = await settingsRes.json()
        const initialsData = await initialsRes.json()

        const expiryMap = Object.fromEntries(
          (settingsData.settings || []).map((item: any) => [
            item.label_type,
            item.expiry_days.toString(),
          ])
        )
        setExpiryDays(expiryMap)
        setUseInitials(initialsData.use_initials)
        setCustomInitials(initialsData.initials || [])
      } catch (err) {
        console.error("Failed to load settings:", err)
        showFeedback("Failed to load settings", "error")
      }
    }

    fetchSettings()
  }, [userId])

  useEffect(() => {
    setPage(1)
  }, [activeTab, searchTerm])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    getAllAllergens(token)
      .then((res) => res?.data && setAllergens(res.data))
      .catch((err) => console.error("Allergen error", err))
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    setIsLoading(true)
    getAllIngredients(token)
      .then((data) => {
        const items = (Array.isArray(data) ? data : data.data) || []
        const formatted = items
          .map((item: any, i: number) => ({
            id: item.ingredientID ?? `ingredient-${i}-${Date.now()}`,
            name: item.ingredientName || `Ingredient ${i + 1}`,
            allergens: item.allergens || [],
            printedOn: item.printedOn || new Date().toISOString().split("T")[0],
            expiryDate: calculateExpiryDate(item.expiryDays || 7),
          }))
          .filter((i: { name: string }) => i.name && i.name.trim() !== "")
        setIngredients(formatted)
      })
      .catch((err) => setError(`Ingredient error: ${err.message}`))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    setIsLoading(true)
    getAllMenuItems(token)
      .then((res) => {
        const categories = res?.data || []
        const formatted: MenuItem[] = []
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
                expiryDate: calculateExpiryDate(
                  parseInt(expiryDays["cook"] || "") || getDefaultExpiryDays("cook")
                ),
                ingredients:
                  item.ingredients?.map((ing: any) => ing.ingredientName || "Unknown") || [],
              })
            }
            i++
          }
        }
        setMenuItems(formatted)
      })
      .catch((err) => setError(`Menu fetch error: ${err.message}`))
      .finally(() => setIsLoading(false))
  }, [])

  const filteredIngredients = useMemo(
    () =>
      !searchTerm
        ? ingredients
        : ingredients.filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [ingredients, searchTerm]
  )
  const filteredMenuItems = useMemo(
    () =>
      !searchTerm
        ? menuItems
        : menuItems.filter((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [menuItems, searchTerm]
  )
  const paginatedIngredients = useMemo(
    () => filteredIngredients.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filteredIngredients, page]
  )
  const paginatedMenuItems = useMemo(
    () => filteredMenuItems.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filteredMenuItems, page]
  )

  const handleExpiryChange = (uid: string, value: string) =>
    setCustomExpiry((prev) => ({ ...prev, [uid]: value }))

  const addToPrintQueue = (item: IngredientItem | MenuItem, type: TabType) => {
    const uniqueId = `${type}-${item.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    if (printQueue.some((q) => q.id === item.id && q.type === type)) return

    const base: Omit<PrintQueueItem, "allergens" | "ingredients" | "labelType"> = {
      uid: uniqueId,
      id: item.id,
      type,
      name: item.name,
      quantity: 1,
      printedOn: item.printedOn,
      expiryDate: item.expiryDate,
    }

    const newItem: PrintQueueItem =
      type === "ingredients"
        ? { ...base, allergens: (item as IngredientItem).allergens }
        : {
            ...base,
            ingredients: (item as MenuItem).ingredients,
            labelType: "cook" as "cook",
          }

    setPrintQueue((prev) => [...prev, newItem])
  }

  const updateQuantity = (uid: string, quantity: number) =>
    setPrintQueue((prev) =>
      prev.map((q) => (q.uid === uid ? { ...q, quantity: Math.max(1, quantity) } : q))
    )

  const updateLabelType = (uid: string, labelType: "cook" | "prep" | "ppds") =>
    setPrintQueue((prev) =>
      prev.map((q) =>
        q.uid === uid
          ? {
              ...q,
              labelType,
              expiryDate: calculateExpiryDate(
                parseInt(expiryDays[labelType] || "") || getDefaultExpiryDays(labelType)
              ),
            }
          : q
      )
    )

  const removeFromQueue = (uid: string) =>
    setPrintQueue((prev) => prev.filter((q) => q.uid !== uid))

  const clearPrintQueue = () => setPrintQueue([])

  const printLabels = async (): Promise<void> => {
    if (!printerStatus.isConnected) {
      showFeedback("Printer not connected", "error")
      return
    }

    if (printQueue.length === 0) {
      showFeedback("No items in print queue", "error")
      return
    }

    try {
      // Create WebSocket connection to server
      const ws = new WebSocket("ws://localhost:8080")

      ws.onopen = () => {
        console.log("Connected to print server")

        // Prepare all print jobs
        const printJobs: Array<{
          content: string
          options: {
            labelHeight: string
            itemName: string
            quantity: number
          }
        }> = []

        for (const item of printQueue) {
          for (let i = 0; i < item.quantity; i++) {
            const labelText = formatLabelForPrint(
              item,
              allergens.map((a) => a.allergenName.toLowerCase()),
              customExpiry,
              5,
              useInitials,
              selectedInitial,
              labelHeight
            )

            printJobs.push({
              content: labelText,
              options: {
                labelHeight: labelHeight,
                itemName: item.name,
                quantity: 1, // Each job is for 1 label
              },
            })
          }
        }

        // Send print jobs via WebSocket
        const message = {
          type: "print-multiple",
          jobs: printJobs,
        }

        ws.send(JSON.stringify(message))
      }

      ws.onmessage = (event) => {
        try {
          const result = JSON.parse(event.data)

          if (result.type === "print-result") {
            if (result.success) {
              const totalJobs = result.totalJobs || printQueue.length
              showFeedback(`Printed ${totalJobs} labels successfully`, "success")
              // Optionally clear the queue after successful printing
              // clearPrintQueue()
            } else {
              const errorMsg = result.message || "Print failed"
              showFeedback(errorMsg, "error")
            }
          }
        } catch (parseError) {
          console.error("Error parsing WebSocket response:", parseError)
          showFeedback("Print failed: Invalid server response", "error")
        }

        ws.close()
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        showFeedback("Print failed: Connection error", "error")
        ws.close()
      }

      ws.onclose = (event) => {
        if (event.code !== 1000) {
          // 1000 is normal closure
          console.error("WebSocket closed unexpectedly:", event.code, event.reason)
          showFeedback("Print failed: Connection closed", "error")
        }
      }

      // Set a timeout to close the connection if no response
      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close()
          showFeedback("Print failed: Server timeout", "error")
        }
      }, 30000) // 30 second timeout
    } catch (e: unknown) {
      console.error("Print error", e)
      const errorMessage = e instanceof Error ? e.message : "Unknown error"
      showFeedback(`Print failed: ${errorMessage}`, "error")
    }
  }

  const totalItems =
    activeTab === "ingredients" ? filteredIngredients.length : filteredMenuItems.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="mx-auto">
        <div className="flex gap-8">
          {/* Left Section: Label Printer */}
          <div className="w-1/2">
            <div className="flex items-center gap-8">
              <h1 className="mb-4 text-2xl font-bold">Label Printer</h1>
              <div className="mb-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    printerStatus.isConnected
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {printerStatus.isConnected ? "● Connected" : "● Disconnected"}
                </span>
                <p className="mt-1 text-sm text-gray-600">{printerStatus.printerName}</p>
              </div>
            </div>
            {/* Label Height Chooser */}
            <div className="mb-6">
              <LabelHeightChooser
                selectedHeight={labelHeight}
                onHeightChange={setLabelHeight}
                className="mb-4"
              />
            </div>
          </div>

          {/* Right Section: Initials and Settings */}
          <div className="w-1/2">
            {useInitials && customInitials.length > 0 && (
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Select Initials
                </label>
                <select
                  className="w-full rounded border px-4 py-2"
                  value={selectedInitial}
                  onChange={(e) => setSelectedInitial(e.target.value)}
                >
                  <option value="">Select initials...</option>
                  {customInitials.map((initial) => (
                    <option key={initial} value={initial}>
                      {initial}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Messages */}
        {feedbackMsg && (
          <div
            className={`mb-4 rounded-md p-4 ${
              feedbackType === "success"
                ? "border border-green-200 bg-green-50 text-green-800"
                : "border border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {feedbackMsg}
          </div>
        )}

        <div className="flex gap-8">
          <div className="w-1/2">
            <div className="mb-6 flex w-fit items-center space-x-2 rounded-full bg-gray-100 p-1">
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === "ingredients"
                    ? "bg-white text-purple-700 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("ingredients")}
              >
                Ingredients
              </button>
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === "menu"
                    ? "bg-white text-purple-700 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("menu")}
              >
                Menu Items
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full rounded border px-4 py-2"
              />
            </div>

            {isLoading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <div className="mb-6">
              {(activeTab === "ingredients" ? paginatedIngredients : paginatedMenuItems).map(
                (item) => (
                  <div
                    key={item.id}
                    className="mb-2 flex items-center justify-between rounded border p-4"
                  >
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">Expires: {item.expiryDate}</p>
                    </div>
                    <button
                      onClick={() => addToPrintQueue(item, activeTab)}
                      className="rounded bg-green-600 px-3 py-1 text-white disabled:bg-gray-400"
                      disabled={printQueue.some((q) => q.id === item.id && q.type === activeTab)}
                    >
                      {printQueue.some((q) => q.id === item.id && q.type === activeTab)
                        ? "Added"
                        : "Add"}
                    </button>
                  </div>
                )
              )}
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`flex items-center gap-1 rounded border px-3 py-2 text-sm ${
                  page === 1
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>

              <span className="min-w-[80px] text-center text-sm text-gray-700">
                {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className={`flex items-center gap-1 rounded border px-3 py-2 text-sm ${
                  page === totalPages || totalPages === 0
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mb-8 max-h-[600px] w-1/2 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 pb-3 pt-6">
              <h2 className="text-2xl font-semibold text-gray-900">Print Queue</h2>
              <button
                onClick={printLabels}
                disabled={!printerStatus.isConnected || printQueue.length === 0}
                className={`rounded px-4 py-2 text-white transition-colors ${
                  !printerStatus.isConnected || printQueue.length === 0
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                title={
                  !printerStatus.isConnected
                    ? "Printer not connected"
                    : printQueue.length === 0
                      ? "No items in print queue"
                      : "Print all labels in queue"
                }
              >
                Print Labels ({labelHeight})
              </button>
              <button
                onClick={clearPrintQueue}
                disabled={printQueue.length === 0}
                className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
                aria-label="Clear print queue"
              >
                Clear Queue
              </button>
            </div>

            <div className="px-6 pb-6 pt-2">
              {printQueue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <svg
                    className="mb-2 h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17v-2a4 4 0 018 0v2M9 17a4 4 0 01-8 0v-2a4 4 0 018 0v2zM9 17v-2a4 4 0 018 0v2M9 17a4 4 0 01-8 0v-2a4 4 0 018 0v2z"
                    />
                  </svg>
                  <p className="italic">No items in print queue</p>
                </div>
              ) : (
                printQueue.map((item) => (
                  <div
                    key={item.uid}
                    className="mb-3 flex items-center gap-4 rounded-md border border-gray-300 bg-gray-50 px-4 py-3 transition-shadow hover:shadow-md"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-800">{item.name}</p>
                      <p className="mt-0.5 text-xs text-gray-500">Expires: {item.expiryDate}</p>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.uid, Number(e.target.value))}
                      className="w-16 rounded-md border border-gray-300 bg-white px-3 py-1 text-center text-sm text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    {"labelType" in item && (
                      <select
                        value={item.labelType || "cook"}
                        onChange={(e) =>
                          updateLabelType(item.uid, e.target.value as "cook" | "prep" | "ppds")
                        }
                        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="cook">Cook</option>
                        <option value="prep">Prep</option>
                        <option value="ppds">PPDS</option>
                      </select>
                    )}
                    <button
                      onClick={() => removeFromQueue(item.uid)}
                      className="rounded-md px-3 py-1 text-sm font-semibold text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400"
                      aria-label={`Remove ${item.name} from queue`}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {/* Label Preview with selected height */}
        <LabelPreview
          printQueue={printQueue}
          ALLERGENS={allergens.map((a) => a.allergenName.toLowerCase())}
          customExpiry={customExpiry}
          onExpiryChange={handleExpiryChange}
          useInitials={useInitials}
          selectedInitial={selectedInitial}
          labelHeight={labelHeight}
        />
      </div>
    </div>
  )
}
