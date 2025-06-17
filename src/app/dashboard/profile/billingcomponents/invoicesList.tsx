import React, { useState } from "react"
import { DownloadIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Invoice } from "@/types/invoice"

export interface InvoiceLine {
  id: string
  amount: number
  description?: string
}

interface Props {
  invoices: Invoice[]
  itemsPerPage: number // Made required since it should be passed from parent
}

export default function PaymentHistory({ invoices, itemsPerPage }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)

  // Pagination calculations
  const totalPages = Math.ceil(invoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentInvoices = invoices.slice(startIndex, endIndex)

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  // Toggle selection of a single invoice
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // Toggle select all invoices (current page only)
  const toggleSelectAll = () => {
    const currentPageIds = currentInvoices.map((inv) => inv.id)
    const allCurrentSelected = currentPageIds.every((id) => selectedIds.has(id))

    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (allCurrentSelected) {
        // Deselect all on current page
        currentPageIds.forEach((id) => newSet.delete(id))
      } else {
        // Select all on current page
        currentPageIds.forEach((id) => newSet.add(id))
      }
      return newSet
    })
  }

  // Download selected invoices - confirm each one individually
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

    // Download each invoice with individual confirmation
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
        <button
          onClick={downloadSelected}
          disabled={selectedIds.size === 0}
          className={`rounded px-3 py-1 text-sm ${
            selectedIds.size === 0
              ? "cursor-not-allowed bg-gray-300 text-gray-600"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Download Selected
        </button>
      </div>

      {/* Table Head */}
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
            const planName = entry.description || entry.metadata?.plan || "Invoice"
            const isSelected = selectedIds.has(entry.id)

            return (
              <div
                key={entry.id}
                className="grid grid-cols-12 items-center rounded-xl bg-white px-4 py-3 shadow-sm transition hover:shadow"
              >
                {/* Checkbox */}
                <div className="col-span-1">
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(entry.id)} />
                </div>

                {/* Plan */}
                <div className="col-span-4 text-sm font-medium">
                  {entry.lines?.data && entry.lines.data.length > 0 ? (
                    <div className="space-y-1">
                      {entry.lines.data.map((line, index) => (
                        <div key={line.id} className={index > 0 ? "text-xs text-gray-600" : ""}>
                          {line.description || "Plan Item"}
                        </div>
                      ))}
                    </div>
                  ) : (
                    entry.description || "Invoice"
                  )}
                </div>

                {/* Amount */}
                <div className="col-span-2 text-sm">${amountFormatted}</div>

                {/* Status */}
                <div className="col-span-2 text-sm">{entry.status}</div>

                {/* Date */}
                <div className="col-span-1 mr-3 text-sm">{dateFormatted}</div>

                {/* Download Icon */}
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
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </div>

                {/* Invoice line items - removed since we're showing them in the plan column now */}
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, invoices.length)} of {invoices.length}{" "}
            invoices
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 rounded border px-3 py-2 text-sm ${
                currentPage === 1
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <ChevronLeftIcon size={16} />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber
                if (totalPages <= 5) {
                  pageNumber = i + 1
                } else if (currentPage <= 3) {
                  pageNumber = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i
                } else {
                  pageNumber = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`min-w-[40px] rounded border px-3 py-2 text-sm ${
                      currentPage === pageNumber
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 rounded border px-3 py-2 text-sm ${
                currentPage === totalPages
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              Next
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
