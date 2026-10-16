import pool from "@/lib/pg"

export type PromoSignupCount = {
  code: string
  signups: number
}

async function ensurePromoSignups() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS promo_signups (
      user_id text PRIMARY KEY,
      code text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT NOW()
    )
  `)
}

export async function recordPromoSignup(userId: string, code: string) {
  const cleanUser = userId.trim()
  const cleanCode = code.trim()
  if (!cleanUser || cleanUser.startsWith("unknown-") || !cleanCode) return
  await ensurePromoSignups()
  await pool.query(
    `INSERT INTO promo_signups (user_id, code) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING`,
    [cleanUser, cleanCode.slice(0, 80)]
  )
}

export async function listPromoSignupCounts(): Promise<PromoSignupCount[]> {
  await ensurePromoSignups()
  const result = await pool.query(`
    SELECT code, COUNT(*)::int AS signups
    FROM promo_signups
    GROUP BY code
    ORDER BY signups DESC, code ASC
  `)
  return result.rows.map((row) => ({ code: row.code, signups: row.signups }))
}
