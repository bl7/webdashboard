import { NextRequest, NextResponse } from "next/server"
import { deviceLabel, flyerLocationExists, recordFlyerVisit } from "@/lib/flyerLocations"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const home = new URL("/", req.url)
  const exists = await flyerLocationExists(id)
  if (!exists) return NextResponse.redirect(home)

  const purpose = `${req.headers.get("purpose") || ""} ${req.headers.get("sec-purpose") || ""}`
  if (purpose.toLowerCase().includes("prefetch")) return NextResponse.redirect(home)

  const response = NextResponse.redirect(home)
  let visitorId = req.cookies.get("il_vid")?.value
  if (!visitorId || visitorId.length > 80) {
    visitorId = crypto.randomUUID()
    response.cookies.set("il_vid", visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 90,
      path: "/",
    })
  }
  try {
    await recordFlyerVisit(id, visitorId, deviceLabel(req.headers.get("user-agent") || ""))
  } catch (error) {
    console.error("flyer visit", error)
  }
  return response
}
