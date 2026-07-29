import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"
import { sendMail } from "@/lib/mail"
import {
  cancellationRequestReceivedEmail,
  cancellationRequestAdminEmail,
} from "@/components/templates/subscriptionEmails"
import {
  ensureCancellationStatusColumn,
  PENDING_CANCELLATION_SQL,
} from "@/lib/cancellationRequest"

function resolveUserId(
  role: string,
  userUuid: unknown,
  bodyUserId?: string
): { user_id?: string; error?: NextResponse } {
  if (role === "user") return { user_id: String(userUuid) }
  if (role === "boss") {
    if (!bodyUserId) {
      return {
        user_id: undefined,
        error: NextResponse.json({ success: false, error: "Missing user_id" }, { status: 400 }),
      }
    }
    return { user_id: bodyUserId }
  }
  return {
    user_id: undefined,
    error: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
  }
}

export async function POST(req: NextRequest) {
  const { role, userUuid } = await verifyAuthToken(req)
  const body = (await req.json()) as { user_id?: string; reason?: string }
  const resolved = resolveUserId(role, userUuid, body?.user_id)
  if (resolved.error) return resolved.error
  const user_id = resolved.user_id
  const reason: string | undefined = body?.reason

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
    await ensureCancellationStatusColumn(client)

    const { rows } = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [
      user_id,
    ])
    const sub = rows[0]

    if (!sub) {
      return NextResponse.json({ success: false, error: "No subscription found" }, { status: 404 })
    }

    const existingRequest = await client.query(
      `SELECT id FROM subscription_cancellations
       WHERE user_id = $1 AND subscription_id = $2 AND ${PENDING_CANCELLATION_SQL}`,
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

    const trimmedReason = reason.trim()

    await client.query(
      `INSERT INTO subscription_cancellations (user_id, subscription_id, reason, status)
       VALUES ($1, $2, $3, 'pending')`,
      [user_id, sub.stripe_subscription_id, trimmedReason]
    )

    // Fetch user profile for email notifications
    const profileResult = await client.query(
      "SELECT full_name, email, company_name FROM user_profiles WHERE user_id = $1",
      [user_id]
    )
    const profile = profileResult.rows[0]
    const userEmail = profile?.email as string | undefined
    const userName = (profile?.full_name as string | undefined) || userEmail || "Customer"
    const planName = (sub.plan_name as string | undefined) || (sub.plan_id as string | undefined) || ""

    if (userEmail) {
      try {
        await sendMail({
          to: userEmail,
          subject: "We've Received Your Cancellation Request - InstaLabel",
          bcc: "instalabel.co@gmail.com",
          body: cancellationRequestReceivedEmail({
            name: userName,
            planName,
            reason: trimmedReason,
          }),
        })

        await sendMail({
          to: "contact@instalabel.co",
          subject: `URGENT: Cancellation Request from ${userName}`,
          body: cancellationRequestAdminEmail({
            name: userName,
            email: userEmail,
            companyName: profile?.company_name,
            planName,
            reason: trimmedReason,
            userId: user_id,
            subscriptionId: sub.stripe_subscription_id,
          }),
        })
      } catch (emailError) {
        console.error("[CANCELLATION REQUEST] Failed to send notification emails:", emailError)
      }
    } else {
      console.error(
        `[CANCELLATION REQUEST] No email found for user ${user_id}; skipping notifications`
      )
    }

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

/** Withdraw a pending cancellation request (does not touch Stripe). */
export async function DELETE(req: NextRequest) {
  const { role, userUuid } = await verifyAuthToken(req)
  const body = (await req.json().catch(() => ({}))) as { user_id?: string }
  const resolved = resolveUserId(role, userUuid, body?.user_id)
  if (resolved.error) return resolved.error
  const user_id = resolved.user_id

  if (!user_id) {
    return NextResponse.json({ success: false, error: "Missing user_id" }, { status: 400 })
  }

  const client = await pool.connect()
  try {
    await ensureCancellationStatusColumn(client)

    const { rows } = await client.query(
      "SELECT stripe_subscription_id, cancel_at_period_end, cancel_at, status FROM subscription_better WHERE user_id = $1",
      [user_id]
    )
    const sub = rows[0]
    if (!sub) {
      return NextResponse.json({ success: false, error: "No subscription found" }, { status: 404 })
    }

    if (sub.cancel_at_period_end || sub.cancel_at || sub.status === "canceled") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cancellation is already scheduled. Use Keep subscription to resume billing instead.",
        },
        { status: 400 }
      )
    }

    const result = await client.query(
      `UPDATE subscription_cancellations
       SET status = 'withdrawn'
       WHERE user_id = $1 AND subscription_id = $2 AND ${PENDING_CANCELLATION_SQL}
       RETURNING id`,
      [user_id, sub.stripe_subscription_id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No pending cancellation request to withdraw" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Cancellation request withdrawn. Your plan stays active.",
    })
  } catch (error: any) {
    console.error("Withdraw cancellation request error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  } finally {
    client.release()
  }
}
