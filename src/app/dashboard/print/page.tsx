"use client"

import React, { useState, useEffect, useMemo } from "react"
import { PrinterProvider, usePrinter } from "@/context/PrinterContext"

const ALLERGENS = ["milk", "eggs", "nuts", "soy", "wheat", "fish", "shellfish", "peanuts"]

type TabType = "ingredients" | "menu"

type IngredientItem = {
  id: number | string
  name: string
  allergens: string[]
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

import { PrintQueueItem } from "@/types/print"
// --- API Functions ---
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

// --- Utility Functions ---
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

function isAllergenic(ingredient: string) {
  return ALLERGENS.includes(ingredient.toLowerCase())
}

// --- Main Page Component ---
function LabelPrinterContent() {
  const [activeTab, setActiveTab] = useState<TabType>("ingredients")
  const [printQueue, setPrintQueue] = useState<PrintQueueItem[]>([])
  const [ingredients, setIngredients] = useState<IngredientItem[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const itemsPerPage = 5
  // Printer context
  const { managerRef, status: printerStatus, message, setMessage } = usePrinter()
  useEffect(() => {
    setPage(1)
  }, [activeTab, searchTerm])
  const filteredIngredients = useMemo(() => {
    if (!searchTerm) return ingredients
    return ingredients.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [ingredients, searchTerm])

  // Filter menu items by search term
  const filteredMenuItems = useMemo(() => {
    if (!searchTerm) return menuItems
    return menuItems.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [menuItems, searchTerm])

  // Calculate total pages based on filtered data
  const totalPages = useMemo(() => {
    const totalItems =
      activeTab === "ingredients" ? filteredIngredients.length : filteredMenuItems.length
    return Math.max(1, Math.ceil(totalItems / itemsPerPage))
  }, [activeTab, filteredIngredients, filteredMenuItems])

  // Paginate filtered ingredients
  const paginatedIngredients = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return filteredIngredients.slice(start, start + itemsPerPage)
  }, [filteredIngredients, page])

  // Paginate filtered menu items
  const paginatedMenuItems = useMemo(() => {
    const start = (page - 1) * itemsPerPage
    return filteredMenuItems.slice(start, start + itemsPerPage)
  }, [filteredMenuItems, page])
  // Fetch ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      const token = localStorage.getItem("token")
      if (!token) return
      setIsLoading(true)
      try {
        const data = await getAllIngredients(token)
        const ingredientsData = Array.isArray(data) ? data : data.data
        const ingredients: IngredientItem[] = ingredientsData
          .map((item: any, index: number) => ({
            id: item.ingredientID ?? `ingredient-${index}-${Date.now()}`,
            name: item.ingredientName || `Ingredient ${index + 1}`,
            allergens: item.allergens || [],
            printedOn: item.printedOn || new Date().toISOString().split("T")[0],
            expiryDate: calculateExpiryDate(item.expiryDays || 7),
          }))
          .filter((item: any) => item.name && item.name.trim() !== "")
        setIngredients(ingredients)
        setError(null)
      } catch (err: any) {
        setError(`Error fetching ingredients: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetchIngredients()
  }, [])

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      try {
        const res = await getAllMenuItems(token)
        if (!res?.data) {
          setError("No data found.")
          return
        }
        const menuItems: MenuItem[] = []
        let globalIndex = 0
        for (const category of res.data) {
          if (!category.items) continue
          for (const item of category.items) {
            const id = item.menuItemID ?? `menu-${globalIndex}-${Date.now()}`
            const name = item.menuItemName || `Menu Item ${globalIndex + 1}`
            if (name && name.trim() !== "") {
              menuItems.push({
                id,
                name,
                printedOn: new Date().toISOString().split("T")[0],
                expiryDate: calculateExpiryDate(getDefaultExpiryDays("cook")),
                ingredients: item.ingredients
                  ? item.ingredients.map((ing: any) => ing.ingredientName || "Unknown Ingredient")
                  : [],
              })
            }
            globalIndex++
          }
        }
        setMenuItems(menuItems)
        setError(null)
      } catch (err: any) {
        setError(`Failed to fetch menu items: ${err.message}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMenuItems()
  }, [])

  // Add item to print queue
  const addToPrintQueue = (item: IngredientItem | MenuItem, type: TabType) => {
    setPrintQueue((prev) => {
      const uniqueId = `${type}-${item.id}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
      if (prev.some((q) => q.id === item.id && q.type === type)) return prev
      const baseItem = {
        uid: uniqueId,
        id: item.id,
        type,
        name: item.name,
        quantity: 1,
        printedOn: item.printedOn,
        expiryDate: item.expiryDate,
      }
      if (type === "ingredients") {
        const ingredientItem = item as IngredientItem
        return [
          ...prev,
          {
            ...baseItem,
            allergens: ingredientItem.allergens,
          },
        ]
      } else {
        const menuItem = item as MenuItem
        return [
          ...prev,
          {
            ...baseItem,
            ingredients: menuItem.ingredients,
            labelType: "cook" as const,
          },
        ]
      }
    })
  }

  // Remove item from print queue by uid
  const removeFromPrintQueue = (uid: string) => {
    setPrintQueue((prev) => prev.filter((q) => q.uid !== uid))
  }

  // Clear entire print queue
  const clearPrintQueue = () => {
    setPrintQueue([])
  }

  // Update quantity of an item in print queue
  const updateQuantity = (uid: string, quantity: number) => {
    setPrintQueue((prev) =>
      prev.map((q) => (q.uid === uid ? { ...q, quantity: Math.max(1, quantity) } : q))
    )
  }

  // Update label type and expiry date for menu items
  const updateLabelType = (uid: string, labelType: "cook" | "prep" | "ppds") => {
    setPrintQueue((prev) =>
      prev.map((q) =>
        q.uid === uid
          ? { ...q, labelType, expiryDate: calculateExpiryDate(getDefaultExpiryDays(labelType)) }
          : q
      )
    )
  }

  // Print actions using printer manager ref
  const handlePrintUSB = () => {
    if (!managerRef.current) {
      setMessage("Printer manager is not ready")
      return
    }
    managerRef.current.handleEpsonPrint(printQueue)
  }

  const handlePrintBluetooth = async () => {
    if (!managerRef.current) {
      setMessage("Printer manager is not ready")
      return
    }
    await managerRef.current.handleBluetoothPrint(printQueue)
  }

  const handleConnectBluetooth = async () => {
    if (!managerRef.current) {
      setMessage("Printer manager is not ready")
      return
    }
    await managerRef.current.scanAndConnectBluetooth()
  }

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
                {paginatedIngredients.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
                  >
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="mt-1 text-sm text-gray-500">
                        Allergens:{" "}
                        {item.allergens && item.allergens.length > 0 ? (
                          <span className="text-red-600">{item.allergens.join(", ")}</span>
                        ) : (
                          <span className="italic text-gray-400">None</span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">Expires: {item.expiryDate}</div>
                    </div>
                    <button
                      className="rounded-lg bg-green-600 px-5 py-1 font-medium text-white hover:bg-green-700"
                      onClick={() => addToPrintQueue(item, "ingredients")}
                    >
                      Add
                    </button>
                  </div>
                ))}
                {/* Pagination Controls */}
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="px-3 py-1">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {activeTab === "menu" && (
              <div className="mb-8 flex flex-col gap-3">
                {paginatedMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
                  >
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="mt-1 text-sm text-gray-500">
                        Ingredients:{" "}
                        {item.ingredients && item.ingredients.length > 0 ? (
                          item.ingredients.join(", ")
                        ) : (
                          <span className="italic text-gray-400">None</span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">Expires: {item.expiryDate}</div>
                    </div>
                    <button
                      className="rounded-lg bg-green-600 px-5 py-1 font-medium text-white hover:bg-green-700"
                      onClick={() => addToPrintQueue(item, "menu")}
                    >
                      Add
                    </button>
                  </div>
                ))}
                {/* Pagination Controls */}
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <span className="px-3 py-1">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
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
