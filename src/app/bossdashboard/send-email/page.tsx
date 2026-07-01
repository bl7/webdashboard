'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { EmailPreview } from '@/components/boss/EmailPreview'
import { useDarkMode } from '../context/DarkModeContext'

type UserRow = {
  user_id: string
  full_name?: string
  company_name?: string
  email: string
}

function isValidEmail(email: string) {
  return /.+@.+\..+/.test(email.trim())
}

function RecipientField({
  label,
  emails,
  users,
  onChange,
  placeholder,
  isDarkMode,
}: {
  label: string
  emails: string[]
  users: UserRow[]
  onChange: (emails: string[]) => void
  placeholder: string
  isDarkMode: boolean
}) {
  const [input, setInput] = useState('')

  const labelFor = (email: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    return user?.full_name || user?.company_name || email
  }

  const addEmail = (raw: string) => {
    const email = raw.trim()
    if (!isValidEmail(email)) return
    const exists = emails.some((e) => e.toLowerCase() === email.toLowerCase())
    if (exists) return
    onChange([...emails, email])
    setInput('')
  }

  const removeEmail = (email: string) => {
    onChange(emails.filter((e) => e.toLowerCase() !== email.toLowerCase()))
  }

  return (
    <div>
      <label className="text-sm font-medium block mb-1 dark:text-gray-200">{label}</label>
      <div
        className={`flex flex-wrap items-center gap-1.5 rounded border px-2 py-1.5 min-h-[42px] ${
          isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
        }`}
      >
        {emails.map((email) => (
          <span
            key={email}
            className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs text-purple-900 dark:bg-purple-900/40 dark:text-purple-100"
          >
            <span className="max-w-[180px] truncate">{labelFor(email)}</span>
            <button
              type="button"
              className="text-purple-700 hover:text-purple-900 dark:text-purple-200"
              onClick={() => removeEmail(email)}
              aria-label={`Remove ${email}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          className="min-w-[140px] flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none dark:text-gray-100"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={emails.length ? '' : placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              addEmail(input)
            } else if (e.key === 'Backspace' && !input && emails.length) {
              removeEmail(emails[emails.length - 1])
            }
          }}
          onBlur={() => input.trim() && addEmail(input)}
        />
      </div>
    </div>
  )
}

export default function SendEmailPage() {
  const { isDarkMode } = useDarkMode()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toEmails, setToEmails] = useState<string[]>([])
  const [ccEmails, setCcEmails] = useState<string[]>([])
  const [bccEmails, setBccEmails] = useState<string[]>([])
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const bossToken = localStorage.getItem('bossToken')
        const res = await fetch('/api/subscription_better/users', {
          headers: bossToken ? { Authorization: `Bearer ${bossToken}` } : {},
        })
        if (!res.ok) throw new Error('Failed to load users')
        const data = await res.json()
        setUsers(Array.isArray(data) ? data.filter((u: UserRow) => u.email) : [])
      } catch {
        alert('Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return users
    return users.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) ||
        u.full_name?.toLowerCase().includes(q) ||
        u.company_name?.toLowerCase().includes(q)
    )
  }, [users, search])

  const selectedEmails = useMemo(
    () => new Set(toEmails.map((e) => e.toLowerCase())),
    [toEmails]
  )

  const toggleUser = (user: UserRow, checked: boolean) => {
    if (checked) {
      setToEmails((prev) =>
        prev.some((e) => e.toLowerCase() === user.email.toLowerCase()) ? prev : [...prev, user.email]
      )
    } else {
      setToEmails((prev) => prev.filter((e) => e.toLowerCase() !== user.email.toLowerCase()))
    }
  }

  const handleSend = async () => {
    if (!toEmails.length || !subject.trim() || !body.trim()) {
      alert('To, subject, and body are required')
      return
    }
    setSending(true)
    try {
      const bossToken = localStorage.getItem('bossToken')
      const selectedUser =
        toEmails.length === 1
          ? users.find((u) => u.email.toLowerCase() === toEmails[0].toLowerCase())
          : undefined
      const res = await fetch('/api/boss/send-email', {
        method: 'POST',
        headers: bossToken
          ? { 'Content-Type': 'application/json', Authorization: `Bearer ${bossToken}` }
          : { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: toEmails.join(', '),
          cc: ccEmails.join(', '),
          bcc: bccEmails.join(', '),
          subject: subject.trim(),
          body: body.trim(),
          recipientName:
            toEmails.length === 1 ? selectedUser?.full_name || selectedUser?.company_name || '' : '',
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send email')
      }
      alert('Email sent successfully')
      setSubject('')
      setBody('')
    } catch (err: any) {
      alert(err.message || 'Failed to send email')
    } finally {
      setSending(false)
    }
  }

  const inputClass =
    'w-full border rounded px-3 py-2 text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100'

  const previewRecipientName = useMemo(() => {
    if (toEmails.length !== 1) return ''
    const selectedUser = users.find((u) => u.email.toLowerCase() === toEmails[0].toLowerCase())
    return selectedUser?.full_name || selectedUser?.company_name || ''
  }, [toEmails, users])

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2 dark:text-gray-100">Send Email</h1>
      <p className="text-sm text-muted-foreground mb-6">
        One email via contact@instalabel.co. Add multiple people to To — like Outlook, not separate sends.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3 dark:text-gray-100">Users</h2>
            <input
              type="text"
              placeholder="Search name, company, email..."
              className={`${inputClass} mb-3`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {loading ? (
              <p className="text-sm dark:text-gray-300">Loading users...</p>
            ) : (
              <div className="max-h-[420px] overflow-y-auto space-y-1 border rounded dark:border-gray-700">
                {filteredUsers.map((u) => (
                  <label
                    key={u.user_id}
                    className="flex items-start gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selectedEmails.has(u.email.toLowerCase())}
                      onChange={(e) => toggleUser(u, e.target.checked)}
                    />
                    <span className="min-w-0 dark:text-gray-100">
                      <span className="font-medium block truncate">
                        {u.full_name || u.company_name || u.email}
                      </span>
                      <span className="text-muted-foreground text-xs block truncate">{u.email}</span>
                    </span>
                  </label>
                ))}
                {!filteredUsers.length && (
                  <p className="p-4 text-sm text-muted-foreground text-center">No users found.</p>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Selected users are added to To. Everyone gets the same email in one send.
            </p>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4 space-y-3">
            <h2 className="font-semibold mb-1 dark:text-gray-100">Compose</h2>

            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <RecipientField
                    label="To"
                    emails={toEmails}
                    users={users}
                    onChange={setToEmails}
                    placeholder="Add recipients or type an email"
                    isDarkMode={isDarkMode}
                  />
                </div>
                <div className="flex gap-2 pt-6 text-xs">
                  {!showCc && (
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setShowCc(true)}
                    >
                      Cc
                    </button>
                  )}
                  {!showBcc && (
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => setShowBcc(true)}
                    >
                      Bcc
                    </button>
                  )}
                </div>
              </div>

              {showCc && (
                <RecipientField
                  label="Cc"
                  emails={ccEmails}
                  users={users}
                  onChange={setCcEmails}
                  placeholder="Optional"
                  isDarkMode={isDarkMode}
                />
              )}
              {showBcc && (
                <RecipientField
                  label="Bcc"
                  emails={bccEmails}
                  users={users}
                  onChange={setBccEmails}
                  placeholder="Optional, hidden from other recipients"
                  isDarkMode={isDarkMode}
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1 dark:text-gray-200">Subject</label>
              <input className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1 dark:text-gray-200">Body</label>
              <textarea
                className={`${inputClass} min-h-[160px]`}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Your message. Wrapped in InstaLabel template with logo and footer."
              />
            </div>

            <button
              type="button"
              className="w-full px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
              onClick={handleSend}
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-3 dark:text-gray-100">Preview</h2>
            {subject.trim() && (
              <p className="text-sm text-muted-foreground mb-3">
                <span className="font-medium text-foreground">Subject:</span> {subject}
              </p>
            )}
            <EmailPreview subject={subject} body={body} recipientName={previewRecipientName} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
