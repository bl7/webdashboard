'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

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
  const [modalRequest, setModalRequest] = useState<BookDemoRequest | null>(null)
  const [attendDialog, setAttendDialog] = useState<{request: BookDemoRequest, reschedule?: boolean} | null>(null)
  const [demoTime, setDemoTime] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [sendEmail, setSendEmail] = useState(false)

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

  const handleToggleAttended = async (id: number, attended: boolean, request?: BookDemoRequest) => {
    if (request) {
      setAttendDialog({request, reschedule: !!request.attended})
      setDemoTime('')
      setSendEmail(false)
      return
    }
    if (!attended) {
      setUpdatingId(id)
      try {
        const res = await fetch(`/api/bookdemo/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attended: true }),
        })
        if (!res.ok) throw new Error('Failed to update')
        await fetchRequests()
      } catch (err) {
        alert('Failed to update attended status')
      } finally {
        setUpdatingId(null)
      }
    }
  }

  const handleAttendDialogConfirm = async () => {
    if (!attendDialog) return
    setSendingEmail(true)
    if (!attendDialog.request.attended) {
      await handleToggleAttended(attendDialog.request.id, false)
    }
    if (attendDialog.reschedule || sendEmail) {
      await fetch('/api/bookdemo/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: attendDialog.request.email,
          name: attendDialog.request.name,
          company: attendDialog.request.company,
          time: demoTime,
          reschedule: attendDialog.reschedule,
        })
      })
    }
    setSendingEmail(false)
    setAttendDialog(null)
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
                <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Name</th>
                <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Email</th>
                <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Company</th>
                <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Role</th>
                <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Source</th>
                <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Message</th>
                <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Date</th>
                <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Attended</th>
                <th className="p-2 text-left text-xs font-semibold dark:text-gray-200 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} className={r.attended ? 'bg-green-50 dark:bg-green-900' : 'dark:bg-gray-950'}>
                  <td className="p-2 text-xs dark:text-gray-100 whitespace-nowrap overflow-hidden truncate max-w-[120px]">{r.name}</td>
                  <td className="p-2 text-xs dark:text-gray-100 whitespace-nowrap overflow-hidden truncate max-w-[160px]">{r.email}</td>
                  <td className="p-2 text-xs dark:text-gray-100 whitespace-nowrap overflow-hidden truncate max-w-[120px]">{r.company}</td>
                  <td className="p-2 text-xs dark:text-gray-100 whitespace-nowrap overflow-hidden truncate max-w-[100px]">{r.role || <span className='text-gray-400'>N/A</span>}</td>
                  <td className="p-2 text-xs dark:text-gray-100 whitespace-nowrap overflow-hidden truncate max-w-[100px]">{r.source || <span className='text-gray-400'>N/A</span>}</td>
                  <td className="p-2 text-xs dark:text-gray-100 whitespace-nowrap overflow-hidden truncate max-w-[180px] cursor-pointer text-blue-600 hover:underline" title={r.message} onClick={() => setModalRequest(r)}>
                    {r.message || <span className='text-gray-400'>N/A</span>}
                  </td>
                  <td className="p-2 text-xs dark:text-gray-100 whitespace-nowrap overflow-hidden truncate max-w-[140px]">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="p-2">
                    <button
                      className={`px-3 py-1 rounded text-xs ${r.attended ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}`}
                      onClick={() => handleToggleAttended(r.id, !!r.attended, r)}
                      disabled={updatingId === r.id}
                    >
                      {updatingId === r.id ? '...' : r.attended ? 'Reschedule' : 'Mark Attended'}
                    </button>
                  </td>
                  <td className="p-2">
                    <button
                      className="text-red-600 hover:underline dark:text-red-400 text-xs"
                      onClick={() => handleDelete(r.id)}
                      disabled={deletingId === r.id}
                    >
                      {deletingId === r.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={9} className="p-4 text-center text-gray-500 dark:text-gray-400">No demo requests yet.</td></tr>
              )}
            </tbody>
          </table>
          {/* Modal for full request details */}
          <Dialog open={!!modalRequest} onOpenChange={open => !open && setModalRequest(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Demo Request Details</DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-2 text-base text-foreground mt-2">
                    {modalRequest && (
                      <>
                        <div><span className="font-semibold">Name:</span> {modalRequest.name}</div>
                        <div><span className="font-semibold">Email:</span> {modalRequest.email}</div>
                        <div><span className="font-semibold">Company:</span> {modalRequest.company}</div>
                        <div><span className="font-semibold">Role:</span> {modalRequest.role || <span className='text-gray-400'>N/A</span>}</div>
                        <div><span className="font-semibold">Source:</span> {modalRequest.source || <span className='text-gray-400'>N/A</span>}</div>
                        <div><span className="font-semibold">Message:</span> <span className="whitespace-pre-line">{modalRequest.message || <span className='text-gray-400'>N/A</span>}</span></div>
                        <div><span className="font-semibold">Date:</span> {new Date(modalRequest.created_at).toLocaleString()}</div>
                        <div><span className="font-semibold">Attended:</span> {modalRequest.attended ? 'Yes' : 'No'}</div>
                      </>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          {/* Attended status dialog */}
          <Dialog open={!!attendDialog} onOpenChange={open => { if (!open) setAttendDialog(null) }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{attendDialog?.reschedule ? 'Reschedule Demo' : 'Mark as Attended & Optionally Send Email'}</DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-2 text-base text-foreground mt-2">
                    <div>
                      <span className="font-semibold">Name:</span> {attendDialog?.request.name}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span> {attendDialog?.request.email}
                    </div>
                    <div>
                      <span className="font-semibold">Company:</span> {attendDialog?.request.company}
                    </div>
                    {attendDialog?.reschedule ? (
                      <div>
                        <label className="font-semibold">Rescheduled Demo Time: </label>
                        <input type="datetime-local" className="border rounded px-2 py-1 ml-2" value={demoTime} onChange={e => setDemoTime(e.target.value)} required />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center mt-2">
                          <input type="checkbox" id="sendEmail" checked={sendEmail} onChange={e => setSendEmail(e.target.checked)} className="mr-2" />
                          <label htmlFor="sendEmail">Send thank you/demo scheduled email</label>
                        </div>
                        {sendEmail && (
                          <div>
                            <label className="font-semibold">Demo Time: </label>
                            <input type="datetime-local" className="border rounded px-2 py-1 ml-2" value={demoTime} onChange={e => setDemoTime(e.target.value)} required={sendEmail} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <button className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={() => setAttendDialog(null)} disabled={sendingEmail}>Cancel</button>
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={handleAttendDialogConfirm} disabled={sendingEmail || ((attendDialog?.reschedule || sendEmail) && !demoTime)}>{sendingEmail ? 'Processing...' : (attendDialog?.reschedule ? 'Reschedule & Send Email' : sendEmail ? 'Confirm & Send Email' : 'Confirm')}</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
} 