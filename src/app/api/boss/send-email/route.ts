import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"
import { formatEmailBody, renderInstaLabelEmail } from "@/lib/instalabel-email"
import { sendMail } from "@/lib/mail"

function parseEmails(value?: string): string[] {
  if (!value?.trim()) return []
  return Array.from(
    new Set(
      value
        .split(/[,;\s]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => /.+@.+\..+/.test(e))
    )
  )
}

export async function POST(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { to, cc, bcc, subject, body, recipientName } = await req.json()

    const toList = parseEmails(to)
    const ccList = parseEmails(cc)
    const bccList = parseEmails(bcc)

    if (!toList.length) {
      return NextResponse.json({ error: "At least one To recipient is required" }, { status: 400 })
    }
    if (!subject?.trim() || !body?.trim()) {
      return NextResponse.json({ error: "Subject and body are required" }, { status: 400 })
    }

    const bodyHtml = formatEmailBody(body.trim())
    const html = renderInstaLabelEmail({
      subject: subject.trim(),
      recipientName: recipientName?.trim() || "",
      bodyHtml,
    })

    await sendMail({
      to: toList,
      cc: ccList.length ? ccList : undefined,
      bcc: bccList.length ? bccList : undefined,
      subject: subject.trim(),
      body: html,
      useBulk: true,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Boss send email error:", err)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
