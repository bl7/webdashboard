import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"
import { createAndSendAdminPinOtp, getUserEmail } from "@/lib/adminPinReset"

export async function POST(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const email = await getUserEmail(String(userUuid))
    if (!email) {
      return NextResponse.json(
        { success: false, message: "No email found for this account." },
        { status: 404 }
      )
    }

    const maskedEmail = await createAndSendAdminPinOtp(String(userUuid), email)
    return NextResponse.json({ success: true, maskedEmail })
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    console.error("Error sending admin PIN reset OTP:", error)
    return NextResponse.json(
      { success: false, message: "Failed to send reset code." },
      { status: 500 }
    )
  }
}
