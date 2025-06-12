"use client"
import React, { useState, useEffect, useMemo, useRef } from "react"
import { PrinterProvider } from "@/context/PrinterContext"
import { getAllAllergens } from "@/lib/api"
import LabelPreview from "./PreviewLabel"
import { Allergen } from "@/types/allergen"
import { PrintQueueItem } from "@/types/print"
import { allergenIconMap } from "../../../components/allergenicons"
import dynamic from "next/dynamic"

const PrinterManager = dynamic(() => import("./PrinterManager"), { ssr: false })

const ALLERGENS_FILTER = ["milk", "eggs", "nuts", "soy", "wheat", "fish", "shellfish", "peanuts"]
const itemsPerPage = 5

function useEpsonScript(onLoad: () => void) {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://epson.github.io/ePOS-Print-SDK/ePOS-Device.js"
    script.async = true
    script.onload = onLoad
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [onLoad])
}

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

async function getAllMenuItems(token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error("Failed to fetch menu items")
  return await response.json()
}

async function getAllIngredients(token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error("Failed to fetch ingredients")
  return await response.json()
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
interface PrinterManager {
  handleEpsonPrint: (queue: any) => void
  handleBluetoothPrint: (queue: any) => void
  scanAndConnectBluetooth: () => void
}

function LabelPrinterContent() {
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [printerStatus, setPrinterStatus] = useState({
    printerConnected: false,
    btDevice: null,
    isBtConnecting: false,
    isBtSending: false,
  })
  const [message, setMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>("ingredients")
  const [printQueue, setPrintQueue] = useState<PrintQueueItem[]>([])
  const [ingredients, setIngredients] = useState<IngredientItem[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [data, setData] = useState<Allergen[]>([])
  const [customExpiry, setCustomExpiry] = useState<Record<string, string>>({})
  const managerRef = useRef<PrinterManager | null>(null)

  useEpsonScript(() => setScriptLoaded(true))

  useEffect(() => {
    setPage(1)
  }, [activeTab, searchTerm])

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
        setError(null)
      })
      .catch((err) => {
        setError(`Error fetching ingredients: ${err.message}`)
      })
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
                expiryDate: calculateExpiryDate(getDefaultExpiryDays("cook")),
                ingredients:
                  item.ingredients?.map((ing: any) => ing.ingredientName || "Unknown") || [],
              })
            }
            i++
          }
        }
        setMenuItems(formatted)
        setError(null)
      })
      .catch((err) => {
        setError(`Failed to fetch menu items: ${err.message}`)
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    getAllAllergens(token)
      .then((res) => {
        if (res?.data) {
          const mapped = res.data.map(
            (item: any): Allergen => ({
              uuid: item.id,
              allergenName: item.allergenName,
              category: item.isCustom ? "Custom" : "Standard",
              status: item.isActive ? "Active" : "Inactive",
              addedAt: item.createdAt.split("T")[0],
              isCustom: item.isCustom,
            })
          )
          setData(mapped)
        }
      })
      .catch((err) => console.error("Allergen fetch error", err))
  }, [])

  const ALLERGENS = useMemo(
    () => data.filter((d) => d.status === "Active").map((d) => d.allergenName.toLowerCase()),
    [data]
  )
  const isAllergenic = (ingredient: string) => ALLERGENS.includes(ingredient.toLowerCase())

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
  // const totalItemsInQueue = printQueue.reduce((sum, item) => sum + item.quantity, 0)

  const handleExpiryChange = (uid: string, value: string) => {
    setCustomExpiry((prev) => ({ ...prev, [uid]: value }))
  }

  const addToPrintQueue = (item: IngredientItem | MenuItem, type: TabType) => {
    setPrintQueue((prev) => {
      const uniqueId = `${type}-${item.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
      if (prev.some((q) => q.id === item.id && q.type === type)) return prev
      const base = {
        uid: uniqueId,
        id: item.id,
        type,
        name: item.name,
        quantity: 1,
        printedOn: item.printedOn,
        expiryDate: item.expiryDate,
      }
      return [
        ...prev,
        type === "ingredients"
          ? { ...base, allergens: (item as IngredientItem).allergens }
          : { ...base, ingredients: (item as MenuItem).ingredients, labelType: "cook" },
      ]
    })
  }

  const removeFromPrintQueue = (uid: string) =>
    setPrintQueue((prev) => prev.filter((q) => q.uid !== uid))
  const clearPrintQueue = () => setPrintQueue([])
  const updateQuantity = (uid: string, quantity: number) =>
    setPrintQueue((prev) =>
      prev.map((q) => (q.uid === uid ? { ...q, quantity: Math.max(1, quantity) } : q))
    )
  const updateLabelType = (uid: string, labelType: "cook" | "prep" | "ppds") =>
    setPrintQueue((prev) =>
      prev.map((q) =>
        q.uid === uid
          ? { ...q, labelType, expiryDate: calculateExpiryDate(getDefaultExpiryDays(labelType)) }
          : q
      )
    )
  const handlePrintUSB = () => managerRef.current?.handleEpsonPrint(printQueue)
  const handlePrintBluetooth = () => managerRef.current?.handleBluetoothPrint(printQueue)
  const handleConnectBluetooth = () => managerRef.current?.scanAndConnectBluetooth()

  const totalItemsInQueue = printQueue.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex items-center gap-8">
        <h1 className="mb-4 text-2xl font-bold">Label Printer</h1>

        {/* Printer status and message */}
        <div className="mb-4">
          <span
            className={`mr-2 inline-block rounded-full px-3 py-1 text-xs ${
              printerStatus.printerConnected
                ? "bg-green-200 text-green-800"
                : "bg-red-600 text-gray-100"
            }`}
          >
            {printerStatus.printerConnected ? "Printer Connected" : "Printer Not Connected"}
          </span>
          {printerStatus.isBtConnecting && (
            <span className="mr-2 inline-block rounded-full bg-yellow-200 px-3 py-1 text-xs text-yellow-800">
              Connecting Bluetooth...
            </span>
          )}
          {printerStatus.isBtSending && (
            <span className="mr-2 inline-block rounded-full bg-blue-200 px-3 py-1 text-xs text-blue-800">
              Sending to Printer...
            </span>
          )}
          {message && (
            <span className="inline-block rounded-full bg-indigo-200 px-3 py-1 text-xs text-indigo-800">
              {message}
            </span>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      {/* Tabs */}
      <div className="flex gap-8">
        {/* Left Column: Select Items */}
        <div className="w-1/2">
          {/* Tabs */}
          <div className="mb-6 flex items-center justify-center border-b border-purple-700">
            <button
              className={`border-l border-r border-t px-6 py-2 font-medium transition ${
                activeTab === "ingredients"
                  ? "-mb-px border-purple-700 bg-white text-black shadow"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              } rounded-tl-md rounded-tr-md`}
              onClick={() => setActiveTab("ingredients")}
            >
              Ingredients
            </button>
            <button
              className={`border-l border-r border-t px-6 py-2 font-medium transition ${
                activeTab === "menu"
                  ? "-mb-px border-purple-700 bg-white text-black shadow"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              } rounded-tl-md rounded-tr-md`}
              onClick={() => setActiveTab("menu")}
            >
              Menu Items
            </button>
          </div>

          <div>
            {/* Search Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder={`Search ${activeTab === "ingredients" ? "ingredients" : "menu items"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Items List */}
            {isLoading && <div>Loading...</div>}
            {error && <div className="mb-2 text-red-600">{error}</div>}

            {activeTab === "ingredients" && (
              <div className="mb-8 flex flex-col gap-3">
                {paginatedIngredients.map((item) => {
                  const inQueue = printQueue.some(
                    (q) => q.id === item.id && q.type === "ingredients"
                  )
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
                    >
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="mt-1 text-sm text-gray-500">
                          Allergens:{" "}
                          {item.allergens.length > 0 ? (
                            <span className="flex flex-wrap items-center gap-1 text-red-600">
                              {item.allergens.map((a) => (
                                <span key={a.allergenName} className="flex items-center">
                                  {allergenIconMap[a.allergenName.toLowerCase()] ??
                                    allergenIconMap.default}
                                  {a.allergenName}
                                </span>
                              ))}
                            </span>
                          ) : (
                            <span className="italic text-gray-400">None</span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-gray-400">Expires: {item.expiryDate}</div>
                      </div>
                      <button
                        disabled={inQueue}
                        onClick={() => addToPrintQueue(item, "ingredients")}
                        className={`rounded-lg px-5 py-1 font-medium text-white ${
                          inQueue
                            ? "cursor-not-allowed bg-gray-300 text-gray-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {inQueue ? "Added" : "Add"}
                      </button>
                    </div>
                  )
                })}
                {/* Pagination controls */}
              </div>
            )}

            {activeTab === "menu" && (
              <div className="mb-8 flex flex-col gap-3">
                {paginatedMenuItems.map((item) => {
                  const allergenicIngredients = item.ingredients?.filter(isAllergenic) || []
                  const inQueue = printQueue.some((q) => q.id === item.id && q.type === "menu")
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
                    >
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="mt-1 text-sm text-gray-500">
                          Ingredients:{" "}
                          {item.ingredients.length > 0 ? (
                            <>
                              {item.ingredients.join(", ")}
                              {allergenicIngredients.length > 0 && (
                                <div className="mt-1 font-semibold text-red-600">
                                  Allergens:{" "}
                                  {allergenicIngredients.map((a, i) => (
                                    <span key={a} className="flex items-center">
                                      {allergenIconMap[a.toLowerCase()] ?? allergenIconMap.default}
                                      {a}
                                      {i < allergenicIngredients.length - 1 ? ", " : ""}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="italic text-gray-400">None</span>
                          )}
                        </div>
                      </div>
                      <button
                        disabled={inQueue}
                        onClick={() => addToPrintQueue(item, "menu")}
                        className={`rounded-lg px-5 py-1 font-medium text-white ${
                          inQueue
                            ? "cursor-not-allowed bg-gray-300 text-gray-600"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {inQueue ? "Added" : "Add"}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Print Queue */}
        <div className="mb-8 max-h-[600px] w-1/2 overflow-y-auto">
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-bold">Print Queue</h2>
            {printQueue.length === 0 ? (
              <div className="mb-2 italic text-gray-500">No items in queue.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {printQueue.map((item) => (
                  <div
                    key={item.uid}
                    className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="mt-1 text-xs text-gray-400">Expires: {item.expiryDate}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm">Quantity</span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.uid, parseInt(e.target.value) || 1)}
                          className="w-16 rounded border px-2 py-1"
                        />
                      </div>
                      {item.type === "menu" && (
                        <div className="mt-2">
                          <span className="text-sm">Label Type</span>
                          <select
                            value={item.labelType || "cook"}
                            onChange={(e) =>
                              updateLabelType(item.uid, e.target.value as "cook" | "prep" | "ppds")
                            }
                            className="ml-2 rounded border px-2 py-1"
                          >
                            <option value="cook">Cook</option>
                            <option value="prep">Prep</option>
                            <option value="ppds">PPDS</option>
                          </select>
                        </div>
                      )}
                      {item.type === "ingredients" && (
                        <div className="mt-2 text-sm text-gray-400">Label Type: —</div>
                      )}
                    </div>
                    <button
                      className="mt-1 h-8 rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      onClick={() => removeFromPrintQueue(item.uid)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            {printQueue.length > 0 && (
              <button
                className="mt-2 rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
                onClick={clearPrintQueue}
              >
                Clear Queue
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex">
        <LabelPreview
          printQueue={printQueue}
          ALLERGENS={ALLERGENS}
          customExpiry={customExpiry}
          onExpiryChange={handleExpiryChange}
        />
        <PrinterManager
          scriptLoaded={scriptLoaded}
          setMessage={setMessage}
          onStatusChange={setPrinterStatus}
        />
      </div>
      {/* Print Actions */}
      <div className="flex gap-4">
        <button
          className="rounded bg-blue-700 px-6 py-2 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handlePrintUSB}
          disabled={!printerStatus.printerConnected || totalItemsInQueue === 0}
        >
          Print (USB)
        </button>
        <button
          className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handlePrintBluetooth}
          disabled={!printerStatus.printerConnected || totalItemsInQueue === 0}
        >
          Print (Bluetooth)
        </button>
        <button
          className="rounded bg-yellow-500 px-6 py-2 text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleConnectBluetooth}
          disabled={printerStatus.isBtConnecting}
        >
          Connect Bluetooth
        </button>
      </div>
    </div>
  )
}

// --- Wrap with PrinterProvider passing printQueue ---
export default function LabelPrinterPage() {
  const [printQueue, setPrintQueue] = useState<PrintQueueItem[]>([])

  return (
    <PrinterProvider printQueue={printQueue}>
      <LabelPrinterContent />
    </PrinterProvider>
  )
}
