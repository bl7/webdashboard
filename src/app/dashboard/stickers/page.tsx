"use client"

import React, { useEffect, useMemo, useState } from "react"
import ReactDOM from "react-dom/client"
import { toPng } from "html-to-image"
import { getAllIngredients, getAllMenuItems } from "@/lib/api"
import { usePrinter } from "@/context/PrinterContext"
import { Button } from "@/components/ui/button"
import { RoundStickerRenderer } from "../print/RoundStickerRenderer"
import { logAction } from "@/lib/logAction"
import type { PrintQueueItem } from "@/types/print"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

type MenuItem = {
  id: number | string
  name: string
  ingredients: string[]
  expiryDate: string
  printedOn: string
}

function calculateExpiryDate(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

async function renderStickerToPng(
  item: PrintQueueItem,
  expiry: string,
  allIngredients: Array<{
    uuid: string
    ingredientName: string
    allergens: { allergenName: string }[]
  }>,
  showNetWt: boolean,
  netWt: string
): Promise<string> {
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.top = "0"
  container.style.left = "0"
  container.style.width = "5cm"
  container.style.height = "5cm"
  container.style.backgroundColor = "white"
  container.style.zIndex = "-1"
  container.style.visibility = "hidden"
  document.body.appendChild(container)

  const root = ReactDOM.createRoot(container)
  root.render(
    <RoundStickerRenderer
      item={item}
      expiry={expiry}
      allergens={[]}
      allIngredients={allIngredients}
      showNetWt={showNetWt}
      netWt={netWt}
    />
  )

  await new Promise((resolve) => setTimeout(resolve, 250))
  container.style.visibility = "visible"

  const imageData = await toPng(container, {
    cacheBust: true,
    pixelRatio: 5, // Greatly increased for sharp thermal printing
    width: container.offsetWidth,
    height: container.offsetHeight,
  })

  root.unmount()
  container.remove()
  return imageData
}

export default function StickersPage() {
  const itemsPerPage = 5
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [allIngredients, setAllIngredients] = useState<
    Array<{
      uuid: string
      ingredientName: string
      allergens: { allergenName: string }[]
    }>
  >([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [printQueue, setPrintQueue] = useState<PrintQueueItem[]>([])
  const [customExpiry, setCustomExpiry] = useState<Record<string, string>>({})
  const [showNetWt, setShowNetWt] = useState(false)
  const [netWt, setNetWt] = useState("")

  const { isConnected, selectedPrinter, print } = usePrinter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    setLoading(true)
    Promise.all([getAllMenuItems(token), getAllIngredients(token)])
      .then(([menuRes, ingredientRes]) => {
        const categories = menuRes?.data || []
        const parsedMenu: MenuItem[] = []
        let i = 0

        for (const category of categories) {
          for (const item of category.items || []) {
            const id = item.menuItemID ?? `menu-${i}-${Date.now()}`
            const name = item.menuItemName || `Menu Item ${i + 1}`
            if (name && name.trim()) {
              parsedMenu.push({
                id,
                name,
                printedOn: new Date().toISOString().split("T")[0],
                expiryDate: calculateExpiryDate(3),
                ingredients:
                  item.ingredients?.map((ing: any) => ing.ingredientName || "Unknown") || [],
              })
            }
            i++
          }
        }

        const ingredientItems = (Array.isArray(ingredientRes) ? ingredientRes : ingredientRes?.data) || []
        const parsedIngredients = ingredientItems.map((ing: any, idx: number) => ({
          uuid: String(ing.ingredientID ?? ing.uuid ?? `ing-${idx}`),
          ingredientName: ing.ingredientName || "",
          allergens: ing.allergens || [],
        }))

        setMenuItems(parsedMenu)
        setAllIngredients(parsedIngredients)
      })
      .catch((err) => setError(err?.message || "Failed to load sticker data"))
      .finally(() => setLoading(false))
  }, [])

  const filteredMenuItems = useMemo(() => {
    if (!search.trim()) return menuItems
    const q = search.toLowerCase()
    return menuItems.filter((m) => m.name.toLowerCase().includes(q))
  }, [menuItems, search])

  const paginatedMenuItems = useMemo(
    () => filteredMenuItems.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [filteredMenuItems, page]
  )
  const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage)

  useEffect(() => {
    setPage(1)
  }, [search])

  const addToQueue = (item: MenuItem) => {
    if (printQueue.some((q) => q.id === item.id && q.type === "menu")) return
    const uid = `sticker-${item.id}-${Date.now()}`
    setPrintQueue((prev) => [
      ...prev,
      {
        uid,
        id: item.id,
        type: "menu",
        name: item.name,
        quantity: 1,
        printedOn: item.printedOn,
        expiryDate: item.expiryDate,
        ingredients: item.ingredients,
        labelType: "default",
      },
    ])
  }

  const removeFromQueue = (uid: string) => {
    setPrintQueue((prev) => prev.filter((q) => q.uid !== uid))
    setCustomExpiry((prev) => {
      const next = { ...prev }
      delete next[uid]
      return next
    })
  }

  const clearQueue = () => {
    setPrintQueue([])
    setCustomExpiry({})
  }

  const updateQuantity = (uid: string, quantity: number) => {
    setPrintQueue((prev) => prev.map((q) => (q.uid === uid ? { ...q, quantity: Math.max(1, quantity) } : q)))
  }

  const updateExpiry = (uid: string, expiry: string) => {
    setCustomExpiry((prev) => ({ ...prev, [uid]: expiry }))
  }

  const printStickers = async () => {
    if (!selectedPrinter) {
      setError("Please select a printer in the header first.")
      return
    }
    if (!isConnected) {
      setError("Printer bridge is disconnected.")
      return
    }
    if (printQueue.length === 0) {
      setError("Add at least one menu item to print stickers.")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const sessionId = `sticker-${Date.now()}-${Math.random().toString(36).slice(2)}`

      for (const item of printQueue) {
        const expiry = customExpiry[item.uid] || item.expiryDate || ""
        for (let i = 0; i < item.quantity; i++) {
          const imageData = await renderStickerToPng(item, expiry, allIngredients, showNetWt, netWt)
          await print(imageData, undefined, { labelWidthMm: 50, labelHeightMm: 50 })
        }

        await logAction("print_label", {
          labelType: "sticker",
          itemId: item.id,
          itemName: item.name,
          quantity: item.quantity,
          expiryDate: expiry,
          shape: "round",
          dimensionsMm: { width: 50, height: 50 },
          showNetWt,
          netWt: showNetWt ? netWt : "",
          sessionId,
        })
      }

      setPrintQueue([])
      setCustomExpiry({})
    } catch (err: any) {
      setError(err?.message || "Failed to print stickers")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen space-y-10 bg-gray-50 px-2 py-8 md:px-8">
      <div className="rounded-xl border bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight">Round Stickers</h1>
        <p className="mt-2 text-sm text-gray-600">
          50mm x 50mm thermal round stickers for menu items. Prints item name, expiry date, net weight, and
          allergens.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex flex-col gap-10 md:flex-row">
        <div className="min-w-[340px] flex-1">
          <div className="rounded-xl border bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Menu Items</h2>
            </div>
            <div className="mb-6">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu items..."
                className="w-full rounded-lg border-2 border-purple-200 px-5 py-3 text-base transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>
            {loading && <p>Loading...</p>}
            <div className="mb-8">
              {paginatedMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="mb-3 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 transition hover:shadow-md"
                >
                  <div className="min-w-0 flex-1">
                    <p className="whitespace-normal break-words font-semibold text-gray-900">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => addToQueue(item)}
                      disabled={printQueue.some((q) => q.id === item.id && q.type === "menu")}
                      variant="purple"
                    >
                      {printQueue.some((q) => q.id === item.id && q.type === "menu") ? "Added" : "Add"}
                    </Button>
                  </div>
                </div>
              ))}
              {!loading && filteredMenuItems.length === 0 && (
                <div className="rounded border border-dashed p-4 text-sm text-gray-500">
                  No menu items found.
                </div>
              )}

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
                  {page} of {Math.max(totalPages, 1)}
                </span>
                <Button
                  onClick={() => setPage((p) => Math.min(Math.max(totalPages, 1), p + 1))}
                  disabled={page >= totalPages || totalPages === 0}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-[340px] flex-1">
          <div className="mb-8 max-h-[700px] w-full overflow-y-auto rounded-2xl border-2 border-purple-300 bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b-2 border-purple-200 bg-white px-8 pb-4 pt-8">
              <h2 className="text-2xl font-bold tracking-tight text-purple-800">Sticker Queue</h2>
              <div className="flex gap-2">
                <Button
                  onClick={printStickers}
                  disabled={loading || printQueue.length === 0 || !selectedPrinter || !isConnected}
                  variant="purple"
                >
                  Print Stickers
                </Button>
                <Button
                  onClick={clearQueue}
                  disabled={printQueue.length === 0}
                  variant="outline"
                  aria-label="Clear sticker queue"
                >
                  Clear Queue
                </Button>
              </div>
            </div>

            <div className="border-b-2 border-purple-200 bg-gray-50 px-8 py-4">
              <div className="rounded border bg-white p-3">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={showNetWt}
                    onChange={(e) => setShowNetWt(e.target.checked)}
                  />
                  Show Net Wt
                </label>
                {showNetWt && (
                  <input
                    type="text"
                    value={netWt}
                    onChange={(e) => setNetWt(e.target.value)}
                    maxLength={20}
                    placeholder="e.g. 250g"
                    className="mt-2 w-full rounded border px-2 py-1 text-sm text-gray-700"
                  />
                )}
              </div>
            </div>

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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01" />
                  </svg>
                  <p className="text-lg italic text-gray-400">
                    Your sticker queue is empty.
                    <br />
                    Add items to get started!
                  </p>
                </div>
              ) : (
                printQueue.map((item) => (
                  <div
                    key={item.uid}
                    className="mb-4 flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 transition-shadow hover:shadow-lg"
                  >
                    <div className="whitespace-normal break-words font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      Best Before: {customExpiry[item.uid] || item.expiryDate || ""}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.uid, Number(e.target.value))}
                        className="w-16 rounded-md border border-gray-300 bg-white px-3 py-1 text-center text-sm text-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                      <input
                        type="date"
                        value={customExpiry[item.uid] || item.expiryDate || ""}
                        onChange={(e) => updateExpiry(item.uid, e.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                      <Button
                        onClick={() => removeFromQueue(item.uid)}
                        variant="outline"
                        className="border-none bg-red-600 text-white shadow-none hover:bg-red-700 focus:bg-red-700"
                        aria-label={`Remove ${item.name} from sticker queue`}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 rounded-xl border bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold">Sticker Preview</h2>
            {printQueue.length === 0 ? (
              <p className="text-gray-500">No sticker selected.</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                {printQueue.map((item) => (
                  <RoundStickerRenderer
                    key={item.uid}
                    item={item}
                    expiry={customExpiry[item.uid] || item.expiryDate || ""}
                    allergens={[]}
                    allIngredients={allIngredients}
                    isPreview={true}
                    showNetWt={showNetWt}
                    netWt={netWt}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


