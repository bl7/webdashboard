"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"

// Dynamically import the existing page components
const PrintLabelPage = dynamic(() => import("../print/page"), { ssr: false })
const PPDSPage = dynamic(() => import("../ppds/page"), { ssr: false })
const BulkPrintPage = dynamic(() => import("../bulk-print/page"), { ssr: false })

export default function PrintManagerPage() {
  const [activeTab, setActiveTab] = useState("print-labels")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="print-labels">Print Labels</TabsTrigger>
          <TabsTrigger value="ppds">PPDS</TabsTrigger>
          <TabsTrigger value="bulk-print">Bulk Print</TabsTrigger>
        </TabsList>

        <TabsContent value="print-labels" className="mt-6">
          <PrintLabelPage />
        </TabsContent>

        <TabsContent value="ppds" className="mt-6">
          <PPDSPage />
        </TabsContent>

        <TabsContent value="bulk-print" className="mt-6">
          <BulkPrintPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
