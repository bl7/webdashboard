"use client"
import React, { useMemo, useState } from "react"
import * as XLSX from "xlsx"
import Image from "next/image"

type Recipient = { email: string; name?: string }

type TemplateFields = {
  subject: string
  preheader: string
  headline: string
  bullets: string[]
  testimonialQuote: string
  testimonialAuthor: string
  ctaText: string
  ctaUrl: string
  heroImageUrl?: string
  phoneMockUrl?: string
}

const defaultFields: TemplateFields = {
  subject: "Label smarter. Waste less. Stay compliant.",
  preheader: "Print food safety labels instantly across your kitchen.",
  headline: "Label Smarter.\nWaste Less.\nStay Compliant.",
  bullets: [
    "Print prep, cook, and allergen labels instantly",
    "Sync menus directly from Square",
    "Track expiry dates automatically",
    "Keep a full audit trail for EHO inspections",
  ],
  testimonialQuote:
    "We switched from a basic label printer to InstaLabel and immediately saw the difference. Managing our locations became effortless, and inventory insights helped reduce waste.",
  testimonialAuthor: "Jonathan L., Owner",
  ctaText: "Start Free Trial",
  ctaUrl: "https://www.instalabel.co",
  heroImageUrl: "https://www.instalabel.co/email-asset/instaLabel2.png",
  phoneMockUrl: "https://www.instalabel.co/email-asset/instaLabel2.png",
}

function resolveAbsolute(url: string) {
  if (!url) return url
  try {
    if (typeof window !== "undefined") {
      if (url.startsWith("/")) return `${window.location.origin}${url}`
      return url
    }
    return url
  } catch {
    return url
  }
}

function renderEmailHTML(fields: TemplateFields, previewName?: string) {
  // Minimal, inlined CSS email using brand tokens (approximate)
  const headlineHtml = fields.headline
    .split("\n")
    .map((line) => `<div>${line}</div>`) // split into lines
    .join("")

  const bulletItems = fields.bullets
    .filter(Boolean)
    .map(
      (b) =>
        `<tr><td style="padding:6px 0; font-size:15px; line-height:22px; color:#111827"><span style="color:#f97316; font-weight:700;">✓</span> ${b}</td></tr>`
    )
    .join("")

  const greeting = previewName
    ? `<p style="margin:0 0 12px 0; color:#111827">Hi ${previewName},</p>`
    : ""

  const logoUrl = "https://www.instalabel.co/email-asset/logo_long.png"
  const heroUrl = fields.heroImageUrl ? resolveAbsolute(fields.heroImageUrl) : ""

  return `
	<!DOCTYPE html>
	<html>
	<head>
	<meta charSet="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>${fields.subject}</title>
	<style>
		/* no external fonts to keep deliverability solid */
		@media (max-width:600px){
			.stack { display:block !important; width:100% !important; }
		}
	</style>
	</head>
	<body style="margin:0; padding:0; background:#ffffff; color:#111827;">
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;">
			<tr>
				<td align="center">
					<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%; max-width:600px;">
						<tr>
							<td style="padding:4px 20px;">
								<img src="${logoUrl}" alt="InstaLabel" style="height:150px; display:block;" />
							</td>
						</tr>
						<tr>
							<td style="padding:0 20px 0 20px;">
								<img src="https://www.instalabel.co/email-asset/banner.png" alt="Label Smarter. Waste Less. Stay Compliant." style="width:100%; height:auto; display:block; border-radius:12px;" />
							</td>
						</tr>
						<tr>
							<td style="padding:24px 20px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;">
								${greeting}
								<h2 style="margin:0 0 10px 0; font-size:22px; line-height:28px;">Simplify food prep labels and stay compliant effortlessly</h2>
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
									${fields.bullets
                    .filter(Boolean)
                    .map(
                      (b) => `
											<tr><td style="padding:6px 0; font-size:15px; line-height:22px; color:#111827"><span style="color:#7c3aed; font-weight:700;">✓</span> ${b}</td></tr>
										`
                    )
                    .join("")}
								</table>
								<div style="margin-top:18px; text-align:center;">
									${fields.phoneMockUrl ? `<img src="${resolveAbsolute(fields.phoneMockUrl)}" alt="Phone App" style="width:200px; height:auto; display:block; margin:0 auto 18px auto; border-radius:8px;" />` : ""}
									<a href="${fields.ctaUrl}" style="display:inline-block; background:#7c3aed; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:700;">${fields.ctaText}</a>
								</div>
							</td>
						</tr>
						<tr>
							<td style="padding:0 20px 24px 20px;">
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6; border:1px solid #e5e7eb; border-radius:12px;">
									<tr>
										<td style="padding:18px 16px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; font-size:14px; line-height:22px; color:#111827;">
											<strong style="display:block; margin-bottom:6px;">Testimonial</strong>
											<em>“${fields.testimonialQuote}”</em>
											<div style="margin-top:8px; color:#374151;">${fields.testimonialAuthor}</div>
										</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td style="background:#7c3aed; color:#ffffff; padding:18px 20px; text-align:center; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; border-radius:12px; margin:0 20px 24px 20px;">
								Join kitchens across the UK labeling smarter with InstaLabel
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
	</html>`
}

export default function BulkEmailPage() {
  const [rawRows, setRawRows] = useState<any[]>([])
  const [emailKey, setEmailKey] = useState<string>("email")
  const [nameKey, setNameKey] = useState<string>("name")
  const [fields, setFields] = useState<TemplateFields>(defaultFields)
  const [sending, setSending] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const headers = useMemo(() => (rawRows[0] ? Object.keys(rawRows[0]) : []), [rawRows])

  const recipients: Recipient[] = useMemo(() => {
    return rawRows
      .map((r) => ({
        email: String(r[emailKey] || "").trim(),
        name: String(r[nameKey] || "").trim() || undefined,
      }))
      .filter((r) => r.email && /.+@.+\..+/.test(r.email))
  }, [rawRows, emailKey, nameKey])

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const bstr = evt.target?.result
      if (!bstr) return
      const workbook = XLSX.read(bstr, { type: "binary" })
      const ws = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(ws, { defval: "" }) as any[]
      setRawRows(jsonData)
      if (jsonData[0]) {
        const cols = Object.keys(jsonData[0])
        const emailGuess = cols.find((c) => c.toLowerCase().includes("email"))
        const nameGuess = cols.find((c) => c.toLowerCase().includes("name"))
        if (emailGuess) setEmailKey(emailGuess)
        if (nameGuess) setNameKey(nameGuess)
      }
    }
    reader.readAsBinaryString(f)
  }

  async function sendTest() {
    const testTo = prompt("Enter a test email address")
    if (!testTo) return
    setSending(true)
    setLog((l) => [...l, `Sending test to ${testTo}...`])
    try {
      const html = renderEmailHTML(fields, "Test User")
      const res = await fetch("/api/bulk-email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: fields.subject, html, recipients: [{ email: testTo }] }),
      })
      const data = await res.json()
      setLog((l) => [...l, `Test result: ${data.status}`])
    } catch (e) {
      setLog((l) => [...l, `Test failed`])
    } finally {
      setSending(false)
    }
  }

  async function sendBulk() {
    if (!recipients.length) return alert("No valid recipients")
    setSending(true)
    setLog((l) => [...l, `Sending to ${recipients.length} recipients...`])
    try {
      const html = renderEmailHTML(fields)
      const res = await fetch("/api/bulk-email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: fields.subject, html, recipients }),
      })
      const data = await res.json()
      setLog((l) => [...l, `Bulk result: ${data.status}, sent=${data.sent}, failed=${data.failed}`])
    } catch (e) {
      setLog((l) => [...l, `Bulk failed`])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-bold">Bulk Email</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Upload an Excel/CSV, map columns, fill template, preview and send via Zoho.
      </p>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h2 className="mb-3 font-semibold">1) Upload list</h2>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={onFile} />
            {headers.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-4">
                <label className="text-sm">
                  Email column
                  <select
                    className="mt-1 block w-full rounded border px-2 py-1"
                    value={emailKey}
                    onChange={(e) => setEmailKey(e.target.value)}
                  >
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  Name column (optional)
                  <select
                    className="mt-1 block w-full rounded border px-2 py-1"
                    value={nameKey}
                    onChange={(e) => setNameKey(e.target.value)}
                  >
                    <option value="">None</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Valid recipients: {recipients.length}
            </p>
          </div>

          <div className="space-y-3 rounded-lg border p-4">
            <h2 className="font-semibold">2) Template content</h2>
            <input
              className="w-full rounded border px-2 py-1"
              placeholder="Subject"
              value={fields.subject}
              onChange={(e) => setFields({ ...fields, subject: e.target.value })}
            />
            <input
              className="w-full rounded border px-2 py-1"
              placeholder="Preheader"
              value={fields.preheader}
              onChange={(e) => setFields({ ...fields, preheader: e.target.value })}
            />
            <textarea
              className="w-full rounded border px-2 py-1"
              rows={3}
              placeholder="Headline (use line breaks for multiple lines)"
              value={fields.headline}
              onChange={(e) => setFields({ ...fields, headline: e.target.value })}
            />
            {fields.bullets.map((b, i) => (
              <input
                key={i}
                className="w-full rounded border px-2 py-1"
                placeholder={`Bullet ${i + 1}`}
                value={b}
                onChange={(e) => {
                  const next = [...fields.bullets]
                  next[i] = e.target.value
                  setFields({ ...fields, bullets: next })
                }}
              />
            ))}
            <input
              className="w-full rounded border px-2 py-1"
              placeholder="CTA Text"
              value={fields.ctaText}
              onChange={(e) => setFields({ ...fields, ctaText: e.target.value })}
            />
            <input
              className="w-full rounded border px-2 py-1"
              placeholder="CTA URL"
              value={fields.ctaUrl}
              onChange={(e) => setFields({ ...fields, ctaUrl: e.target.value })}
            />
            <textarea
              className="w-full rounded border px-2 py-1"
              rows={3}
              placeholder="Testimonial quote"
              value={fields.testimonialQuote}
              onChange={(e) => setFields({ ...fields, testimonialQuote: e.target.value })}
            />
            <input
              className="w-full rounded border px-2 py-1"
              placeholder="Testimonial author"
              value={fields.testimonialAuthor}
              onChange={(e) => setFields({ ...fields, testimonialAuthor: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <button
              disabled={sending}
              onClick={sendTest}
              className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
            >
              Send test
            </button>
            <button
              disabled={sending || recipients.length === 0}
              onClick={sendBulk}
              className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
            >
              Send bulk
            </button>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">Preview</h2>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="overflow-hidden rounded border">
              <div className="bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600">
                Desktop (600px)
              </div>
              <div className="flex justify-center bg-gray-50 p-4">
                <iframe
                  title="email-preview-desktop"
                  sandbox="allow-same-origin"
                  srcDoc={renderEmailHTML(fields, "Alex")}
                  style={{ width: 600, height: 800, border: "0" }}
                />
              </div>
            </div>
            <div className="overflow-hidden rounded border">
              <div className="bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600">
                Mobile (375px)
              </div>
              <div className="flex justify-center bg-gray-50 p-2">
                <iframe
                  title="email-preview-mobile"
                  sandbox="allow-same-origin"
                  srcDoc={`<html><head><meta name=\"viewport\" content=\"width=375, initial-scale=1\"/><style>body{margin:0; padding:0; overflow-x:hidden;} table{max-width:375px !important; width:375px !important;}</style></head><body>${renderEmailHTML(fields, "Alex")}</body></html>`}
                  style={{
                    width: 375,
                    height: 800,
                    border: 0,
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1 font-semibold">Log</h3>
            <div className="max-h-40 space-y-1 overflow-auto text-sm text-muted-foreground">
              {log.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
