import { sendMail } from "@/lib/mail"
import {
  allowContactAttempt,
  buildContactMail,
  parseContactPayload,
} from "@/lib/contactMessage"

function clientKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || req.headers.get("x-real-ip") || "unknown"
}

export async function POST(req: Request) {
  if (!allowContactAttempt(clientKey(req))) {
    return Response.json({ ok: false, message: "Too many requests" }, { status: 429 })
  }

  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return Response.json({ ok: false, message: "Invalid request" }, { status: 400 })
  }

  const parsed = parseContactPayload(payload)
  if (!parsed.ok) {
    return Response.json({ ok: false, message: parsed.message }, { status: 400 })
  }

  try {
    await sendMail(buildContactMail(parsed.value))
    return Response.json({ ok: true, message: "Email sent successfully!" })
  } catch {
    console.error("[contact] send failed")
    return Response.json({ ok: false, message: "Error sending email" }, { status: 500 })
  }
}
