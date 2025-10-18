import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { role, userUuid } = await verifyAuthToken(req)
  const body = (await req.json()) as { user_id?: string; reason?: string }
  let user_id: string | undefined = body?.user_id
  const reason: string | undefined = body?.reason

  // Authorization rules:
  // - boss: may create cancellation request for any user_id (must be provided)
  // - user: may create cancellation request only for themselves; ignore/override provided user_id
  if (role === "user") {
    user_id = String(userUuid)
  } else if (role === "boss") {
    if (!user_id) {
      return NextResponse.json({ success: false, error: "Missing user_id" }, { status: 400 })
    }
  } else {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  if (!user_id) {
    return NextResponse.json({ success: false, error: "Missing user_id" }, { status: 400 })
  }

  if (!reason || reason.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "Cancellation reason is required" },
      { status: 400 }
    )
  }

  const client = await pool.connect()

  try {
    // Get user's subscription
    const { rows } = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [
      user_id,
    ])
    const sub = rows[0]

    if (!sub) {
      return NextResponse.json({ success: false, error: "No subscription found" }, { status: 404 })
    }

    // Check if there's already a pending cancellation request
    const existingRequest = await client.query(
      "SELECT id FROM subscription_cancellations WHERE user_id = $1 AND subscription_id = $2",
      [user_id, sub.stripe_subscription_id]
    )

    if (existingRequest.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "You already have a pending cancellation request",
        },
        { status: 400 }
      )
    }

    // Create cancellation request (NOT actual cancellation)
    await client.query(
      `INSERT INTO subscription_cancellations (user_id, subscription_id, reason) VALUES ($1, $2, $3)`,
      [user_id, sub.stripe_subscription_id, reason.trim()]
    )

    return NextResponse.json({
      success: true,
      message:
        "Your cancellation request has been submitted. We'll review it and process it within 1-2 business days.",
    })
  } catch (error: any) {
    console.error("Cancellation request error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  } finally {
    client.release()
  }
}
