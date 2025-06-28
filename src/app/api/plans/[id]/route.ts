import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id } = await params
    
    // Validation
    const { 
      name, 
      price_monthly, 
      price_yearly, 
      stripe_price_id_monthly, 
      stripe_price_id_yearly, 
      stripe_product_id, 
      description, 
      features, 
      is_active 
    } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Plan name is required" },
        { status: 400 }
      )
    }

    if (!price_monthly || price_monthly <= 0) {
      return NextResponse.json(
        { error: "Monthly price must be greater than 0" },
        { status: 400 }
      )
    }

    if (!price_yearly || price_yearly <= 0) {
      return NextResponse.json(
        { error: "Yearly price must be greater than 0" },
        { status: 400 }
      )
    }

    // Validate Stripe IDs if provided
    if (stripe_price_id_monthly && !stripe_price_id_monthly.startsWith("price_")) {
      return NextResponse.json(
        { error: "Invalid Stripe monthly price ID format" },
        { status: 400 }
      )
    }

    if (stripe_price_id_yearly && !stripe_price_id_yearly.startsWith("price_")) {
      return NextResponse.json(
        { error: "Invalid Stripe yearly price ID format" },
        { status: 400 }
      )
    }

    if (stripe_product_id && !stripe_product_id.startsWith("prod_")) {
      return NextResponse.json(
        { error: "Invalid Stripe product ID format" },
        { status: 400 }
      )
    }

    // Check if plan exists
    const existingPlan = await pool.query(
      "SELECT id FROM plans WHERE id = $1",
      [id]
    )
    
    if (existingPlan.rows.length === 0) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      )
    }

    // Check if plan name already exists (excluding current plan)
    const duplicateName = await pool.query(
      "SELECT id FROM plans WHERE LOWER(name) = LOWER($1) AND id != $2",
      [name.trim(), id]
    )
    
    if (duplicateName.rows.length > 0) {
      return NextResponse.json(
        { error: "A plan with this name already exists" },
        { status: 409 }
      )
    }

    // Update plan
    const result = await pool.query(
      `UPDATE plans SET 
        name = $1,
        price_monthly = $2,
        price_yearly = $3,
        stripe_price_id_monthly = $4,
        stripe_price_id_yearly = $5,
        stripe_product_id = $6,
        description = $7,
        features = $8,
        is_active = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *`,
      [
        name.trim(),
        price_monthly,
        price_yearly,
        stripe_price_id_monthly || null,
        stripe_price_id_yearly || null,
        stripe_product_id || null,
        description || null,
        JSON.stringify(features || []),
        is_active !== undefined ? is_active : true,
        id
      ]
    )

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating plan:", error)
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if plan exists
    const existingPlan = await pool.query(
      "SELECT id, name FROM plans WHERE id = $1",
      [id]
    )
    
    if (existingPlan.rows.length === 0) {
      return NextResponse.json(
        { error: "Plan not found" },
        { status: 404 }
      )
    }

    // Check if plan is being used by any subscriptions
    const activeSubscriptions = await pool.query(
      "SELECT COUNT(*) as count FROM subscriptions WHERE plan_id = $1 AND status IN ('active', 'trialing')",
      [id]
    )
    
    if (parseInt(activeSubscriptions.rows[0].count) > 0) {
      return NextResponse.json(
        { error: "Cannot delete plan that has active subscriptions" },
        { status: 409 }
      )
    }

    // Delete plan
    await pool.query("DELETE FROM plans WHERE id = $1", [id])
    
    return NextResponse.json({ 
      success: true,
      message: "Plan deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting plan:", error)
    return NextResponse.json(
      { error: "Failed to delete plan" },
      { status: 500 }
    )
  }
} 