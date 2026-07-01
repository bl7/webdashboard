"use client"
import React, { useEffect, useState } from "react"
import { EmailPreview } from "@/components/boss/EmailPreview"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { useDarkMode } from "../context/DarkModeContext"

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
  const { isDarkMode } = useDarkMode()
  const [requests, setRequests] = useState<BookDemoRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [modalRequest, setModalRequest] = useState<BookDemoRequest | null>(null)
  const [attendDialog, setAttendDialog] = useState<{
    request: BookDemoRequest
    reschedule?: boolean
  } | null>(null)
  const [demoTime, setDemoTime] = useState("")
  const [sendingEmail, setSendingEmail] = useState(false)
  const [sendEmail, setSendEmail] = useState(false)
  const [emailDialog, setEmailDialog] = useState<BookDemoRequest | null>(null)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [sendingCustomEmail, setSendingCustomEmail] = useState(false)

  const fetchRequests = async () => {
    setLoading(true)
    setError("")
    try {
      const bossToken = typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
      const res = await fetch("/api/bookdemo", {
        headers: bossToken ? { Authorization: `Bearer ${bossToken}` } : {},
      })
      if (!res.ok) throw new Error("Failed to fetch requests")
      setRequests(await res.json())
    } catch (err: any) {
      setError(err.message || "Failed to fetch requests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleToggleAttended = async (id: number, attended: boolean, request?: BookDemoRequest) => {
    if (request) {
      setAttendDialog({ request, reschedule: !!request.attended })
      setDemoTime("")
      setSendEmail(false)
      return
    }
    if (!attended) {
      setUpdatingId(id)
      try {
        const bossToken = typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
        const res = await fetch(`/api/bookdemo/${id}`, {
          method: "PUT",
          headers: bossToken
            ? { "Content-Type": "application/json", Authorization: `Bearer ${bossToken}` }
            : { "Content-Type": "application/json" },
          body: JSON.stringify({ attended: true }),
        })
        if (!res.ok) throw new Error("Failed to update")
        await fetchRequests()
      } catch (err) {
        alert("Failed to update attended status")
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
      await fetch("/api/bookdemo/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: attendDialog.request.email,
          name: attendDialog.request.name,
          company: attendDialog.request.company,
          time: demoTime,
          reschedule: attendDialog.reschedule,
        }),
      })
    }
    setSendingEmail(false)
    setAttendDialog(null)
  }

  const openEmailDialog = (request: BookDemoRequest) => {
    setEmailDialog(request)
    setEmailSubject(`Following up on your InstaLabel demo request`)
    setEmailBody(
      `Thank you for your interest in InstaLabel${request.company ? ` and for reaching out from ${request.company}` : ""}.\n\nWe wanted to follow up on your demo request and see if you have any questions we can help with.`
    )
  }

  const handleSendCustomEmail = async () => {
    if (!emailDialog || !emailSubject.trim() || !emailBody.trim()) return
    setSendingCustomEmail(true)
    try {
      const bossToken = typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
      const res = await fetch("/api/bookdemo/send-custom-email", {
        method: "POST",
        headers: bossToken
          ? { "Content-Type": "application/json", Authorization: `Bearer ${bossToken}` }
          : { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailDialog.email,
          name: emailDialog.name,
          subject: emailSubject.trim(),
          body: emailBody.trim(),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to send email")
      }
      setEmailDialog(null)
      alert("Email sent successfully")
    } catch (err: any) {
      alert(err.message || "Failed to send email")
    } finally {
      setSendingCustomEmail(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this request?")) return
    setDeletingId(id)
    try {
      const bossToken = typeof window !== "undefined" ? localStorage.getItem("bossToken") : null
      const res = await fetch(`/api/bookdemo/${id}`, {
        method: "DELETE",
        headers: bossToken ? { Authorization: `Bearer ${bossToken}` } : {},
      })
      if (!res.ok) throw new Error("Failed to delete")
      setRequests((requests) => requests.filter((r) => r.id !== id))
    } catch (err) {
      alert("Failed to delete request")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold dark:text-gray-100">Book Demo Requests</h1>
      {loading ? (
        <div className="dark:text-gray-200">Loading...</div>
      ) : error ? (
        <div className="text-red-600 dark:text-red-400">{error}</div>
      ) : (
        <Card className={isDarkMode ? "border-gray-700 bg-gray-800" : ""}>
          <CardContent className="overflow-x-auto p-0">
            <table
              className={
                isDarkMode
                  ? "min-w-full rounded border border-gray-700 bg-gray-800 shadow"
                  : "min-w-full rounded border border-gray-200 bg-white shadow"
              }
            >
              <thead>
                <tr className={isDarkMode ? "bg-gray-800" : "bg-gray-100"}>
                  <th className="whitespace-nowrap p-2 text-left text-xs font-semibold dark:text-gray-200">
                    Name
                  </th>
                  <th className="whitespace-nowrap p-2 text-left text-xs font-semibold dark:text-gray-200">
                    Email
                  </th>
                  <th className="whitespace-nowrap p-2 text-left text-xs font-semibold dark:text-gray-200">
                    Company
                  </th>
                  <th className="whitespace-nowrap p-2 text-left text-xs font-semibold dark:text-gray-200">
                    Role
                  </th>
                  <th className="whitespace-nowrap p-2 text-left text-xs font-semibold dark:text-gray-200">
                    Source
                  </th>
                  <th className="whitespace-nowrap p-2 text-left text-xs font-semibold dark:text-gray-200">
                    Message
                  </th>
                  <th className="whitespace-nowrap p-2 text-left text-xs font-semibold dark:text-gray-200">
                    Date
                  </th>
                  <th className="whitespace-nowrap p-2 text-left text-xs font-semibold dark:text-gray-200">
                    Attended
                  </th>
                  <th className="whitespace-nowrap p-2 text-left text-xs font-semibold dark:text-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr
                    key={r.id}
                    className={
                      r.attended
                        ? isDarkMode
                          ? "bg-green-800"
                          : "bg-green-50"
                        : isDarkMode
                          ? "bg-gray-800"
                          : ""
                    }
                  >
                    <td className="max-w-[120px] overflow-hidden truncate whitespace-nowrap p-2 text-xs dark:text-gray-100">
                      {r.name}
                    </td>
                    <td className="max-w-[160px] overflow-hidden truncate whitespace-nowrap p-2 text-xs dark:text-gray-100">
                      {r.email}
                    </td>
                    <td className="max-w-[120px] overflow-hidden truncate whitespace-nowrap p-2 text-xs dark:text-gray-100">
                      {r.company}
                    </td>
                    <td className="max-w-[100px] overflow-hidden truncate whitespace-nowrap p-2 text-xs dark:text-gray-100">
                      {r.role || <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="max-w-[100px] overflow-hidden truncate whitespace-nowrap p-2 text-xs dark:text-gray-100">
                      {r.source || <span className="text-gray-400">N/A</span>}
                    </td>
                    <td
                      className="max-w-[180px] cursor-pointer overflow-hidden truncate whitespace-nowrap p-2 text-xs text-purple-600 hover:underline dark:text-gray-100"
                      title={r.message}
                      onClick={() => setModalRequest(r)}
                    >
                      {r.message || <span className="text-gray-400">N/A</span>}
                    </td>
                    <td className="max-w-[140px] overflow-hidden truncate whitespace-nowrap p-2 text-xs dark:text-gray-100">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <button
                        className={`rounded px-3 py-1 text-xs ${r.attended ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200"}`}
                        onClick={() => handleToggleAttended(r.id, !!r.attended, r)}
                        disabled={updatingId === r.id}
                      >
                        {updatingId === r.id ? "..." : r.attended ? "Reschedule" : "Mark Attended"}
                      </button>
                    </td>
                    <td className="space-x-2 whitespace-nowrap p-2">
                      <button
                        className="text-xs text-purple-600 hover:underline dark:text-purple-400"
                        onClick={() => openEmailDialog(r)}
                      >
                        Email
                      </button>
                      <button
                        className="text-xs text-red-600 hover:underline dark:text-red-400"
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                      >
                        {deletingId === r.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No demo requests yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Modal for full request details */}
            <Dialog open={!!modalRequest} onOpenChange={(open) => !open && setModalRequest(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Demo Request Details</DialogTitle>
                  <DialogDescription asChild>
                    <div className="mt-2 space-y-2 text-base text-foreground">
                      {modalRequest && (
                        <>
                          <div>
                            <span className="font-semibold">Name:</span> {modalRequest.name}
                          </div>
                          <div>
                            <span className="font-semibold">Email:</span> {modalRequest.email}
                          </div>
                          <div>
                            <span className="font-semibold">Company:</span> {modalRequest.company}
                          </div>
                          <div>
                            <span className="font-semibold">Role:</span>{" "}
                            {modalRequest.role || <span className="text-gray-400">N/A</span>}
                          </div>
                          <div>
                            <span className="font-semibold">Source:</span>{" "}
                            {modalRequest.source || <span className="text-gray-400">N/A</span>}
                          </div>
                          <div>
                            <span className="font-semibold">Message:</span>{" "}
                            <span className="whitespace-pre-line">
                              {modalRequest.message || <span className="text-gray-400">N/A</span>}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold">Date:</span>{" "}
                            {new Date(modalRequest.created_at).toLocaleString()}
                          </div>
                          <div>
                            <span className="font-semibold">Attended:</span>{" "}
                            {modalRequest.attended ? "Yes" : "No"}
                          </div>
                        </>
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            {/* Custom email dialog */}
            <Dialog
              open={!!emailDialog}
              onOpenChange={(open) => {
                if (!open) setEmailDialog(null)
              }}
            >
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Send Email</DialogTitle>
                  <DialogDescription asChild>
                    <div className="mt-2 grid grid-cols-1 gap-6 text-base text-foreground md:grid-cols-2">
                      {emailDialog && (
                        <>
                          <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                              <span className="font-semibold text-foreground">To:</span>{" "}
                              {emailDialog.name} &lt;{emailDialog.email}&gt;
                            </div>
                            <div>
                              <label className="mb-1 block font-semibold">Subject</label>
                              <input
                                type="text"
                                className="w-full rounded border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                              />
                            </div>
                            <div>
                              <label className="mb-1 block font-semibold">Body</label>
                              <textarea
                                className="min-h-[220px] w-full rounded border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                placeholder="Write your message here. It will be wrapped in the InstaLabel email template."
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Sent from contact@instalabel.co with InstaLabel branding, banner, and
                              footer.
                            </p>
                          </div>
                          <div>
                            <label className="mb-2 block font-semibold">Preview</label>
                            <EmailPreview
                              subject={emailSubject}
                              body={emailBody}
                              recipientName={emailDialog.name}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <button
                    className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                    onClick={() => setEmailDialog(null)}
                    disabled={sendingCustomEmail}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
                    onClick={handleSendCustomEmail}
                    disabled={sendingCustomEmail || !emailSubject.trim() || !emailBody.trim()}
                  >
                    {sendingCustomEmail ? "Sending..." : "Send Email"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* Attended status dialog */}
            <Dialog
              open={!!attendDialog}
              onOpenChange={(open) => {
                if (!open) setAttendDialog(null)
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {attendDialog?.reschedule
                      ? "Reschedule Demo"
                      : "Mark as Attended & Optionally Send Email"}
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="mt-2 space-y-2 text-base text-foreground">
                      <div>
                        <span className="font-semibold">Name:</span> {attendDialog?.request.name}
                      </div>
                      <div>
                        <span className="font-semibold">Email:</span> {attendDialog?.request.email}
                      </div>
                      <div>
                        <span className="font-semibold">Company:</span>{" "}
                        {attendDialog?.request.company}
                      </div>
                      {attendDialog?.reschedule ? (
                        <div>
                          <label className="font-semibold">Rescheduled Demo Time: </label>
                          <input
                            type="datetime-local"
                            className="ml-2 rounded border px-2 py-1"
                            value={demoTime}
                            onChange={(e) => setDemoTime(e.target.value)}
                            required
                          />
                        </div>
                      ) : (
                        <>
                          <div className="mt-2 flex items-center">
                            <input
                              type="checkbox"
                              id="sendEmail"
                              checked={sendEmail}
                              onChange={(e) => setSendEmail(e.target.checked)}
                              className="mr-2"
                            />
                            <label htmlFor="sendEmail">Send thank you/demo scheduled email</label>
                          </div>
                          {sendEmail && (
                            <div>
                              <label className="font-semibold">Demo Time: </label>
                              <input
                                type="datetime-local"
                                className="ml-2 rounded border px-2 py-1"
                                value={demoTime}
                                onChange={(e) => setDemoTime(e.target.value)}
                                required={sendEmail}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <button
                    className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                    onClick={() => setAttendDialog(null)}
                    disabled={sendingEmail}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                    onClick={handleAttendDialogConfirm}
                    disabled={
                      sendingEmail || ((attendDialog?.reschedule || sendEmail) && !demoTime)
                    }
                  >
                    {sendingEmail
                      ? "Processing..."
                      : attendDialog?.reschedule
                        ? "Reschedule & Send Email"
                        : sendEmail
                          ? "Confirm & Send Email"
                          : "Confirm"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
