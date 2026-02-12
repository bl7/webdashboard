"use client"

import React, { useMemo, useState } from "react"
import ReactDOM from "react-dom/client"
import { toPng } from "html-to-image"
import { Button } from "@/components/ui/button"
import { useLabelSize } from "@/context/LabelSizeContext"
import { usePrinter } from "@/context/PrinterContext"
import LabelRender from "../print/LabelRender"
import { formatLabelForPrintImage } from "../print/labelFormatter"
import type { LabelHeight } from "../print/LabelHeightChooser"
import type { PrintQueueItem } from "@/types/print"
import type { Allergen } from "@/types/allergen"
import { logAction } from "@/lib/logAction"
import {
  CustomNotesLabelRenderer,
  type NotesBlock,
  type NotesConfig,
  type TextAlign,
} from "@/components/label-renderers/CustomNotesLabelRenderer"

type AdHocMode = "prep" | "notes"
type PrepType = "prep" | "cooked" | "default" | "ingredients"

function estimateBlockHeightPercent(block: NotesBlock, labelHeight: LabelHeight): number {
  const lines = Math.max(1, block.text.split("\n").length)
  const linePx = block.fontSize * 1.25 + 4
  const paddingPx = 6
  const totalPx = lines * linePx + paddingPx
  const canvasPx = labelHeight === "80mm" ? 302 : 151
  const percent = (totalPx / canvasPx) * 100
  return Math.max(8, Math.min(60, percent))
}

function blocksOverlap(
  a: NotesBlock,
  b: NotesBlock,
  aHeight: number,
  bHeight: number
): boolean {
  const aLeft = a.x
  const aRight = a.x + a.width
  const aTop = a.y
  const aBottom = a.y + aHeight

  const bLeft = b.x
  const bRight = b.x + b.width
  const bTop = b.y
  const bBottom = b.y + bHeight

  return !(aRight <= bLeft || aLeft >= bRight || aBottom <= bTop || aTop >= bBottom)
}

function findFreeBlockPosition(
  existing: NotesBlock[],
  draft: NotesBlock,
  labelHeight: LabelHeight
): { x: number; y: number } {
  const draftHeight = estimateBlockHeightPercent(draft, labelHeight)
  const maxX = Math.max(2, Math.floor(98 - draft.width))
  const maxY = Math.max(2, Math.floor(98 - draftHeight))

  for (let y = 4; y <= maxY; y += 4) {
    for (let x = 4; x <= maxX; x += 4) {
      const candidate = { ...draft, x, y }
      const intersects = existing.some((block) => {
        const blockHeight = estimateBlockHeightPercent(block, labelHeight)
        return blocksOverlap(candidate, block, draftHeight, blockHeight)
      })
      if (!intersects) {
        return { x, y }
      }
    }
  }

  // Fallback: place near bottom-left without leaving canvas
  return { x: 4, y: maxY }
}

type AdHocQueueItem = {
  uid: string
  mode: AdHocMode
  quantity: number
  itemName?: string
  expiryDate?: string
  contains?: string
  prepType?: PrepType
  noteText?: string
  notesConfig?: NotesConfig
}

type DerivedPrepData = {
  printItem: PrintQueueItem
  allIngredients: Array<{
    uuid: string
    ingredientName: string
    allergens: { allergenName: string }[]
  }>
}

function todayPlus(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split("T")[0]
}

function parseContains(contains: string): string[] {
  return contains
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
}

function buildPrepData(entry: AdHocQueueItem): DerivedPrepData {
  const itemName = entry.itemName?.trim() || "Custom Label"
  const expiryDate = entry.expiryDate || todayPlus(1)
  const containsList = parseContains(entry.contains || "")
  const uid = entry.uid
  const printedOn = new Date().toISOString().split("T")[0]

  if (entry.prepType === "ingredients") {
    const allergens: Allergen[] = containsList.map((name, idx) => ({
      uuid: idx + 1,
      allergenName: name,
      category: "Custom",
      status: "Active",
      addedAt: new Date().toISOString(),
      isCustom: true,
    }))

    return {
      printItem: {
        uid,
        id: uid,
        type: "ingredients",
        name: itemName,
        quantity: 1,
        printedOn,
        expiryDate,
        allergens,
      },
      allIngredients: [],
    }
  }

  // For prep/cooked/default menu layouts, map contains values into synthetic ingredient allergen data.
  const allIngredients = containsList.map((term, idx) => ({
    uuid: `adhoc-ing-${uid}-${idx}`,
    ingredientName: term,
    allergens: [{ allergenName: term.toUpperCase() }],
  }))

  return {
    printItem: {
      uid,
      id: uid,
      type: "menu",
      name: itemName,
      quantity: 1,
      printedOn,
      expiryDate,
      ingredients: containsList,
      labelType: (entry.prepType || "prep") as "prep" | "cooked" | "default",
    },
    allIngredients,
  }
}

async function renderNotesToPng(config: NotesConfig, labelHeight: LabelHeight): Promise<string> {
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.top = "0"
  container.style.left = "0"
  container.style.width = "6.0cm"
  container.style.height = labelHeight === "80mm" ? "8.0cm" : "4.0cm"
  container.style.backgroundColor = "white"
  container.style.zIndex = "-1"
  container.style.visibility = "hidden"
  document.body.appendChild(container)

  const root = ReactDOM.createRoot(container)
  root.render(<CustomNotesLabelRenderer config={config} labelHeight={labelHeight} />)
  await new Promise((resolve) => setTimeout(resolve, 250))
  container.style.visibility = "visible"

  const imageData = await toPng(container, {
    cacheBust: true,
    width: container.offsetWidth,
    height: container.offsetHeight,
  })

  root.unmount()
  container.remove()
  return imageData
}

export default function AdHocLabelsPage() {
  const { selectedSize } = useLabelSize()
  const labelHeight = selectedSize.heightKey as LabelHeight
  const { isConnected, selectedPrinter, print } = usePrinter()

  const [mode, setMode] = useState<AdHocMode>("prep")
  const [isPrinting, setIsPrinting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [queue, setQueue] = useState<AdHocQueueItem[]>([])

  const [prepForm, setPrepForm] = useState({
    itemName: "",
    expiryDate: todayPlus(1),
    contains: "",
    prepType: "prep" as PrepType,
  })
  const [notesConfig, setNotesConfig] = useState<NotesConfig>({
    showOuterBorder: true,
    blocks: [
      {
        id: `block-${Date.now()}`,
        text: "Write your note here",
        x: 8,
        y: 10,
        width: 84,
        fontSize: 12,
        bold: false,
        align: "left",
        invert: false,
        border: false,
      },
    ],
  })
  const [selectedBlockId, setSelectedBlockId] = useState<string>(notesConfig.blocks[0].id)
  const [showBlockGuides, setShowBlockGuides] = useState(false)

  const canPrint = queue.length > 0 && isConnected && !!selectedPrinter && !isPrinting

  const livePrepDerived = useMemo(
    () =>
      buildPrepData({
        uid: "adhoc-live-prep",
        mode: "prep",
        quantity: 1,
        itemName: prepForm.itemName || "Custom Label",
        expiryDate: prepForm.expiryDate,
        contains: prepForm.contains,
        prepType: prepForm.prepType,
      }),
    [prepForm]
  )

  const previewPrepItems = useMemo(
    () => queue.filter((q) => q.mode === "prep"),
    [queue]
  )
  const previewNotesItems = useMemo(
    () => queue.filter((q) => q.mode === "notes"),
    [queue]
  )

  const addPrepToQueue = () => {
    if (!prepForm.itemName.trim()) {
      setError("Item name is required for Prep labels.")
      return
    }
    if (!prepForm.expiryDate) {
      setError("Expiry date is required for Prep labels.")
      return
    }
    setError(null)
    setQueue((prev) => [
      ...prev,
      {
        uid: `adhoc-prep-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        mode: "prep",
        quantity: 1,
        itemName: prepForm.itemName.trim(),
        expiryDate: prepForm.expiryDate,
        contains: prepForm.contains,
        prepType: prepForm.prepType,
      },
    ])
  }

  const selectedBlock = useMemo(
    () => notesConfig.blocks.find((b) => b.id === selectedBlockId) || null,
    [notesConfig.blocks, selectedBlockId]
  )

  const updateSelectedBlock = (patch: Partial<NotesBlock>) => {
    if (!selectedBlockId) return
    setNotesConfig((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === selectedBlockId ? { ...b, ...patch } : b)),
    }))
  }

  const addNotesBlock = () => {
    const id = `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const newBlock: NotesBlock = {
      id,
      text: "New text block",
      x: 10,
      y: 10,
      width: 70,
      fontSize: 12,
      bold: false,
      align: "left",
      invert: false,
      border: false,
    }
    setNotesConfig((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        {
          ...newBlock,
          ...findFreeBlockPosition(prev.blocks, newBlock, labelHeight),
        },
      ],
    }))
    setSelectedBlockId(id)
  }

  const removeSelectedBlock = () => {
    if (!selectedBlockId || notesConfig.blocks.length <= 1) return
    const remaining = notesConfig.blocks.filter((b) => b.id !== selectedBlockId)
    setNotesConfig((prev) => ({ ...prev, blocks: remaining }))
    setSelectedBlockId(remaining[0]?.id || "")
  }

  const addNotesToQueue = () => {
    const hasText = notesConfig.blocks.some((b) => b.text.trim().length > 0)
    if (!hasText) {
      setError("Add some text to at least one block.")
      return
    }
    setError(null)
    const snapshot: NotesConfig = {
      showOuterBorder: notesConfig.showOuterBorder,
      blocks: notesConfig.blocks.map((b) => ({ ...b })),
    }
    setQueue((prev) => [
      ...prev,
      {
        uid: `adhoc-note-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        mode: "notes",
        quantity: 1,
        noteText: snapshot.blocks.map((b) => b.text).join("\n"),
        notesConfig: snapshot,
      },
    ])
  }

  const updateQueueQuantity = (uid: string, quantity: number) => {
    setQueue((prev) => prev.map((q) => (q.uid === uid ? { ...q, quantity: Math.max(1, quantity) } : q)))
  }

  const updateQueueExpiry = (uid: string, expiryDate: string) => {
    setQueue((prev) => prev.map((q) => (q.uid === uid ? { ...q, expiryDate } : q)))
  }

  const removeFromQueue = (uid: string) => {
    setQueue((prev) => prev.filter((q) => q.uid !== uid))
  }

  const clearQueue = () => {
    setQueue([])
  }

  const printQueue = async () => {
    if (!selectedPrinter) {
      setError("Please select a printer in the header first.")
      return
    }
    if (!isConnected) {
      setError("Printer is not connected.")
      return
    }
    if (queue.length === 0) {
      setError("Queue is empty.")
      return
    }

    setError(null)
    setIsPrinting(true)
    try {
      const sessionId = `adhoc-${Date.now()}-${Math.random().toString(36).slice(2)}`
      for (const entry of queue) {
        for (let i = 0; i < entry.quantity; i++) {
          if (entry.mode === "prep") {
            const derived = buildPrepData(entry)
            const imageData = await formatLabelForPrintImage(
              derived.printItem,
              [],
              { [derived.printItem.uid]: entry.expiryDate || "" },
              5,
              false,
              "",
              labelHeight,
              derived.allIngredients
            )
            await print(imageData, undefined, { labelHeight })
          } else {
            const imageData = await renderNotesToPng(
              entry.notesConfig || {
                showOuterBorder: true,
                blocks: [
                  {
                    id: "fallback",
                    text: entry.noteText || "",
                    x: 8,
                    y: 10,
                    width: 84,
                    fontSize: labelHeight === "80mm" ? 14 : 11,
                    bold: false,
                    align: "left",
                    invert: false,
                    border: false,
                  },
                ],
              },
              labelHeight
            )
            await print(imageData, undefined, { labelHeight })
          }
        }

        await logAction("print_label", {
          labelType: entry.mode === "prep" ? `adhoc_${entry.prepType || "prep"}` : "adhoc_notes",
          itemId: entry.uid,
          itemName: entry.mode === "prep" ? entry.itemName : "Ad-hoc Note",
          quantity: entry.quantity,
          expiryDate: entry.expiryDate,
          labelHeight,
          sessionId,
        })
      }
      clearQueue()
    } catch (err: any) {
      setError(err?.message || "Failed to print ad-hoc labels")
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <div className="min-h-screen space-y-10 bg-gray-50 px-2 py-8 md:px-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex flex-col gap-10 md:flex-row">
        <div className="min-w-[340px] flex-1">
          <div className="rounded-xl border bg-white p-6 shadow-lg">
            <div className="mb-6 flex w-fit items-center space-x-2 rounded-full bg-gray-100 p-1">
              <button
                className={`rounded-full px-5 py-2 text-base font-medium transition-all ${mode === "prep" ? "bg-purple-600 text-white shadow" : "text-gray-500 hover:text-purple-700"}`}
                onClick={() => setMode("prep")}
              >
                Prep
              </button>
              <button
                className={`rounded-full px-5 py-2 text-base font-medium transition-all ${mode === "notes" ? "bg-purple-600 text-white shadow" : "text-gray-500 hover:text-purple-700"}`}
                onClick={() => setMode("notes")}
              >
                Notes
              </button>
            </div>

            {mode === "prep" ? (
              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight">Ad-hoc Prep Label</h2>
                <input
                  type="text"
                  value={prepForm.itemName}
                  onChange={(e) => setPrepForm((p) => ({ ...p, itemName: e.target.value }))}
                  placeholder="Item name"
                  className="w-full rounded-lg border-2 border-purple-200 px-4 py-2 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
                <input
                  type="date"
                  value={prepForm.expiryDate}
                  onChange={(e) => setPrepForm((p) => ({ ...p, expiryDate: e.target.value }))}
                  className="w-full rounded-lg border-2 border-purple-200 px-4 py-2 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
                <input
                  type="text"
                  value={prepForm.contains}
                  onChange={(e) => setPrepForm((p) => ({ ...p, contains: e.target.value }))}
                  placeholder="Contains (comma separated, e.g. milk, eggs)"
                  className="w-full rounded-lg border-2 border-purple-200 px-4 py-2 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />
                <select
                  value={prepForm.prepType}
                  onChange={(e) => setPrepForm((p) => ({ ...p, prepType: e.target.value as PrepType }))}
                  className="w-full rounded-lg border-2 border-purple-200 px-4 py-2 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                >
                  <option value="prep">Prep</option>
                  <option value="cooked">Cooked</option>
                  <option value="default">Default</option>
                  <option value="ingredients">Ingredients</option>
                </select>
                <Button onClick={addPrepToQueue} variant="purple">
                  Add Prep Label
                </Button>

                <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">Live Preview</h3>
                  <div className="flex justify-center">
                    <LabelRender
                      item={livePrepDerived.printItem}
                      expiry={prepForm.expiryDate || ""}
                      useInitials={false}
                      selectedInitial=""
                      allergens={[]}
                      labelHeight={labelHeight}
                      allIngredients={livePrepDerived.allIngredients}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight">Custom Notes Label</h2>

                <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                  <div className="mb-2 text-sm font-semibold text-purple-900">Blocks</div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {notesConfig.blocks.map((b, idx) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBlockId(b.id)}
                        className={`rounded px-3 py-1 text-xs ${selectedBlockId === b.id ? "bg-purple-600 text-white" : "bg-white text-purple-700 border border-purple-200"}`}
                      >
                        Block {idx + 1}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={addNotesBlock}>
                      Add Block
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={removeSelectedBlock}
                      disabled={notesConfig.blocks.length <= 1}
                    >
                      Remove Block
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm">
                    <span className="mb-1 block text-xs text-gray-600">Show outer border</span>
                    <input
                      type="checkbox"
                      checked={notesConfig.showOuterBorder}
                      onChange={(e) =>
                        setNotesConfig((prev) => ({ ...prev, showOuterBorder: e.target.checked }))
                      }
                      className="h-4 w-4"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block text-xs text-gray-600">Show block guides</span>
                    <input
                      type="checkbox"
                      checked={showBlockGuides}
                      onChange={(e) => setShowBlockGuides(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>
                </div>

                {selectedBlock && (
                  <div className="space-y-3 rounded-lg border border-gray-200 p-3">
                    <textarea
                      value={selectedBlock.text}
                      onChange={(e) => updateSelectedBlock({ text: e.target.value })}
                      placeholder="Type block text..."
                      rows={4}
                      className="w-full rounded-lg border-2 border-purple-200 px-4 py-2 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    />
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="text-xs text-gray-600">
                        X Position (%)
                        <input
                          type="number"
                          min={0}
                          max={90}
                          value={selectedBlock.x}
                          onChange={(e) =>
                            updateSelectedBlock({ x: Math.max(0, Math.min(90, Number(e.target.value))) })
                          }
                          className="mt-1 w-full rounded border px-2 py-1 text-sm"
                        />
                      </label>
                      <label className="text-xs text-gray-600">
                        Y Position (%)
                        <input
                          type="number"
                          min={0}
                          max={90}
                          value={selectedBlock.y}
                          onChange={(e) =>
                            updateSelectedBlock({ y: Math.max(0, Math.min(90, Number(e.target.value))) })
                          }
                          className="mt-1 w-full rounded border px-2 py-1 text-sm"
                        />
                      </label>
                      <label className="text-xs text-gray-600">
                        Width (%)
                        <input
                          type="number"
                          min={10}
                          max={100}
                          value={selectedBlock.width}
                          onChange={(e) =>
                            updateSelectedBlock({
                              width: Math.max(10, Math.min(100, Number(e.target.value))),
                            })
                          }
                          className="mt-1 w-full rounded border px-2 py-1 text-sm"
                        />
                      </label>
                      <label className="text-xs text-gray-600">
                        Font Size
                        <input
                          type="number"
                          min={8}
                          max={28}
                          value={selectedBlock.fontSize}
                          onChange={(e) =>
                            updateSelectedBlock({
                              fontSize: Math.max(8, Math.min(28, Number(e.target.value))),
                            })
                          }
                          className="mt-1 w-full rounded border px-2 py-1 text-sm"
                        />
                      </label>
                      <label className="text-xs text-gray-600">
                        Align
                        <select
                          value={selectedBlock.align}
                          onChange={(e) => updateSelectedBlock({ align: e.target.value as TextAlign })}
                          className="mt-1 w-full rounded border px-2 py-1 text-sm"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      </label>
                      <div className="flex items-center gap-4 pt-5">
                        <label className="text-xs text-gray-600">
                          <input
                            type="checkbox"
                            checked={selectedBlock.bold}
                            onChange={(e) => updateSelectedBlock({ bold: e.target.checked })}
                            className="mr-2"
                          />
                          Bold
                        </label>
                        <label className="text-xs text-gray-600">
                          <input
                            type="checkbox"
                            checked={selectedBlock.invert}
                            onChange={(e) => updateSelectedBlock({ invert: e.target.checked })}
                            className="mr-2"
                          />
                          Invert
                        </label>
                        <label className="text-xs text-gray-600">
                          <input
                            type="checkbox"
                            checked={selectedBlock.border}
                            onChange={(e) => updateSelectedBlock({ border: e.target.checked })}
                            className="mr-2"
                          />
                          Border
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                <Button onClick={addNotesToQueue} variant="purple">
                  Add Notes Label
                </Button>

                <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">Live Preview</h3>
                  <div className="flex justify-center">
                    <CustomNotesLabelRenderer
                      config={notesConfig}
                      labelHeight={labelHeight}
                      showGuides={showBlockGuides}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="min-w-[340px] flex-1">
          <div className="mb-8 max-h-[700px] w-full overflow-y-auto rounded-2xl border-2 border-purple-300 bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between rounded-t-2xl border-b-2 border-purple-200 bg-white px-8 pb-4 pt-8">
              <h2 className="text-2xl font-bold tracking-tight text-purple-800">Print Queue</h2>
              <div className="flex gap-2">
                <Button onClick={printQueue} disabled={!canPrint} variant="purple">
                  {isPrinting ? "Printing..." : "Print Labels"}
                </Button>
                <Button onClick={clearQueue} disabled={queue.length === 0} variant="outline">
                  Clear Queue
                </Button>
              </div>
            </div>
            <div className="px-8 pb-8 pt-4">
              {queue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <p className="text-lg italic text-gray-400">
                    Your print queue is empty.
                    <br />
                    Add ad-hoc labels to get started!
                  </p>
                </div>
              ) : (
                queue.map((entry) => (
                  <div
                    key={entry.uid}
                    className="mb-4 flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 transition-shadow hover:shadow-lg"
                  >
                    <div className="whitespace-normal break-words font-semibold text-gray-900">
                      {entry.mode === "prep"
                        ? entry.itemName
                        : `Notes (${entry.notesConfig?.blocks.length || 1} block${(entry.notesConfig?.blocks.length || 1) > 1 ? "s" : ""})`}
                    </div>
                    {entry.mode === "prep" && (
                      <div className="text-xs text-gray-500">Expires: {entry.expiryDate}</div>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        value={entry.quantity}
                        onChange={(e) => updateQueueQuantity(entry.uid, Number(e.target.value))}
                        className="w-16 rounded-md border border-gray-300 bg-white px-3 py-1 text-center text-sm text-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                      {entry.mode === "prep" && (
                        <input
                          type="date"
                          value={entry.expiryDate || ""}
                          onChange={(e) => updateQueueExpiry(entry.uid, e.target.value)}
                          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        />
                      )}
                      <Button
                        onClick={() => removeFromQueue(entry.uid)}
                        variant="outline"
                        className="border-none bg-red-600 text-white shadow-none hover:bg-red-700 focus:bg-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-semibold">Label Preview</h2>
            {queue.length === 0 ? (
              <p className="text-gray-500">No label selected.</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                {previewPrepItems.map((entry) => {
                  const derived = buildPrepData(entry)
                  return (
                    <LabelRender
                      key={entry.uid}
                      item={derived.printItem}
                      expiry={entry.expiryDate || ""}
                      useInitials={false}
                      selectedInitial=""
                      allergens={[]}
                      labelHeight={labelHeight}
                      allIngredients={derived.allIngredients}
                    />
                  )
                })}
                {previewNotesItems.map((entry) => (
                  <CustomNotesLabelRenderer
                    key={entry.uid}
                    config={
                      entry.notesConfig || {
                        showOuterBorder: true,
                        blocks: [
                          {
                            id: "fallback-preview",
                            text: entry.noteText || "",
                            x: 8,
                            y: 10,
                            width: 84,
                            fontSize: labelHeight === "80mm" ? 14 : 11,
                            bold: false,
                            align: "left",
                            invert: false,
                            border: false,
                          },
                        ],
                      }
                    }
                    labelHeight={labelHeight}
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


