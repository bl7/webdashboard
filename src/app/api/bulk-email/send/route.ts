import { NextResponse } from "next/server"
import { sendMail } from "@/lib/mail"

type Recipient = { email: string; name?: string }

export async function POST(req: Request) {
  try {
    const { subject, html, recipients } = (await req.json()) as {
      subject: string
      html: string
      recipients: Recipient[]
    }

    if (!subject || !html || !Array.isArray(recipients)) {
      return NextResponse.json({ status: "error", message: "Invalid payload" }, { status: 400 })
    }

    const unique = new Map<string, Recipient>()
    for (const r of recipients) {
      if (!r?.email) continue
      const key = r.email.toLowerCase()
      if (!/.+@.+\..+/.test(key)) continue
      if (!unique.has(key)) unique.set(key, r)
    }

    const list = Array.from(unique.values())
    let sent = 0
    let failed = 0

    // basic throttling: 25/second
    const batchSize = 25
    for (let i = 0; i < list.length; i += batchSize) {
      const slice = list.slice(i, i + batchSize)
      await Promise.all(
        slice.map(async (r) => {
          try {
            await sendMail({ to: r.email, subject, body: html })
            sent++
          } catch (e) {
            failed++
          }
        })
      )
      // small delay between batches
      await new Promise((res) => setTimeout(res, 1000))
    }

    return NextResponse.json({ status: "ok", sent, failed })
  } catch (e) {
    return NextResponse.json({ status: "error" }, { status: 500 })
  }
}
