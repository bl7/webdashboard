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
    const { userUuid } = await verifyAuthToken(req)
    
    const client = await pool.connect()
    try {
      const result = await client.query("SELECT * FROM subscription_better WHERE user_id = $1", [userUuid])
      if (result.rows.length === 0) {
        return withCORS(NextResponse.json({ subscription: null }))
      }
      return withCORS(NextResponse.json({ subscription: result.rows[0] }))
    } finally {
      client.release()
    }
  } catch (error: any) {
    if (error.message.includes("Unauthorized")) {
      return withCORS(NextResponse.json({ error: error.message }, { status: 401 }))
    }
    return withCORS(NextResponse.json({ error: "Internal Server Error" }, { status: 500 }))
  }
} 