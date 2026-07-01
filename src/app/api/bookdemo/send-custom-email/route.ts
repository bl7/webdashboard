import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"
import { formatEmailBody, renderInstaLabelEmail } from "@/lib/instalabel-email"
import { sendMail } from "@/lib/mail"

export async function POST(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== "boss") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { to, name, subject, body } = await req.json()

    if (!to || !subject?.trim() || !body?.trim()) {
      return NextResponse.json({ error: "Recipient, subject, and body are required" }, { status: 400 })
    }

    const bodyHtml = formatEmailBody(body.trim())
    const html = renderInstaLabelEmail({
      subject: subject.trim(),
      recipientName: name || "",
      bodyHtml,
    })

    await sendMail({
      to,
      subject: subject.trim(),
      body: html,
      useBulk: true,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Demo custom email error:", err)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
