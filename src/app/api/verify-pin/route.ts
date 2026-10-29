import { NextRequest, NextResponse } from "next/server"
import { verifyAuthToken } from "@/lib/auth"
import { adminPinMatches } from "@/lib/adminPinReset"

export async function POST(req: NextRequest) {
  try {
    const { userUuid } = await verifyAuthToken(req)
    const { pin } = await req.json()

    if (!pin) {
      return NextResponse.json({ valid: false, message: "Missing pin" }, { status: 400 })
    }

    const valid = await adminPinMatches(String(userUuid), pin)
    return NextResponse.json({ valid })
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (message.includes("Unauthorized")) {
      return NextResponse.json({ valid: false, message: "Unauthorized" }, { status: 401 })
    }
    console.error("Error verifying admin PIN:", error)
    return NextResponse.json({ valid: false, message: "Internal server error" }, { status: 500 })
  }
}
