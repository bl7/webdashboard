import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"
import { resetAdminPinWithToken } from "@/lib/adminPinReset"

export async function POST(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { resetToken, pin } = await req.json()
    if (!resetToken || !pin) {
      return NextResponse.json(
        { success: false, message: "Missing resetToken or pin" },
        { status: 400 }
      )
    }

    const result = await resetAdminPinWithToken(String(userUuid), String(resetToken), String(pin))
    if (!result.ok) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    console.error("Error resetting admin PIN:", error)
    return NextResponse.json(
      { success: false, message: "Failed to reset PIN." },
      { status: 500 }
    )
  }
}
