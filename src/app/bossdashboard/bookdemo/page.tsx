'use client'
import React, { useEffect, useState } from 'react'

interface BookDemoRequest {
  id: number
  name: string
  email: string
  phone: string
  company: string
  role: string
  message: string
  source: string
  created_at: string
  attended?: boolean
}

export default function BossBookDemoPage() {
  const [requests, setRequests] = useState<BookDemoRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchRequests = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bookdemo')
      if (!res.ok) throw new Error('Failed to fetch requests')
      setRequests(await res.json())
    } catch (err: any) {
      setError(err.message || 'Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleToggleAttended = async (id: number, attended: boolean) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/bookdemo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attended: !attended }),
      })
      if (!res.ok) throw new Error('Failed to update')
      await fetchRequests()
    } catch (err) {
      alert('Failed to update attended status')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this request?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/bookdemo/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setRequests(requests => requests.filter(r => r.id !== id))
    } catch (err) {
      alert('Failed to delete request')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">Book Demo Requests</h1>
      {loading ? (
        <div className="dark:text-gray-200">Loading...</div>
      ) : error ? (
        <div className="text-red-600 dark:text-red-400">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white dark:bg-gray-900 rounded shadow dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2 text-left dark:text-gray-200">Name</th>
                <th className="p-2 text-left dark:text-gray-200">Email</th>
                <th className="p-2 text-left dark:text-gray-200">Company</th>
                <th className="p-2 text-left dark:text-gray-200">Date</th>
                <th className="p-2 text-left dark:text-gray-200">Attended</th>
                <th className="p-2 text-left dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} className={r.attended ? 'bg-green-50 dark:bg-green-900' : 'dark:bg-gray-950'}>
                  <td className="p-2 dark:text-gray-100">{r.name}</td>
                  <td className="p-2 dark:text-gray-100">{r.email}</td>
                  <td className="p-2 dark:text-gray-100">{r.company}</td>
                  <td className="p-2 dark:text-gray-100">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="p-2">
                    <button
                      className={`px-3 py-1 rounded ${r.attended ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}`}
                      onClick={() => handleToggleAttended(r.id, !!r.attended)}
                      disabled={updatingId === r.id}
                    >
                      {updatingId === r.id ? '...' : r.attended ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="p-2">
                    <button
                      className="text-red-600 hover:underline dark:text-red-400"
                      onClick={() => handleDelete(r.id)}
                      disabled={deletingId === r.id}
                    >
                      {deletingId === r.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={6} className="p-4 text-center text-gray-500 dark:text-gray-400">No demo requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 