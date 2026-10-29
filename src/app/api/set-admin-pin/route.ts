import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"
import { saveAdminPin } from "@/lib/adminPinReset"

export async function POST(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { pin } = await req.json()

    if (!pin) {
      return NextResponse.json(
        { success: false, message: "Missing pin" },
        { status: 400 }
      )
    }

    await saveAdminPin(String(userUuid), pin)
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error"
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    if (message === "PIN must be 4 digits.") {
      return NextResponse.json({ success: false, message }, { status: 400 })
    }
    console.error("Error setting admin PIN:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
