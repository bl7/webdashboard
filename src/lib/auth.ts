import { NextRequest } from "next/server"
import { jwtVerify, SignJWT } from "jose"
import { getJwtSecret } from "@/lib/jwtSecret"

// The website session is an HttpOnly cookie. The phone app still sends Authorization.

export async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(getJwtSecret())
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function createToken(payload: any) {
  const secret = new TextEncoder().encode(getJwtSecret())
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret)
}

export function getTokenFromCookie(req: NextRequest) {
  return req.cookies.get("token")?.value
}

export function getTokenFromHeader(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7) // Remove "Bearer " prefix
}

function sessionCandidates(req: NextRequest) {
  const header = getTokenFromHeader(req)
  const customer = req.cookies.get("token")?.value
  const boss = req.cookies.get("bossToken")?.value
  if (req.headers.get("x-session-role") === "boss") return [boss, header, customer]
  return [header, customer, boss]
}

export async function readSessionToken(req: NextRequest) {
  for (const candidate of sessionCandidates(req)) {
    if (candidate && (await verifyToken(candidate))) return candidate
  }
  return null
}

export async function verifyAuthToken(req: NextRequest) {
  let payload = null
  for (const candidate of sessionCandidates(req)) {
    if (!candidate) continue
    payload = await verifyToken(candidate)
    if (payload) break
  }
  if (!payload) {
    throw new Error("Unauthorized: Invalid token")
  }

  // Boss token: role: 'boss'
  // User token: no role or role !== 'boss'
  let role: 'boss' | 'user' = 'user'
  if (payload.role === 'boss') role = 'boss'

  const userUuid = payload.uuid || payload.id
  if (!userUuid) {
    throw new Error("Unauthorized: No user identifier found in token")
  }

  return { payload, userUuid, role }
}

export function requireAuth(req: NextRequest) {
  const token = getTokenFromCookie(req)
  if (!token) {
    throw new Error("Unauthorized: Authentication required")
  }
  return token
}
