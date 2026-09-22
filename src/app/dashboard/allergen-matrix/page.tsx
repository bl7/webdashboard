"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Download, Printer } from "lucide-react"
import { toast } from "sonner"
import { Button, Input } from "@/components/ui"
import AppLoader from "@/components/AppLoader"
import { AllergenMatrixSheet } from "@/components/dashboard/AllergenMatrixSheet"
import { useAuth } from "@/context/AuthContext"
import { useAllergens } from "@/hooks/useAllergens"
import { useMenuItems } from "@/hooks/useMenuItem"
import {
  MATRIX_ROWS_PER_PAGE,
  buildAllergenMatrix,
} from "@/lib/allergen-matrix"

function formatUpdatedAt(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function ScaledSheet({ children }: { children: React.ReactNode }) {
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
    const ro = new ResizeObserver(update)
    ro.observe(outer)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={outerRef} className="mb-6 overflow-hidden last:mb-0">
      <div style={{ height }}>
        <div
          ref={innerRef}
          className="shadow-lg"
          style={{ width: 1512, transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default function AllergenMatrixPage() {
  const [query, setQuery] = useState("")
  const [downloading, setDownloading] = useState(false)
  const captureRef = useRef<HTMLDivElement>(null)
  const { profile, name } = useAuth()
  const { menuItems, loading: menuLoading, error: menuError } = useMenuItems()
  const { customAllergens, isLoading: allergensLoading, error: allergensError } = useAllergens()

  const businessName = profile?.company_name?.trim() || name?.trim() || "Kitchen"
  const updatedAt = useMemo(() => formatUpdatedAt(new Date()), [])

  const { columns, rows } = useMemo(
    () =>
      buildAllergenMatrix(
        menuItems,
        customAllergens.map((a) => ({ name: a.name }))
      ),
    [menuItems, customAllergens]
  )

  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) => row.name.toLowerCase().includes(q))
  }, [query, rows])

  const previewPages = useMemo(() => {
    if (visibleRows.length === 0) return []
    const pages = []
    for (let i = 0; i < visibleRows.length; i += MATRIX_ROWS_PER_PAGE) {
      pages.push(visibleRows.slice(i, i + MATRIX_ROWS_PER_PAGE))
    }
    return pages
  }, [visibleRows])

  const printPages = useMemo(() => {
    if (rows.length === 0) return []
    const pages = []
    for (let i = 0; i < rows.length; i += MATRIX_ROWS_PER_PAGE) {
      pages.push(rows.slice(i, i + MATRIX_ROWS_PER_PAGE))
    }
    return pages
  }, [rows])

  const handlePrint = () => {
    if (rows.length === 0) {
      toast.error("Add menu items before printing the allergen chart.")
      return
    }
    window.print()
  }

  const handleDownloadPdf = async () => {
    if (rows.length === 0) {
      toast.error("Add menu items before downloading the allergen chart.")
      return
    }

    const root = captureRef.current
    if (!root) return

    setDownloading(true)
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
      toast.success("Allergen chart downloaded")
    } catch (error) {
      console.error(error)
      toast.error("Could not download the PDF. Try Print and save as PDF instead.")
    } finally {
      setDownloading(false)
    }
  }

  if ((menuLoading && menuItems.length === 0) || allergensLoading) {
    return <AppLoader message="Loading allergen matrix..." />
  }

  if (menuError || allergensError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-600">{menuError || allergensError}</p>
      </div>
    )
  }

  return (
    <div className="allergen-matrix-page space-y-6">
      <style>{`
        @media print {
          @page { size: A3 landscape; margin: 8mm; }
          body { background: #fff !important; }
          body * { visibility: hidden; }
          .allergen-matrix-print, .allergen-matrix-print * { visibility: visible; }
          .allergen-matrix-print {
            position: absolute;
            inset: 0;
            left: 0 !important;
            top: 0 !important;
            width: auto !important;
            height: auto !important;
            overflow: visible !important;
          }
          .allergen-matrix-print article {
            page-break-after: always;
            break-after: page;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            min-height: 0 !important;
          }
          .allergen-matrix-print article:last-child {
            page-break-after: auto;
            break-after: auto;
          }
        }
      `}</style>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold sm:text-2xl">Allergen matrix</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Kitchen chart from your menu items. Download or print for service.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrint} disabled={rows.length === 0}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownloadPdf} disabled={downloading || rows.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            {downloading ? "Preparing PDF..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow">
          <p className="text-muted-foreground">Dishes</p>
          <h3 className="text-2xl font-bold">{rows.length}</h3>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow">
          <p className="text-muted-foreground">Allergen columns</p>
          <h3 className="text-2xl font-bold">{columns.length}</h3>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow">
          <p className="text-muted-foreground">With recorded allergens</p>
          <h3 className="text-2xl font-bold">{rows.filter((row) => row.contains.length > 0).length}</h3>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search dishes..."
          className="w-full max-w-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          PDF and print always include the full menu, not the search filter.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
          <p className="text-lg font-semibold">No menu items yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Add dishes and their ingredients first. The chart uses the allergens already recorded on
            each menu item.
          </p>
          <Button asChild className="mt-5">
            <Link href="/dashboard/menuitem">Go to menu items</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border bg-[#ebe6db] p-4 shadow-sm">
          {previewPages.map((pageRows, index) => (
            <ScaledSheet key={index}>
              <AllergenMatrixSheet
                businessName={businessName}
                updatedAt={updatedAt}
                columns={columns}
                rows={pageRows}
                page={index + 1}
                pageCount={previewPages.length}
              />
            </ScaledSheet>
          ))}
        </div>
      )}

      <div
        ref={captureRef}
        className="allergen-matrix-print"
        style={{ position: "absolute", left: -20000, top: 0, width: 1512 }}
        aria-hidden="true"
      >
        {printPages.map((pageRows, index) => (
          <AllergenMatrixSheet
            key={index}
            captureId={`page-${index + 1}`}
            businessName={businessName}
            updatedAt={updatedAt}
            columns={columns}
            rows={pageRows}
            page={index + 1}
            pageCount={printPages.length}
          />
        ))}
      </div>
    </div>
  )
}
