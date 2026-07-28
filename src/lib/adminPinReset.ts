import crypto from "crypto"
import pool from "@/lib/pg"
import { sendMail } from "@/lib/mail"

const OTP_TTL_MS = 10 * 60 * 1000
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

let tableReady: Promise<void> | null = null

export function ensureAdminPinResetTable() {
  if (!tableReady) {
    tableReady = pool
      .query(
        `CREATE TABLE IF NOT EXISTS admin_pin_resets (
          user_id TEXT PRIMARY KEY,
          otp_hash TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          reset_token_hash TEXT,
          reset_token_expires TIMESTAMPTZ,
          attempts INT NOT NULL DEFAULT 0,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )`
      )
      .then(() => undefined)
      .catch((err: unknown) => {
        tableReady = null
        throw err
      })
  }
  return tableReady
}

function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex")
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@")
  if (!local || !domain) return "***"
  const visible = local.slice(0, Math.min(2, local.length))
  return `${visible}***@${domain}`
}

export async function getUserEmail(userId: string): Promise<string | null> {
  const result = await pool.query(`SELECT email FROM user_profiles WHERE user_id = $1`, [userId])
  const email = result.rows[0]?.email?.trim()
  return email || null
}

export async function createAndSendAdminPinOtp(userId: string, email: string) {
  await ensureAdminPinResetTable()

  const otp = String(crypto.randomInt(100000, 999999))
  const otpHash = hashValue(otp)
  const expiresAt = new Date(Date.now() + OTP_TTL_MS)

  await pool.query(
    `INSERT INTO admin_pin_resets (user_id, otp_hash, expires_at, reset_token_hash, reset_token_expires, attempts, updated_at)
     VALUES ($1, $2, $3, NULL, NULL, 0, NOW())
     ON CONFLICT (user_id) DO UPDATE SET
       otp_hash = EXCLUDED.otp_hash,
       expires_at = EXCLUDED.expires_at,
       reset_token_hash = NULL,
       reset_token_expires = NULL,
       attempts = 0,
       updated_at = NOW()`,
    [userId, otpHash, expiresAt]
  )

  await sendMail({
    to: email,
    subject: "Your InstaLabel Admin PIN reset code",
    body: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111827;">
        <h2 style="margin-bottom: 8px;">Reset Admin PIN</h2>
        <p style="margin: 0 0 16px;">Use this code to reset your dashboard admin PIN. It expires in 10 minutes.</p>
        <div style="font-size: 32px; letter-spacing: 8px; font-weight: 700; background: #f3f4f6; padding: 16px 20px; border-radius: 8px; text-align: center;">
          ${otp}
        </div>
        <p style="margin-top: 16px; color: #6b7280; font-size: 14px;">If you did not request this, you can ignore this email.</p>
      </div>
    `,
  })

  return maskEmail(email)
}

export async function verifyAdminPinOtp(userId: string, otp: string) {
  await ensureAdminPinResetTable()

  const result = await pool.query(
    `SELECT otp_hash, expires_at, attempts FROM admin_pin_resets WHERE user_id = $1`,
    [userId]
  )
  const row = result.rows[0]
  if (!row) {
    return { ok: false as const, message: "No reset request found. Please request a new code." }
  }
  if (row.attempts >= MAX_ATTEMPTS) {
    return { ok: false as const, message: "Too many attempts. Please request a new code." }
  }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return { ok: false as const, message: "Code expired. Please request a new code." }
  }

  const matches = row.otp_hash === hashValue(otp.trim())
  if (!matches) {
    await pool.query(
      `UPDATE admin_pin_resets SET attempts = attempts + 1, updated_at = NOW() WHERE user_id = $1`,
      [userId]
    )
    return { ok: false as const, message: "Invalid code." }
  }

  const resetToken = crypto.randomBytes(32).toString("hex")
  const resetTokenHash = hashValue(resetToken)
  const resetTokenExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS)

  await pool.query(
    `UPDATE admin_pin_resets SET
       reset_token_hash = $2,
       reset_token_expires = $3,
       otp_hash = $4,
       expires_at = NOW(),
       updated_at = NOW()
     WHERE user_id = $1`,
    [userId, resetTokenHash, resetTokenExpires, hashValue(`used-${Date.now()}`)]
  )

  return { ok: true as const, resetToken }
}

export async function resetAdminPinWithToken(userId: string, resetToken: string, pin: string) {
  await ensureAdminPinResetTable()

  if (!/^\d{4}$/.test(pin)) {
    return { ok: false as const, message: "PIN must be exactly 4 digits." }
  }

  const result = await pool.query(
    `SELECT reset_token_hash, reset_token_expires FROM admin_pin_resets WHERE user_id = $1`,
    [userId]
  )
  const row = result.rows[0]
  if (!row?.reset_token_hash || !row.reset_token_expires) {
    return { ok: false as const, message: "Invalid or expired reset session." }
  }
  if (new Date(row.reset_token_expires).getTime() < Date.now()) {
    return { ok: false as const, message: "Reset session expired. Please start again." }
  }
  if (row.reset_token_hash !== hashValue(resetToken)) {
    return { ok: false as const, message: "Invalid or expired reset session." }
  }

  await pool.query(
    `INSERT INTO admin_access (user_id, pin)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET pin = EXCLUDED.pin`,
    [userId, pin]
  )

  await pool.query(`DELETE FROM admin_pin_resets WHERE user_id = $1`, [userId])

  return { ok: true as const }
}
