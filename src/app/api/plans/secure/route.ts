import { NextResponse } from "next/server";
import pool from "@/lib/pg";

export async function GET(req: Request) {
  // Add authentication/authorization here if needed
  try {
    const result = await pool.query(
      `SELECT id, name, price_monthly, price_yearly, 
        stripe_price_id_monthly AS price_id_monthly, 
        stripe_price_id_yearly AS price_id_yearly, 
        description, features, tier
       FROM plans
       WHERE is_active = true
       ORDER BY price_monthly ASC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
} 