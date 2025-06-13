"use client"

import React, { useEffect, useState, useMemo, useRef } from "react"
import { PrintQueueItem } from "@/types/print"
import { getAllAllergens } from "@/lib/api"
import { getAllMenuItems, getAllIngredients } from "@/lib/api"
import { Allergen } from "@/types/allergen"
import { formatLabelForPrint } from "./labelFormatter"
import LabelPreview from "./PreviewLabel"

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

export default function LabelDemo() {
  const [printerConnected, setPrinterConnected] = useState(false)
  const [status, setStatus] = useState("Ready to connect")
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

  // --- Enhanced Print Queue Management ---
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

  const connectToPrinter = async () => {
    try {
      setStatus("Connecting...")
      if (!navigator.usb) {
        setStatus("WebUSB not supported")
        return
      }
      const device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x04b8 }] })
      await device.open()
      await device.selectConfiguration(1)
      await device.claimInterface(0)
      window.epsonPrinter = device
      setPrinterConnected(true)
      setStatus("Printer connected")
    } catch (e: any) {
      console.error("Printer connection error", e)
      setStatus(`Connection failed: ${e.message}`)
    }
  }
  const clearPrintQueue = () => setPrintQueue([])

  const printLabels = async () => {
    if (!window.epsonPrinter || !printerConnected) {
      setStatus("Printer not connected")
      return
    }

    try {
      setStatus("Printing...")
      const encoder = new TextEncoder()
      const ESC = 0x1b,
        GS = 0x1d

      const init = new Uint8Array([ESC, 0x40]) // initialize
      const cut = new Uint8Array([GS, 0x56, 0x00]) // full cut

      for (const item of printQueue) {
        for (let i = 0; i < item.quantity; i++) {
          const label = formatLabelForPrint(
            item,
            allergens.map((a) => a.allergenName.toLowerCase()),
            customExpiry
          )
          const text = encoder.encode(label + "\n")

          // Feed to match 3.1cm = 247 dots
          const feedContent = new Uint8Array([ESC, 0x4a, 264]) // Feed 264 dots for label height
          const feedGap = new Uint8Array([ESC, 0x4a, 24]) // Feed 24 dots for gap

          const buffer = new Uint8Array(
            init.length + text.length + feedContent.length + feedGap.length + cut.length
          )

          let offset = 0
          buffer.set(init, offset)
          offset += init.length
          buffer.set(text, offset)
          offset += text.length
          buffer.set(feedContent, offset)
          offset += feedContent.length
          buffer.set(feedGap, offset)
          offset += feedGap.length
          buffer.set(cut, offset)

          await window.epsonPrinter.transferOut(1, buffer)
        }
      }

      setStatus("Printed successfully")
    } catch (e: any) {
      console.error("Print error", e)
      setStatus(`Print failed: ${e.message}`)
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex gap-8">
        {/* Left Section: Label Printer */}
        <div className="w-1/2">
          <div className="flex items-center gap-8">
            <h1 className="mb-4 text-2xl font-bold">Label Printer</h1>
          </div>
          {/* You can include more printer-related content here */}
        </div>

        {/* Right Section: Initials and Settings */}
        <div className="w-1/2">
          {useInitials && customInitials.length > 0 && (
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Select Initials
              </label>
              <select className="w-full rounded border px-4 py-2">
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
        </div>
        <div className="mb-8 max-h-[600px] w-1/2 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 pb-3 pt-6">
            <h2 className="text-2xl font-semibold text-gray-900">Print Queue</h2>
            <button
              onClick={printLabels}
              disabled={!printerConnected || printQueue.length === 0}
              className={`rounded px-4 py-2 text-white transition-colors ${
                !printerConnected || printQueue.length === 0
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              title={
                !printerConnected
                  ? "Printer not connected"
                  : printQueue.length === 0
                    ? "No items in print queue"
                    : "Print all labels in queue"
              }
            >
              Print Labels
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
      {/* Label Preview */}
      <LabelPreview
        printQueue={printQueue}
        ALLERGENS={allergens.map((a) => a.allergenName.toLowerCase())}
        customExpiry={customExpiry}
        onExpiryChange={handleExpiryChange}
      />
    </div>
  )
}
