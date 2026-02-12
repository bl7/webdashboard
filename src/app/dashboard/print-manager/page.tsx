"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LabelSizeProvider } from "@/context/LabelSizeContext"
import { LabelSizeSelector } from "@/components/LabelSizeSelector"
import { usePrinter } from "@/context/PrinterContext"
import dynamic from "next/dynamic"

// Dynamically import the existing page components
const PrintLabelPage = dynamic(() => import("../print/page"), { ssr: false })
const AdHocLabelsPage = dynamic(() => import("../ad-hoc-labels/page"), { ssr: false })
const BulkPrintPage = dynamic(() => import("../bulk-print/page"), { ssr: false })
// PPDS tab hidden for now
// const PPDSPage = dynamic(() => import("../ppds/page"), { ssr: false })

function getPrinterName(printer: any): string {
  if (!printer) return ""
  if (typeof printer === "string") return printer
  if (typeof printer.name === "object" && typeof printer.name.name === "string")
    return printer.name.name
  if (typeof printer.name === "string") return printer.name
  return ""
}

export default function PrintManagerPage() {
  const [activeTab, setActiveTab] = useState("print-labels")
  const { isConnected, printers, defaultPrinter, selectedPrinter, selectPrinter, loading, error } =
    usePrinter()

  // Get current selected printer name for display
  const selectedPrinterName = selectedPrinter ? getPrinterName(selectedPrinter) : ""

  // Auto-select default printer if available and none selected
  React.useEffect(() => {
    if (defaultPrinter && !selectedPrinter) {
      selectPrinter(defaultPrinter)
    }
  }, [defaultPrinter, selectedPrinter, selectPrinter])

  return (
    <LabelSizeProvider>
      <div className="space-y-6">
        {/* Header with Title, Printer Selection, and Label Size Selector */}
        <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-lg">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Print Manager</h1>
          <div className="flex items-center gap-6">
            {/* Printer Status and Selection */}
            <div className="flex items-center gap-3">
              {isConnected ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-700">Connected</span>
                  </div>
                  {printers.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Printer:</label>
                      <select
                        value={selectedPrinterName}
                        onChange={(e) => {
                          const printer = printers.find(
                            (p: any) => getPrinterName(p) === e.target.value
                          )
                          selectPrinter(printer || null)
                        }}
                        className="rounded border border-purple-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
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
                      <span className="text-xs text-gray-500">
                        {printers.length} printer{printers.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <span className="text-sm text-gray-600">No printers detected</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-red-600">Disconnected</span>
                </div>
              )}
            </div>
            <LabelSizeSelector />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="print-labels">Print Labels</TabsTrigger>
            <TabsTrigger value="ad-hoc-labels">Ad-hoc Labels</TabsTrigger>
            {/* PPDS tab hidden for now */}
            {/* <TabsTrigger value="ppds">PPDS</TabsTrigger> */}
            <TabsTrigger value="bulk-print">Bulk Print</TabsTrigger>
          </TabsList>

          <TabsContent value="print-labels" className="mt-6">
            <PrintLabelPage />
          </TabsContent>

          <TabsContent value="ad-hoc-labels" className="mt-6">
            <AdHocLabelsPage />
          </TabsContent>

          {/* PPDS tab hidden for now */}
          {/* <TabsContent value="ppds" className="mt-6">
            <PPDSPage />
          </TabsContent> */}

          <TabsContent value="bulk-print" className="mt-6">
            <BulkPrintPage />
          </TabsContent>
        </Tabs>
      </div>
    </LabelSizeProvider>
  )
}
