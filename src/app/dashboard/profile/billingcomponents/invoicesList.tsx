import React, { useState, useEffect } from "react"
import { DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface Props {
  userId: string
  itemsPerPage: number
}

export default function PaymentHistory({ userId, itemsPerPage }: Props) {
  const [invoices, setInvoices] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!userId) return

    const token = localStorage.getItem("token")
    if (!token) return

    fetch(`/api/subscription_better/invoices?user_id=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setInvoices(data.invoices || []))
      .catch((error) => {
        console.error("Error fetching invoices:", error)
        setInvoices([])
      })
  }, [userId])

  const totalPages = Math.ceil(invoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInvoices = invoices.slice(startIndex, endIndex)

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1))
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1))

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }
  const toggleSelectAll = () => {
    const currentPageIds = currentInvoices.map((inv) => inv.id)
    const allCurrentSelected = currentPageIds.every((id) => selectedIds.has(id))
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (allCurrentSelected) currentPageIds.forEach((id) => newSet.delete(id))
      else currentPageIds.forEach((id) => newSet.add(id))
      return newSet
    })
  }
  const downloadSelected = async () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one invoice to download.")
      return
    }
    const invoicesToDownload = invoices.filter((inv) => selectedIds.has(inv.id) && inv.invoice_pdf)
    if (invoicesToDownload.length === 0) {
      alert("Selected invoices do not have downloadable PDFs.")
      return
    }
    for (const inv of invoicesToDownload) {
      if (inv.invoice_pdf) {
        const planName = inv.description || inv.lines?.data?.[0]?.description || `Invoice ${inv.id}`
        const proceed = confirm(`Download invoice: ${planName}?`)
        if (proceed) {
          const link = document.createElement("a")
          link.href = inv.invoice_pdf
          link.download = `invoice-${inv.id}.pdf`
          link.target = "_blank"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    }
  }
  const allCurrentSelected =
    currentInvoices.length > 0 && currentInvoices.every((inv) => selectedIds.has(inv.id))
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Billing history</h2>
          {selectedIds.size > 0 && (
            <span className="text-sm text-gray-600">{selectedIds.size} selected</span>
          )}
        </div>
        <Button
          onClick={downloadSelected}
          disabled={selectedIds.size === 0}
          variant="purple"
          className="px-3 py-1 text-sm"
        >
          Download Selected
        </Button>
      </div>
      <div className="hidden grid-cols-12 px-4 py-2 text-sm font-medium text-muted-foreground md:grid">
        <div className="col-span-1">
          <Checkbox checked={allCurrentSelected} onCheckedChange={toggleSelectAll} />
        </div>
        <div className="col-span-4">Plan</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Date</div>
        <div className="col-span-1 text-right"></div>
      </div>
      {invoices.length === 0 ? (
        <div className="text-sm text-muted-foreground">No invoices found.</div>
      ) : (
        <div className="space-y-2">
          {currentInvoices.map((entry) => {
            const amountFormatted = (entry.total / 100).toFixed(2)
            const dateFormatted = new Date(entry.created * 1000).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
            const planName = entry.description || entry.lines?.data?.[0]?.description || "Invoice"
            const isSelected = selectedIds.has(entry.id)
            return (
              <div
                key={entry.id}
                className="grid grid-cols-12 items-center rounded-xl bg-white px-4 py-3 shadow-sm transition hover:shadow"
              >
                <div className="col-span-1">
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(entry.id)} />
                </div>
                <div className="col-span-4 text-sm font-medium">{planName}</div>
                <div className="col-span-2 text-sm">${amountFormatted}</div>
                <div className="col-span-2 text-sm">{entry.status}</div>
                <div className="col-span-2 text-sm">{dateFormatted}</div>
                <div className="col-span-1 text-right">
                  {entry.invoice_pdf ? (
                    <a
                      href={entry.invoice_pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                      aria-label={`Download invoice ${entry.id} PDF`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DownloadIcon size={16} />
                    </a>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon size={16} />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon size={16} />
          </Button>
        </div>
      )}
    </div>
  )
}
