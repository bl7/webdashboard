import { NextResponse } from "next/server"
import { resetAdminPinWithToken } from "@/lib/adminPinReset"

export async function POST(req: Request) {
  try {
    const { userId, resetToken, pin } = await req.json()
    if (!userId || !resetToken || !pin) {
      return NextResponse.json(
        { success: false, message: "Missing userId, resetToken, or pin" },
        { status: 400 }
      )
    }

    const result = await resetAdminPinWithToken(userId, String(resetToken), String(pin))
    if (!result.ok) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error resetting admin PIN:", error)
    return NextResponse.json(
      { success: false, message: "Failed to reset PIN." },
      { status: 500 }
    )
  }
}
