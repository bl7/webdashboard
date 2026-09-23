import { NextResponse } from "next/server";
import pool from "@/lib/pg";

export const revalidate = 60

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, name, price_monthly, price_yearly, description, features
       FROM plans
       WHERE is_active = true
       ORDER BY price_monthly ASC`
    );
    return NextResponse.json(result.rows, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
} 