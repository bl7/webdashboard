import { NextResponse } from "next/server"
import { verifyAdminPinOtp } from "@/lib/adminPinReset"

export async function POST(req: Request) {
  try {
    const { userId, otp } = await req.json()
    if (!userId || !otp) {
      return NextResponse.json(
        { success: false, message: "Missing userId or otp" },
        { status: 400 }
      )
    }

    const result = await verifyAdminPinOtp(userId, String(otp))
    if (!result.ok) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, resetToken: result.resetToken })
  } catch (error) {
    console.error("Error verifying admin PIN reset OTP:", error)
    return NextResponse.json(
      { success: false, message: "Failed to verify code." },
      { status: 500 }
    )
  }
}
