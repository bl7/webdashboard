import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/pg';

// GET: List all plans
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        name,
        price_monthly,
        price_yearly,
        stripe_price_id_monthly,
        stripe_price_id_yearly,
        stripe_product_id,
        description,
        features,
        is_active,
        tier,
        created_at,
        updated_at
      FROM plans 
      ORDER BY created_at DESC
    `);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching plans:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}

// POST: Add a new plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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
      is_active, 
      tier
    } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Plan name is required' },
        { status: 400 }
      );
    }

    if (!price_monthly || price_monthly <= 0) {
      return NextResponse.json(
        { error: 'Monthly price must be greater than 0' },
        { status: 400 }
      );
    }

    if (!price_yearly || price_yearly <= 0) {
      return NextResponse.json(
        { error: 'Yearly price must be greater than 0' },
        { status: 400 }
      );
    }

    // Validate Stripe IDs if provided
    if (stripe_price_id_monthly && !stripe_price_id_monthly.startsWith("price_")) {
      return NextResponse.json(
        { error: 'Invalid Stripe monthly price ID format' },
        { status: 400 }
      );
    }

    if (stripe_price_id_yearly && !stripe_price_id_yearly.startsWith("price_")) {
      return NextResponse.json(
        { error: 'Invalid Stripe yearly price ID format' },
        { status: 400 }
      );
    }

    if (stripe_product_id && !stripe_product_id.startsWith("prod_")) {
      return NextResponse.json(
        { error: 'Invalid Stripe product ID format' },
        { status: 400 }
      );
    }

    // Check if plan name already exists
    const existingPlan = await pool.query(
      "SELECT id FROM plans WHERE LOWER(name) = LOWER($1)",
      [name.trim()]
    );
    
    if (existingPlan.rows.length > 0) {
      return NextResponse.json(
        { error: 'A plan with this name already exists' },
        { status: 409 }
      );
    }

    // Insert new plan
    const result = await pool.query(
      `INSERT INTO plans (
        name,
        price_monthly,
        price_yearly,
        stripe_price_id_monthly,
        stripe_price_id_yearly,
        stripe_product_id,
        description,
        features,
        is_active,
        tier
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
        typeof tier === 'number' ? tier : null
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    );
  }
} 