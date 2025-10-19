"use client"
import React, { useMemo, useState } from "react"
import * as XLSX from "xlsx"
import Image from "next/image"
import { toast } from "sonner"

type Recipient = { email: string; name?: string }

type TemplateFields = {
  subject: string
  subheading: string
  bullets: string[]
  additionalContent?: string
  testimonialQuote: string
  testimonialAuthor: string
  ctaText: string
  ctaUrl: string
  heroImageUrl?: string
  phoneMockUrl?: string
  // optional marketing fields
  discountPercent?: string
  discountCode?: string
  offerHeadline?: string
  offerSubtext?: string
}

const defaultFields: TemplateFields = {
  subject: "Label smarter. Waste less. Stay compliant.",
  subheading: "Simplify food prep labels and stay compliant effortlessly",
  bullets: [
    "Print prep, cook, and allergen labels instantly",
    "Sync menus directly from Square",
    "Track expiry dates automatically",
    "Keep a full audit trail for EHO inspections",
  ],
  additionalContent: "",
  testimonialQuote:
    "We switched from a basic label printer to InstaLabel and immediately saw the difference. Managing our locations became effortless, and inventory insights helped reduce waste.",
  testimonialAuthor: "Jonathan L., Owner",
  ctaText: "Start Free Trial",
  ctaUrl: "https://www.instalabel.co",
  heroImageUrl: "/email-asset/instaLabel2.png",
  phoneMockUrl: "/email-asset/instaLabel2.png",
}

// Marketing presets
const offerTemplateDefaults: TemplateFields = {
  subject: "Limited-time: Save 20% on InstaLabel",
  subheading:
    "Switch to smarter food prep labeling.\n\nSign up today and unlock your discount instantly.",
  bullets: [
    "Print compliant labels in seconds",
    "Sync menus from Square",
    "Reduce waste with automatic expiries",
    "Instant setup, works in every kitchen",
  ],
  testimonialQuote:
    "InstaLabel transformed our kitchen ops within days. Staff love how fast it is.",
  testimonialAuthor: "Sofia M., Ops Manager",
  ctaText: "Claim Offer",
  ctaUrl: "https://www.instalabel.co/register",
  heroImageUrl: "/email-asset/instaLabel2.png",
  phoneMockUrl: "/email-asset/instaLabel2.png",
  discountPercent: "20%",
  discountCode: "SAVE20",
  offerHeadline: "Sign up today and save",
  offerSubtext: "Offer ends soon. Terms apply.",
}

const couponTemplateDefaults: TemplateFields = {
  subject: "Welcome gift inside: Your InstaLabel coupon",
  subheading:
    "Smarter labeling, less waste, faster teams.\n\nUse your coupon below and get started.",
  bullets: [
    "Allergen & expiry labels made simple",
    "Square menu sync in minutes",
    "Audit trail for EHO inspections",
    "UK-based support when you need it",
  ],
  testimonialQuote: "Rolling out across locations was effortless. It just works.",
  testimonialAuthor: "Jonathan L., Owner",
  ctaText: "Start Free Trial",
  ctaUrl: "https://www.instalabel.co/register",
  heroImageUrl: "/email-asset/instaLabel2.png",
  phoneMockUrl: "/email-asset/instaLabel2.png",
  discountCode: "WELCOME10",
  offerSubtext: "Valid for new signups only.",
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

function renderEmailHTML(
  fields: TemplateFields,
  previewName?: string,
  templateId: string = "default"
) {
  const bulletItems = fields.bullets
    .filter(Boolean)
    .map(
      (b) =>
        `<tr><td style="padding:6px 0; font-size:15px; line-height:22px; color:#111827"><span style="color:#7c3aed; font-weight:700;">✓</span> ${b}</td></tr>`
    )
    .join("")

  const greeting = previewName
    ? `<p style="margin:0 0 12px 0; color:#111827; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; font-size:16px;">Hi ${previewName} Team,</p>`
    : ""

  const logoUrl = "https://www.instalabel.co/email-asset/logo_long.png"
  const heroUrl = fields.heroImageUrl ? resolveAbsolute(fields.heroImageUrl) : ""
  const subheadingHtml = (fields.subheading || "")
    .split(/\r?\n\r?\n+/)
    .map(
      (paragraph) =>
        `<p style="margin:0 0 10px 0; font-size:16px; line-height:22px; font-weight:normal;">${paragraph
          .split(/\r?\n/)
          .map((line) => line)
          .join("<br/>")}</p>`
    )
    .join("")

  const additionalContentHtml = (fields.additionalContent || "")
    .split(/\r?\n\r?\n+/)
    .map((paragraph) => {
      const trimmedParagraph = paragraph.trim()
      if (!trimmedParagraph) return ""

      // Check if paragraph contains bullet points (lines starting with - or *)
      const lines = trimmedParagraph.split(/\r?\n/)
      const hasBullets = lines.some((line) => line.trim().match(/^[-*]\s/))

      if (hasBullets) {
        const bulletItems = lines
          .filter((line) => line.trim().match(/^[-*]\s/))
          .map((line) => line.replace(/^[-*]\s/, "").trim())
          .filter(Boolean)
          .map(
            (bullet) =>
              `<li style="padding:4px 0; font-size:15px; line-height:22px; color:#111827;"><span style="color:#7c3aed; font-weight:700;">•</span> ${bullet}</li>`
          )
          .join("")

        const nonBulletLines = lines
          .filter((line) => !line.trim().match(/^[-*]\s/))
          .filter(Boolean)
          .map((line) => line.trim())
          .join(" ")

        let result = ""
        if (nonBulletLines) {
          result += `<p style="margin:0 0 8px 0; font-size:16px; line-height:22px; font-weight:normal;">${nonBulletLines}</p>`
        }
        if (bulletItems) {
          result += `<ul style="margin:8px 0; padding-left:0; list-style:none;">${bulletItems}</ul>`
        }
        return result
      } else {
        return `<p style="margin:0 0 10px 0; font-size:16px; line-height:22px; font-weight:normal;">${trimmedParagraph
          .split(/\r?\n/)
          .map((line) => line)
          .join("<br/>")}</p>`
      }
    })
    .filter(Boolean)
    .join("")

  if (templateId === "offer") {
    const headline = fields.offerHeadline || "Limited-time offer"
    const discount = fields.discountPercent || "20%"
    const code = fields.discountCode || "SAVE20"
    const sub = fields.offerSubtext || "Offer ends soon. Terms apply."
    return `
    <!DOCTYPE html>
    <html><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
    <body style="margin:0; padding:0; background:#ffffff; color:#111827;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
      <table role="presentation" width="600" style="width:100%; max-width:600px;">
        <tr><td style="padding:2px 20px; text-align:center;">
          <a href="https://www.instalabel.co" target="_blank" rel="noopener noreferrer" style="display:inline-block;">
            <img src="${logoUrl}" alt="InstaLabel" style="height:250px; display:block; margin:0 auto; border:0;" />
          </a>
        </td></tr>
        <tr><td style="padding:8px 20px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;">
          ${greeting}
          <p style="margin:0 0 8px 0; font-size:18px; line-height:26px;">${headline}</p>
          <div style="margin:0 0 10px 0; padding:14px; background:#f5f3ff; border:1px dashed #c4b5fd; border-radius:10px; text-align:center;">
            <div style="font-size:28px; font-weight:800; color:#7c3aed;">${discount} OFF</div>
            <div style="margin-top:6px; font-size:14px; color:#4b5563;">Use code <span style="font-weight:700; color:#111827;">${code}</span> at checkout</div>
          </div>
          ${subheadingHtml}
          <div style="margin-top:12px; text-align:center;">
            <a href="${fields.ctaUrl}" style="display:inline-block; background:#7c3aed; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:700;">${fields.ctaText || "Claim Offer"}</a>
          </div>
          <div style="margin-top:10px; font-size:12px; color:#6b7280;">${sub}</div>
        </td></tr>
        <tr><td style="padding:0 20px 24px 20px;"><img src="https://www.instalabel.co/email-asset/banner.png" alt="Label Smarter. Waste Less. Stay Compliant." style="width:100%; height:auto; display:block; border-radius:12px;" /></td></tr>
        <tr><td style="background:#7c3aed; color:#ffffff; padding:18px 20px; text-align:center; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; border-radius:12px; margin:0 20px 24px 20px;">Join kitchens across the UK labeling smarter with InstaLabel</td></tr>
      </table></td></tr></table>
    </body></html>`
  }

  if (templateId === "coupon") {
    const code = fields.discountCode || "WELCOME10"
    const sub = fields.offerSubtext || "Valid for new signups only."
    return `
    <!DOCTYPE html>
    <html><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
    <body style="margin:0; padding:0; background:#ffffff; color:#111827;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
      <table role="presentation" width="600" style="width:100%; max-width:600px;">
        <tr><td style="padding:2px 20px; text-align:center;">
          <a href="https://www.instalabel.co" target="_blank" rel="noopener noreferrer" style="display:inline-block;">
            <img src="${logoUrl}" alt="InstaLabel" style="height:250px; display:block; margin:0 auto; border:0;" />
          </a>
        </td></tr>
        <tr><td style="padding:8px 20px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;">
          ${greeting}
          <div style="padding:14px; border:1px solid #e5e7eb; border-radius:10px;">
            ${subheadingHtml}
            <div style="margin-top:10px; padding:10px; background:#111827; color:#ffffff; border-radius:8px; text-align:center; font-weight:700; letter-spacing:1px;">CODE: ${code}</div>
            <div style="margin-top:10px; text-align:center;">
              <a href="${fields.ctaUrl}" style="display:inline-block; background:#7c3aed; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:700;">${fields.ctaText || "Start Free Trial"}</a>
            </div>
            <div style="margin-top:10px; font-size:12px; color:#6b7280;">${sub}</div>
          </div>
        </td></tr>
        <tr><td style="padding:0 20px 24px 20px;"><img src="https://www.instalabel.co/email-asset/banner.png" alt="Label Smarter. Waste Less. Stay Compliant." style="width:100%; height:auto; display:block; border-radius:12px;" /></td></tr>
        <tr><td style="background:#7c3aed; color:#ffffff; padding:18px 20px; text-align:center; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; border-radius:12px; margin:0 20px 24px 20px;">Join kitchens across the UK labeling smarter with InstaLabel</td></tr>
      </table></td></tr></table>
    </body></html>`
  }

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
			.mobile-padding { padding: 16px !important; }
			.mobile-logo { height: 250px !important; }
			.mobile-banner { width: 100% !important; }
			.mobile-content { padding: 16px !important; }
			.mobile-phone { width: 150px !important; margin: 16px auto !important; }
			.mobile-cta { padding: 10px 16px !important; font-size: 14px !important; }
			.mobile-testimonial { padding: 12px !important; font-size: 13px !important; }
			.mobile-footer { padding: 12px 16px !important; font-size: 13px !important; }
		}
	</style>
	</head>
	<body style="margin:0; padding:0; background:#ffffff; color:#111827;">
		<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;">
			<tr>
				<td align="center">
					<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%; max-width:600px;">
						<tr>
							<td style="padding:2px 20px; text-align:center;">
								<a href="https://www.instalabel.co" target="_blank" rel="noopener noreferrer" style="display:inline-block;">
									<img src="${logoUrl}" alt="InstaLabel" class="mobile-logo" style="height:250px; display:block; margin:0 auto; border:0;" />
								</a>
							</td>
						</tr>
						<tr>
							<td style="padding:4px 20px 24px 20px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial;">
								${greeting}
								${subheadingHtml}
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0">
									<tr>
										<td style="width:50%; vertical-align:top; padding-right:20px;">
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
											<div style="margin-top:12px; text-align:left;">
												<a href="${fields.ctaUrl}" class="mobile-cta" style="display:inline-block; background:#7c3aed; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:8px; font-weight:700;">${fields.ctaText}</a>
											</div>
										</td>
										<td style="width:50%; vertical-align:top; text-align:center;" class="stack">
											${fields.phoneMockUrl ? `<img src="${resolveAbsolute(fields.phoneMockUrl)}" alt="Phone App" class="mobile-phone" style="width:200px; height:auto; display:block; margin:0 auto; border-radius:8px;" />` : "No phone image URL"}
										</td>
									</tr>
								</table>
								${
                  additionalContentHtml
                    ? `
								<div style="margin-top:20px; padding:16px 0; border-top:1px solid #e5e7eb;">
									${additionalContentHtml}
								</div>
								`
                    : ""
                }
							</td>
						</tr>
						<tr>
							<td class="mobile-padding" style="padding:0 20px 24px 20px;">
								<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6; border:1px solid #e5e7eb; border-radius:12px;">
									<tr>
										<td class="mobile-testimonial" style="padding:18px 16px; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; font-size:14px; line-height:22px; color:#111827;">
											<strong style="display:block; margin-bottom:6px;">Testimonial</strong>
											<em>"${fields.testimonialQuote}"</em>
											<div style="margin-top:8px; color:#374151;">${fields.testimonialAuthor}</div>
										</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td class="mobile-padding" style="padding:0 20px 24px 20px;">
								<img src="https://www.instalabel.co/email-asset/banner.png" alt="Label Smarter. Waste Less. Stay Compliant." class="mobile-banner" style="width:100%; height:auto; display:block; border-radius:12px;" />
							</td>
						</tr>
						<tr>
							<td class="mobile-footer" style="background:#7c3aed; color:#ffffff; padding:18px 20px; text-align:center; font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial; border-radius:12px; margin:0 20px 24px 20px;">
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
  const [templateId, setTemplateId] = useState<string>("default")
  const [rawRows, setRawRows] = useState<any[]>([])
  const [emailKey, setEmailKey] = useState<string>("email")
  const [nameKey, setNameKey] = useState<string>("name")
  const [fields, setFields] = useState<TemplateFields>(defaultFields)
  const [sending, setSending] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const [previewName, setPreviewName] = useState<string>("Alex")

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
      const res = await fetch("/api/bulk-email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: fields.subject,
          fields,
          templateId,
          recipients: [{ email: testTo, name: "Test User" }],
        }),
      })
      const data = await res.json()
      setLog((l) => [...l, `Test result: ${data.status}`])
      if (res.ok) {
        toast.success("Test email sent")
      } else {
        toast.error("Failed to send test email")
      }
    } catch (e) {
      setLog((l) => [...l, `Test failed`])
      toast.error("Test email failed")
    } finally {
      setSending(false)
    }
  }

  async function sendBulk() {
    if (!recipients.length) return alert("No valid recipients")
    setSending(true)
    setLog((l) => [...l, `Sending to ${recipients.length} recipients...`])
    try {
      const res = await fetch("/api/bulk-email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: fields.subject,
          fields,
          templateId,
          recipients,
        }),
      })
      const data = await res.json()
      setLog((l) => [...l, `Bulk result: ${data.status}, sent=${data.sent}, failed=${data.failed}`])
      if (res.ok) {
        toast.success(
          `Bulk sent: ${data.sent} delivered${data.failed ? `, ${data.failed} failed` : ""}`
        )
      } else {
        toast.error("Bulk send failed")
      }
    } catch (e) {
      setLog((l) => [...l, `Bulk failed`])
      toast.error("Bulk send failed")
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
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Template</label>
              <select
                className="rounded border px-2 py-1"
                value={templateId}
                onChange={(e) => {
                  const id = e.target.value
                  setTemplateId(id)
                  // Load field presets for selected template
                  if (id === "default") setFields({ ...defaultFields })
                  if (id === "offer") setFields({ ...offerTemplateDefaults })
                  if (id === "coupon") setFields({ ...couponTemplateDefaults })
                }}
              >
                <option value="default">Informational (current)</option>
                <option value="offer">Limited-time Offer</option>
                <option value="coupon">Coupon + CTA</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email Subject</label>
              <input
                className="w-full rounded border px-2 py-1"
                placeholder="Subject"
                value={fields.subject}
                onChange={(e) => setFields({ ...fields, subject: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Preview Name (for testing)
              </label>
              <input
                className="w-full rounded border px-2 py-1"
                placeholder="Preview name (for testing)"
                value={previewName}
                onChange={(e) => setPreviewName(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Subheading</label>
              <textarea
                className="w-full rounded border px-2 py-2"
                placeholder="Subheading (you can write multiple paragraphs; separate paragraphs with a blank line)"
                rows={3}
                value={fields.subheading}
                onChange={(e) => setFields({ ...fields, subheading: e.target.value })}
              />
            </div>

            {templateId === "offer" && (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <input
                  className="w-full rounded border px-2 py-1"
                  placeholder="Offer headline (e.g., Sign up today and save)"
                  value={fields.offerHeadline || ""}
                  onChange={(e) => setFields({ ...fields, offerHeadline: e.target.value })}
                />
                <input
                  className="w-full rounded border px-2 py-1"
                  placeholder="Discount percent (e.g., 20%)"
                  value={fields.discountPercent || ""}
                  onChange={(e) => setFields({ ...fields, discountPercent: e.target.value })}
                />
                <input
                  className="w-full rounded border px-2 py-1"
                  placeholder="Coupon code (e.g., SAVE20)"
                  value={fields.discountCode || ""}
                  onChange={(e) => setFields({ ...fields, discountCode: e.target.value })}
                />
                <input
                  className="w-full rounded border px-2 py-1"
                  placeholder="Offer subtext (expiry or terms)"
                  value={fields.offerSubtext || ""}
                  onChange={(e) => setFields({ ...fields, offerSubtext: e.target.value })}
                />
              </div>
            )}

            {templateId === "coupon" && (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <input
                  className="w-full rounded border px-2 py-1"
                  placeholder="Coupon code (e.g., WELCOME10)"
                  value={fields.discountCode || ""}
                  onChange={(e) => setFields({ ...fields, discountCode: e.target.value })}
                />
                <input
                  className="w-full rounded border px-2 py-1"
                  placeholder="Coupon subtext (e.g., Valid for new signups only.)"
                  value={fields.offerSubtext || ""}
                  onChange={(e) => setFields({ ...fields, offerSubtext: e.target.value })}
                />
              </div>
            )}

            {templateId === "default" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Feature Bullet Points
                </label>
                {fields.bullets.map((b, i) => (
                  <input
                    key={i}
                    className="mb-2 w-full rounded border px-2 py-1"
                    placeholder={`Bullet ${i + 1}`}
                    value={b}
                    onChange={(e) => {
                      const next = [...fields.bullets]
                      next[i] = e.target.value
                      setFields({ ...fields, bullets: next })
                    }}
                  />
                ))}
              </div>
            )}
            {templateId === "default" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Additional Content
                </label>
                <textarea
                  className="w-full rounded border px-2 py-2"
                  rows={4}
                  placeholder="Additional content (appears below bullet points in full width section). You can use bullet points by starting lines with - or *"
                  value={fields.additionalContent || ""}
                  onChange={(e) => setFields({ ...fields, additionalContent: e.target.value })}
                />
              </div>
            )}
            {templateId === "default" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Call-to-Action Button Text
                </label>
                <input
                  className="w-full rounded border px-2 py-1"
                  placeholder="CTA Text"
                  value={fields.ctaText}
                  onChange={(e) => setFields({ ...fields, ctaText: e.target.value })}
                />
              </div>
            )}
            {templateId === "default" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Call-to-Action Button URL
                </label>
                <input
                  className="w-full rounded border px-2 py-1"
                  placeholder="CTA URL"
                  value={fields.ctaUrl}
                  onChange={(e) => setFields({ ...fields, ctaUrl: e.target.value })}
                />
              </div>
            )}
            {templateId === "default" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Customer Testimonial Quote
                </label>
                <textarea
                  className="w-full rounded border px-2 py-1"
                  rows={3}
                  placeholder="Testimonial quote"
                  value={fields.testimonialQuote}
                  onChange={(e) => setFields({ ...fields, testimonialQuote: e.target.value })}
                />
              </div>
            )}
            {templateId === "default" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Testimonial Author
                </label>
                <input
                  className="w-full rounded border px-2 py-1"
                  placeholder="Testimonial author"
                  value={fields.testimonialAuthor}
                  onChange={(e) => setFields({ ...fields, testimonialAuthor: e.target.value })}
                />
              </div>
            )}
            {templateId === "default" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone Mockup Image URL (optional)
                </label>
                <input
                  className="w-full rounded border px-2 py-1"
                  placeholder="Phone mockup image URL"
                  value={fields.phoneMockUrl || ""}
                  onChange={(e) => setFields({ ...fields, phoneMockUrl: e.target.value })}
                />
              </div>
            )}
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
          <div className="flex justify-center">
            <div className="overflow-hidden rounded border">
              <div className="bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600">
                Desktop (600px)
              </div>
              <div className="flex justify-center bg-gray-50 p-4">
                <iframe
                  title="email-preview-desktop"
                  sandbox="allow-same-origin"
                  srcDoc={renderEmailHTML(fields, previewName, templateId)}
                  style={{ width: 600, height: 800, border: "0" }}
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
