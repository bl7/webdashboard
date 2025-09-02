"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import BulkPrintManager from "@/components/bulk-print/BulkPrintManager"
import BulkPrintListDetail from "@/components/bulk-print/BulkPrintListDetail"
import BulkPrintItemSelector from "@/components/bulk-print/BulkPrintItemSelector"
import { PrintQueueItem } from "@/types/print"

export default function BulkPrintPage() {
  const router = useRouter()
  const [currentView, setCurrentView] = useState<"manager" | "list-detail">("manager")
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [isItemSelectorOpen, setIsItemSelectorOpen] = useState(false)

  const handleListSelected = (listId: string) => {
    setSelectedListId(listId)
    setCurrentView("list-detail")
  }

  const handleViewList = (listId: string) => {
    setSelectedListId(listId)
    setCurrentView("list-detail")
  }

  const handleBackToManager = () => {
    setCurrentView("manager")
    setSelectedListId(null)
  }

  const handlePrint = (items: PrintQueueItem[]) => {
    // Navigate to the print page with the items
    // We'll need to pass the items somehow - could use localStorage or context
    localStorage.setItem("bulkPrintQueue", JSON.stringify(items))
    router.push("/dashboard/print")
  }

  const handleItemsAdded = () => {
    // Refresh the list detail view
    // This could trigger a refetch in the BulkPrintListDetail component
    window.location.reload() // Simple approach for now
  }

  if (currentView === "list-detail" && selectedListId) {
    return (
      <div className="container mx-auto p-6">
        <BulkPrintListDetail
          listId={selectedListId}
          onBack={handleBackToManager}
          onPrint={handlePrint}
          onOpenItemSelector={() => setIsItemSelectorOpen(true)}
        />
        <BulkPrintItemSelector
          listId={selectedListId}
          isOpen={isItemSelectorOpen}
          onClose={() => setIsItemSelectorOpen(false)}
          onItemsAdded={handleItemsAdded}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <BulkPrintManager onPrintList={handleListSelected} onViewList={handleViewList} />
    </div>
  )
}
