"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AllergenMatrixSheet } from "@/components/dashboard/AllergenMatrixSheet"
import { MATRIX_ROWS_PER_PAGE, buildAllergenMatrix } from "@/lib/allergen-matrix"

const RECORDED = [
  { id: "celery", label: "Celery", name: "Celery" },
  { id: "gluten", label: "Cereals containing gluten", name: "Cereals containing gluten" },
  { id: "crustaceans", label: "Crustaceans", name: "Crustaceans" },
  { id: "eggs", label: "Eggs", name: "Eggs" },
  { id: "fish", label: "Fish", name: "Fish" },
  { id: "lupin", label: "Lupin", name: "Lupin" },
  { id: "milk", label: "Milk", name: "Milk" },
  { id: "molluscs", label: "Molluscs", name: "Molluscs" },
  { id: "mustard", label: "Mustard", name: "Mustard" },
  { id: "nuts", label: "Nuts", name: "Nuts" },
  { id: "peanuts", label: "Peanuts", name: "Peanuts" },
  { id: "sesame", label: "Sesame", name: "Sesame" },
  { id: "soya", label: "Soya", name: "Soya" },
  { id: "sulphites", label: "Sulphur dioxide and sulphites", name: "Sulphur dioxide" },
] as const

type Dish = {
  id: string
  name: string
  recorded: string[]
  other: string
}

type Draft = { name: string; recorded: string[]; other: string }

const emptyDraft = (): Draft => ({ name: "", recorded: [], other: "" })

function recordedLabels(dish: Pick<Dish, "recorded" | "other">) {
  const named = dish.recorded.flatMap((id) => {
    const label = RECORDED.find((item) => item.id === id)?.label
    return label ? [label] : []
  })
  const extra = dish.other
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean)
  return [...named, ...extra]
}

function chunkRows<T>(items: T[], size: number) {
  const pages: T[][] = []
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size))
  return pages
}

export function AllergenMatrixTool() {
  const nextId = useRef(1)
  const captureRef = useRef<HTMLDivElement>(null)
  const [businessName, setBusinessName] = useState("Your kitchen")
  const [dishes, setDishes] = useState<Dish[]>([])
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [message, setMessage] = useState("")

  const updatedAt = useMemo(
    () =>
      new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    []
  )

  const named = dishes.filter((dish) => dish.name.trim())
  const { columns, rows } = useMemo(
    () =>
      buildAllergenMatrix(
        named.map((dish) => ({
          menuItemID: dish.id,
          menuItemName: dish.name.trim(),
          allergens: [
            ...dish.recorded.map((id) => ({
              allergenName: RECORDED.find((item) => item.id === id)?.name || id,
            })),
            ...dish.other
              .split(",")
              .map((name) => name.trim())
              .filter(Boolean)
              .map((allergenName) => ({ allergenName })),
          ],
        }))
      ),
    [named]
  )
  const pages = chunkRows(rows, MATRIX_ROWS_PER_PAGE)
  const sheetPages = pages.length > 0 ? pages : [[]]

  const saveDish = () => {
    const name = draft.name.trim()
    if (!name) {
      setMessage("Enter the menu item name first.")
      return
    }
    setMessage("")
    if (editingId) {
      setDishes((current) =>
        current.map((dish) =>
          dish.id === editingId ? { ...dish, name, recorded: draft.recorded, other: draft.other } : dish
        )
      )
      setEditingId(null)
    } else {
      const id = String(nextId.current++)
      setDishes((current) => [...current, { id, name, recorded: draft.recorded, other: draft.other }])
    }
    setDraft(emptyDraft())
  }

  const editDish = (dish: Dish) => {
    setEditingId(dish.id)
    setDraft({ name: dish.name, recorded: dish.recorded, other: dish.other })
    setMessage("")
  }

  const download = async () => {
    if (rows.length === 0) {
      setMessage("Add a menu item before downloading the chart.")
      return
    }
    const root = captureRef.current
    if (!root) return
    setDownloading(true)
    setMessage("")
    try {
      const [{ jsPDF }, { toPng }] = await Promise.all([import("jspdf"), import("html-to-image")])
      const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-matrix-page]"))
      if (nodes.length === 0) throw new Error("Nothing to export")
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" })
      const width = pdf.internal.pageSize.getWidth()
      const height = pdf.internal.pageSize.getHeight()
      for (let i = 0; i < nodes.length; i++) {
        const dataUrl = await toPng(nodes[i], {
          cacheBust: true,
          pixelRatio: 2,
          backgroundColor: "#fbf8f1",
        })
        if (i > 0) pdf.addPage("a3", "landscape")
        pdf.addImage(dataUrl, "PNG", 0, 0, width, height, undefined, "FAST")
      }
      const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      pdf.save(`allergen-matrix-${slug || "kitchen"}-${new Date().toISOString().slice(0, 10)}.pdf`)
      setMessage("Chart downloaded. A blank cell means nothing is recorded there.")
    } catch (error) {
      console.error(error)
      setMessage("Could not download the PDF. Check the preview, then try the download again.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-3 text-3xl font-black tracking-tight text-mkt-ink">Try the chart with your menu.</h2>
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-mkt-ink8">
          Add a dish and choose the allergens recorded on it. The preview and the PDF use the same
          chart the dashboard generates. A filled circle means that allergen is recorded. A blank
          cell means nothing is recorded, not that the dish is free from it.
        </p>

        <label className="mb-6 block max-w-sm text-sm font-semibold text-mkt-ink">
          Kitchen name on the chart
          <input
            className="mt-1 w-full rounded-md border border-mkt-steel1 bg-white px-3 py-2 font-normal"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
          />
        </label>

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <form
            className="rounded-lg border border-mkt-steel1 bg-mkt-canvas p-5"
            onSubmit={(event) => {
              event.preventDefault()
              saveDish()
            }}
          >
            <h3 className="text-lg font-extrabold text-mkt-ink">
              {editingId ? "Edit this menu item" : "Add a menu item"}
            </h3>
            <label className="mt-4 block text-sm font-semibold text-mkt-ink">
              Name
              <input
                className="mt-1 w-full rounded-md border border-mkt-steel1 bg-white px-3 py-2 font-normal"
                value={draft.name}
                placeholder="Fish pie"
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
              />
            </label>
            <p className="mb-2 mt-4 text-sm font-semibold text-mkt-ink">Allergens recorded on it</p>
            <div className="flex flex-wrap gap-2">
              {RECORDED.map((allergen) => {
                const on = draft.recorded.includes(allergen.id)
                return (
                  <button
                    key={allergen.id}
                    type="button"
                    aria-pressed={on}
                    className={
                      on
                        ? "rounded-full bg-mkt-ink px-3 py-1.5 text-sm font-semibold text-white"
                        : "rounded-full border border-mkt-steel1 bg-white px-3 py-1.5 text-sm text-mkt-ink"
                    }
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        recorded: on
                          ? current.recorded.filter((id) => id !== allergen.id)
                          : [...current.recorded, allergen.id],
                      }))
                    }
                  >
                    {allergen.label}
                  </button>
                )
              })}
            </div>
            <label className="mt-4 block text-sm font-semibold text-mkt-ink">
              Other recorded allergen
              <input
                className="mt-1 w-full rounded-md border border-mkt-steel1 bg-white px-3 py-2 font-normal"
                placeholder="Separate more than one with a comma"
                value={draft.other}
                onChange={(event) => setDraft((current) => ({ ...current, other: event.target.value }))}
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="submit" className="rounded-md bg-mkt-ink px-4 py-2 text-sm font-semibold text-white">
                {editingId ? "Save changes" : "Add to chart"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="rounded-md border border-mkt-ink px-4 py-2 text-sm font-semibold text-mkt-ink"
                  onClick={() => {
                    setEditingId(null)
                    setDraft(emptyDraft())
                  }}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div className="rounded-lg border border-mkt-steel1 p-5">
            <h3 className="text-lg font-extrabold text-mkt-ink">
              On the chart{dishes.length > 0 ? ` · ${dishes.length}` : ""}
            </h3>
            {dishes.length === 0 ? (
              <p className="mt-3 text-sm leading-relaxed text-mkt-ink8">
                Nothing added yet. Add a menu item and it will appear here and on the chart.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-mkt-steel1">
                {dishes.map((dish) => {
                  const labels = recordedLabels(dish)
                  return (
                    <li key={dish.id} className="flex items-start justify-between gap-3 py-3">
                      <div>
                        <p className="font-semibold text-mkt-ink">{dish.name}</p>
                        <p className="mt-1 text-sm leading-relaxed text-mkt-ink8">
                          {labels.length > 0 ? labels.join(", ") : "No allergens recorded"}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          className="text-sm font-semibold text-mkt-ink underline"
                          onClick={() => editDish(dish)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-sm font-semibold text-mkt-ink underline"
                          onClick={() => {
                            setDishes((current) => current.filter((item) => item.id !== dish.id))
                            if (editingId === dish.id) {
                              setEditingId(null)
                              setDraft(emptyDraft())
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="rounded-md bg-mkt-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            onClick={download}
            disabled={downloading || rows.length === 0}
          >
            {downloading ? "Preparing PDF…" : "Download PDF"}
          </button>
        </div>
        {message ? <p className="mt-3 text-sm text-mkt-ink8">{message}</p> : null}

        {rows.length > 0 ? (
          <div className="mt-10 space-y-6">
            {sheetPages.map((pageRows, index) => (
              <PreviewSheet key={pageRows.map((row) => row.id).join("-") || "empty"}>
                <AllergenMatrixSheet
                  businessName={businessName.trim() || "Your kitchen"}
                  updatedAt={updatedAt}
                  columns={columns}
                  rows={pageRows}
                  page={index + 1}
                  pageCount={sheetPages.length}
                />
              </PreviewSheet>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-mkt-ink8">Name a menu item to see the chart.</p>
        )}

        {rows.length > 0 ? (
          <div
            ref={captureRef}
            aria-hidden="true"
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              zIndex: -1,
              width: 0,
              height: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            {sheetPages.map((pageRows, index) => (
              <AllergenMatrixSheet
                key={index}
                captureId={`page-${index + 1}`}
                businessName={businessName.trim() || "Your kitchen"}
                updatedAt={updatedAt}
                columns={columns}
                rows={pageRows}
                page={index + 1}
                pageCount={sheetPages.length}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

const HERO_DISHES = [
  {
    menuItemID: "1",
    menuItemName: "Cheddar sandwich",
    allergens: [{ allergenName: "Cereals containing gluten" }, { allergenName: "Milk" }],
  },
  {
    menuItemID: "2",
    menuItemName: "Fish pie",
    allergens: [{ allergenName: "Fish" }, { allergenName: "Milk" }],
  },
  {
    menuItemID: "3",
    menuItemName: "Prawn linguine",
    allergens: [{ allergenName: "Crustaceans" }, { allergenName: "Eggs" }, { allergenName: "Cereals containing gluten" }],
  },
]

export function AllergenMatrixHeroChart() {
  const { columns, rows } = buildAllergenMatrix(HERO_DISHES)
  return (
    <figure className="w-full">
      <PreviewSheet>
        <AllergenMatrixSheet
          businessName="Sample kitchen"
          updatedAt="9 October 2026"
          columns={columns}
          rows={rows}
          page={1}
          pageCount={1}
        />
      </PreviewSheet>
      <figcaption className="mt-3 text-center text-xs leading-relaxed text-mkt-steel md:text-left">
        The chart the dashboard downloads as a PDF. These dishes are a sample, not a compliance record.
      </figcaption>
    </figure>
  )
}

function PreviewSheet({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState<number>()

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    const update = () => {
      const next = Math.min(1, outer.clientWidth / 1512)
      setScale(next)
      setHeight(inner.offsetHeight * next)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(outer)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={outerRef} className="w-full min-w-0">
      <div className="relative w-full overflow-hidden" style={{ height: height || undefined }}>
        <div
          ref={innerRef}
          className="absolute left-0 top-0"
          style={{ width: 1512, transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
