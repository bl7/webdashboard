'use client'
import React, { useEffect, useState, useCallback } from "react"
import { format } from "date-fns"
import { useDarkMode } from "../context/DarkModeContext"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface Cancellation {
  id: number
  user_id: string
  subscription_id: string | null
  reason: string
  cancelled_at: string
  email?: string
  company_name?: string
}

const PAGE_SIZE = 20

const CancellationsPage: React.FC = () => {
  const { isDarkMode } = useDarkMode()
  const [cancellations, setCancellations] = useState<Cancellation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [modalReason, setModalReason] = useState<string | null>(null)
  const [modalCancellation, setModalCancellation] = useState<Cancellation | null>(null)

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(handler)
  }, [searchInput])

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    })
    if (search) params.append("search", search)
    fetch(`/api/subscription_better/cancel?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setCancellations(data.cancellations || [])
        setTotal(data.total || 0)
        setLoading(false)
      })
      .catch(err => {
        setError("Failed to load cancellations")
        setLoading(false)
      })
  }, [search, page, pageSize])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className={`p-8 min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h1 className="text-2xl font-bold mb-6">Subscription Cancellations</h1>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <input
          type="text"
          className={`border rounded px-3 py-2 w-full sm:w-64 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
          placeholder="Search by user, subscription, reason, or email..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <span className="text-gray-500 text-sm ml-auto">
          {total} result{total !== 1 ? "s" : ""}
        </span>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto rounded-lg border mb-6 transition-colors duration-200"
            style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
            <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                <tr>
                  <th className="px-4 py-2 border-b">User ID</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Company</th>
                  <th className="px-4 py-2 border-b">Subscription ID</th>
                  <th className="px-4 py-2 border-b">Reason</th>
                  <th className="px-4 py-2 border-b">Cancelled At</th>
                </tr>
              </thead>
              <tbody>
                {cancellations.map((c) => (
                  <tr key={c.id} className={isDarkMode ? "border-b border-gray-700 hover:bg-gray-800" : "border-b hover:bg-gray-50"}>
                    <td className="px-4 py-2 font-mono text-xs">{c.user_id}</td>
                    <td className="px-4 py-2 text-xs">{c.email || <span className="text-gray-400">N/A</span>}</td>
                    <td className="px-4 py-2 text-xs">{c.company_name || <span className="text-gray-400">N/A</span>}</td>
                    <td className="px-4 py-2 font-mono text-xs">{c.subscription_id || "-"}</td>
                    <td className="px-4 py-2 max-w-xs truncate cursor-pointer text-xs text-purple-600 hover:underline" title={c.reason} onClick={() => { setModalReason(c.reason); setModalCancellation(c); }}>
                      {c.reason}
                    </td>
                    <td className="px-4 py-2 text-xs">{format(new Date(c.cancelled_at), "yyyy-MM-dd HH:mm")}</td>
                  </tr>
                ))}
                {cancellations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">No cancellations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Modal for full reason */}
          <Dialog open={!!modalReason} onOpenChange={open => { if (!open) { setModalReason(null); setModalCancellation(null); } }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancellation Details</DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-2 text-base text-foreground mt-2">
                    {modalCancellation && (
                      <>
                        <div><span className="font-semibold">Email:</span> {modalCancellation.email || <span className="text-gray-400">N/A</span>}</div>
                        <div><span className="font-semibold">Company:</span> {modalCancellation.company_name || <span className="text-gray-400">N/A</span>}</div>
                        <div><span className="font-semibold">Created At:</span> {format(new Date(modalCancellation.cancelled_at), "yyyy-MM-dd HH:mm")}</div>
                        <div><span className="font-semibold">Reason:</span> <span className="whitespace-pre-line">{modalCancellation.reason}</span></div>
                      </>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Page {page} of {totalPages || 1}
            </div>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 border rounded disabled:opacity-50 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'}`}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
                <button
                  key={p}
                  className={`px-3 py-1 border rounded transition-colors duration-200 ${p === page ? (isDarkMode ? 'bg-gray-700 font-bold' : 'bg-gray-200 font-bold') : (isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900')}`}
                  onClick={() => setPage(p)}
                  disabled={p === page}
                >
                  {p}
                </button>
              ))}
              <button
                className={`px-3 py-1 border rounded disabled:opacity-50 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-100'}`}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CancellationsPage 