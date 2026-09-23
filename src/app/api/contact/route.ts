import { sendMail } from "@/lib/mail"

export async function POST(req: Request) {
  const payload = await req.json()

  if (!payload.to) {
    return Response.json(
      { ok: false, message: "Invalid or missing recipient email address" },
      { status: 400 }
    )
  }
  try {
    await sendMail(payload)
    return Response.json({ ok: true, message: "Email sent successfully!" })
  } catch (error) {
    console.error(error)
    return Response.json({ ok: false, message: "Error sending email" }, { status: 500 })
  }
}
