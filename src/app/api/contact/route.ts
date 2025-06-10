import { sendMail } from "@/lib/mail"

export async function POST(req: Request) {
  const payload = await req.json()
  console.log(payload.to)

  if (!payload.to) {
    return Response.json({
      message: "Invalid or missing recipient email address",
    })
  }
  try {
    console.log("sending")
    const result = await sendMail(payload)
    return Response.json({ message: "Email sent successfully!" })
  } catch (error) {
    console.error(error)
    return Response.json({ message: "Error sending email" })
  }
}
