import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"
import { verifyAdminPinOtp } from "@/lib/adminPinReset"

export async function POST(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { otp } = await req.json()
    if (!otp) {
      return NextResponse.json(
        { success: false, message: "Missing otp" },
        { status: 400 }
      )
    }

    const result = await verifyAdminPinOtp(String(userUuid), String(otp))
    if (!result.ok) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, resetToken: result.resetToken })
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    console.error("Error verifying admin PIN reset OTP:", error)
    return NextResponse.json(
      { success: false, message: "Failed to verify code." },
      { status: 500 }
    )
  }
}
