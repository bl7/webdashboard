import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import {
  allowContactAttempt,
  buildContactMail,
  contactRecipient,
  DEFAULT_CONTACT_EMAIL,
  escapeHtml,
  parseContactPayload,
  resetContactAttempts,
} from "./contactMessage.ts"

afterEach(() => {
  resetContactAttempts()
})

describe("contact mail", () => {
  it("escapes user content and ignores caller-controlled recipients", () => {
    const parsed = parseContactPayload({
      name: "Ann <script>",
      email: "ann@example.com",
      phone: "07000000000",
      business: "Cafe & Co",
      message: "Hello\n<script>",
      to: "victim@example.com",
      bcc: "other@example.com",
      subject: "Injected",
      body: "<b>owned</b>",
      useBulk: true,
    })
    assert.equal(parsed.ok, true)
    if (!parsed.ok) return
    const mail = buildContactMail(parsed.value, DEFAULT_CONTACT_EMAIL)
    assert.equal(mail.to, DEFAULT_CONTACT_EMAIL)
    assert.equal(mail.replyTo, "ann@example.com")
    assert.equal(mail.subject, "Enquiry from Ann <script>")
    assert.match(mail.body, /Ann &lt;script&gt;/)
    assert.match(mail.body, /Cafe &amp; Co/)
    assert.doesNotMatch(mail.body, /<script>/)
    assert.equal(escapeHtml(`"'<>&`), "&quot;&#39;&lt;&gt;&amp;")
  })

  it("rejects malformed contact details", () => {
    assert.equal(parseContactPayload(null).ok, false)
    assert.equal(parseContactPayload({ name: "Ann", email: "not-an-email", message: "Hi" }).ok, false)
    assert.equal(parseContactPayload({ name: 1, email: "ann@example.com", message: "Hi" }).ok, false)
  })

  it("sends enquiries to the hardcoded business address", () => {
    assert.equal(contactRecipient(), "contact@instalabel.co")
  })

  it("rate limits a caller", () => {
    for (let i = 0; i < 5; i += 1) assert.equal(allowContactAttempt("ip", 1_000 + i), true)
    assert.equal(allowContactAttempt("ip", 1_010), false)
  })
})
