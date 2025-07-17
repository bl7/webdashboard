import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from "@/lib/auth"

// CORS helper
function withCORS(res: Response | NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export async function OPTIONS(req: NextRequest) {
  return withCORS(new Response(null, { status: 204 }));
}

export async function GET(req: NextRequest) {
  try {
    // Verify JWT token and get user UUID
    const { userUuid } = await verifyAuthToken(req);
    const result = await pool.query(
      `SELECT * FROM user_profiles WHERE user_id = $1`,
      [userUuid]
    );
    if (result.rowCount === 0) {
      return withCORS(NextResponse.json({ profile: null }));
    }
    return withCORS(NextResponse.json({ profile: result.rows[0] }));
  } catch (error: any) {
    if (error.message && error.message.includes("Unauthorized")) {
      return withCORS(NextResponse.json({ error: error.message }, { status: 401 }));
    }
    return withCORS(NextResponse.json({ error: "Internal Server Error" }, { status: 500 }));
  }
} 