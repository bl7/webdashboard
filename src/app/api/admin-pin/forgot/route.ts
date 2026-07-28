import { NextResponse } from "next/server"
import { createAndSendAdminPinOtp, getUserEmail } from "@/lib/adminPinReset"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 })
    }

    const email = await getUserEmail(userId)
    if (!email) {
      return NextResponse.json(
        { success: false, message: "No email found for this account." },
        { status: 404 }
      )
    }

    const maskedEmail = await createAndSendAdminPinOtp(userId, email)
    return NextResponse.json({ success: true, maskedEmail })
  } catch (error) {
    console.error("Error sending admin PIN reset OTP:", error)
    return NextResponse.json(
      { success: false, message: "Failed to send reset code." },
      { status: 500 }
    )
  }
}
