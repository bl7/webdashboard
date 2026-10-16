import { NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"
import { verifyAuthToken } from "@/lib/auth"
import { createFlyerLocation, deleteFlyerLocation, flyerPath, listFlyerLocations, type FlyerLocation } from "@/lib/flyerLocations"

async function requireBoss(req: NextRequest) {
  const { role } = await verifyAuthToken(req)
  if (role !== "boss") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}

async function withQr(origin: string, location: FlyerLocation) {
  const url = `${origin}${flyerPath(location.id)}`
  const qrDataUrl = await QRCode.toDataURL(url, { width: 512, margin: 1 })
  return { ...location, url, qrDataUrl }
}

export async function GET(req: NextRequest) {
  try {
    const denied = await requireBoss(req)
    if (denied) return denied
    const origin = new URL(req.url).origin
    const locations = await Promise.all((await listFlyerLocations()).map((location) => withQr(origin, location)))
    return NextResponse.json({ locations })
  } catch (error: any) {
    console.error("GET /api/flyer-locations", error)
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to load locations" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const denied = await requireBoss(req)
    if (denied) return denied
    const body = await req.json().catch(() => ({}))
    const name = typeof body.name === "string" ? body.name : ""
    const location = await createFlyerLocation(name)
    const origin = new URL(req.url).origin
    return NextResponse.json(await withQr(origin, location), { status: 201 })
  } catch (error: any) {
    console.error("POST /api/flyer-locations", error)
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    const message = error.message === "Enter a location name." || error.message === "Use a name with letters or numbers."
      ? error.message
      : "Failed to add location"
    const status = message === "Failed to add location" ? 500 : 400
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const denied = await requireBoss(req)
    if (denied) return denied
    const body = await req.json().catch(() => ({}))
    const id = typeof body.id === "string" ? body.id : ""
    const removed = await deleteFlyerLocation(id)
    if (!removed) return NextResponse.json({ error: "Location not found" }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error("DELETE /api/flyer-locations", error)
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to delete location" }, { status: 500 })
  }
}
