"use client"

import React, { useEffect, useState, useMemo } from "react"
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
                expiryDate: calculateExpiryDate(getDefaultExpiryDays("cook")),
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
          ? { ...q, labelType, expiryDate: calculateExpiryDate(getDefaultExpiryDays(labelType)) }
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
      const feedGap = new Uint8Array([ESC, 0x4a, 5]) // feed 0.6 mm gap
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
          const feedContent = new Uint8Array([ESC, 0x4a, 247])

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
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-2xl font-bold">USB Label Printer</h1>
      <p className="mb-2">Status: {status}</p>

      <div className="mb-6 flex gap-4">
        <button onClick={connectToPrinter} className="rounded bg-blue-600 px-4 py-2 text-white">
          {printerConnected ? "Reconnect Printer" : "Connect to USB Printer"}
        </button>
        <button
          onClick={printLabels}
          disabled={!printerConnected || printQueue.length === 0}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Print Labels
        </button>
      </div>

      <div className="mb-6 flex">
        <button
          onClick={() => setActiveTab("ingredients")}
          className={`rounded-tl rounded-tr border px-4 py-2 ${activeTab === "ingredients" ? "bg-purple-700 text-white" : "border-purple-700 bg-white"}`}
        >
          Ingredients
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`rounded-tl rounded-tr border px-4 py-2 ${activeTab === "menu" ? "bg-purple-700 text-white" : "border-purple-700 bg-white"}`}
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
        {(activeTab === "ingredients" ? paginatedIngredients : paginatedMenuItems).map((item) => (
          <div key={item.id} className="mb-2 flex items-center justify-between rounded border p-4">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">Expires: {item.expiryDate}</p>
            </div>
            <button
              onClick={() => addToPrintQueue(item, activeTab)}
              className="rounded bg-green-600 px-3 py-1 text-white"
            >
              Add
            </button>
          </div>
        ))}
      </div>

      <h2 className="mb-2 text-xl font-bold">Print Queue</h2>
      {/* Editable Print Queue Controls */}
      <div className="mb-4">
        {printQueue.length === 0 && <p className="text-gray-500">No items in print queue</p>}
        {printQueue.map((item) => (
          <div key={item.uid} className="mb-2 flex items-center gap-4 rounded border p-3">
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs text-gray-500">Expires: {item.expiryDate}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.uid, Number(e.target.value))}
              className="w-16 rounded border px-2"
            />
            {"labelType" in item && (
              <select
                value={item.labelType || "cook"}
                onChange={(e) =>
                  updateLabelType(item.uid, e.target.value as "cook" | "prep" | "ppds")
                }
                className="rounded border px-2"
              >
                <option value="cook">Cook</option>
                <option value="prep">Prep</option>
                <option value="ppds">PPDS</option>
              </select>
            )}
            <button
              onClick={() => removeFromQueue(item.uid)}
              className="rounded px-2 py-1 text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
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
