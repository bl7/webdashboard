const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 5
const hits = new Map<string, number[]>()

export const DEFAULT_CONTACT_EMAIL = "contact@instalabel.co"

const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  business: 160,
  message: 4000,
} as const

export type ContactFields = {
  name: string
  email: string
  phone: string
  business: string
  message: string
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function asOptionalString(value: unknown, max: number): string | null {
  if (value == null || value === "") return ""
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  if (trimmed.length > max) return null
  return trimmed
}

export function parseContactPayload(
  body: unknown
): { ok: true; value: ContactFields } | { ok: false; message: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, message: "Invalid request" }
  }
  const record = body as Record<string, unknown>
  const name = asOptionalString(record.name, LIMITS.name)
  const email = asOptionalString(record.email, LIMITS.email)
  const phone = asOptionalString(record.phone, LIMITS.phone)
  const business = asOptionalString(record.business, LIMITS.business)
  const message = asOptionalString(record.message, LIMITS.message)
  if (!name || !email || phone == null || business == null || !message) {
    return { ok: false, message: "Invalid contact details" }
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Invalid contact details" }
  }
  return { ok: true, value: { name, email, phone, business, message } }
}

export function contactRecipient(): string {
  return DEFAULT_CONTACT_EMAIL
}

export function buildContactMail(value: ContactFields, recipient = contactRecipient()) {
  const safeName = value.name.replace(/[\r\n]+/g, " ")
  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(value.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(value.email)}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(value.phone)}</p>`,
    `<p><strong>Business:</strong> ${escapeHtml(value.business)}</p>`,
    `<p><strong>Message:</strong></p>`,
    `<p>${escapeHtml(value.message).replace(/\n/g, "<br>")}</p>`,
  ].join("")
  return {
    to: recipient,
    replyTo: value.email,
    subject: `Enquiry from ${safeName}`,
    body: html,
  }
}

export function allowContactAttempt(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) || []).filter((time) => now - time < WINDOW_MS)
  if (recent.length >= MAX_ATTEMPTS) {
    hits.set(key, recent)
    return false
  }
  recent.push(now)
  hits.set(key, recent)
  return true
}

export function resetContactAttempts(): void {
  hits.clear()
}
