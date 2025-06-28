import { NextResponse } from "next/server";
import pool from "@/lib/pg";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, name, price_monthly, price_yearly, description, features
       FROM plans
       WHERE is_active = true
       ORDER BY price_monthly ASC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
} 