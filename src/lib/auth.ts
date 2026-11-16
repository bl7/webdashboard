import { NextRequest } from "next/server"
import { jwtVerify, SignJWT } from "jose"
import { getJwtSecret } from "@/lib/jwtSecret"

// Bearer tokens stay in localStorage and a JavaScript-readable cookie because
// label_it_node and the mobile client authenticate with Authorization headers.
// Do not switch this app to an HttpOnly cookie until those clients are updated.

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

export async function verifyAuthToken(req: NextRequest) {
  const token = getTokenFromHeader(req) || getTokenFromCookie(req)
  if (!token) {
    throw new Error("Unauthorized: No token provided")
  }

  const payload = await verifyToken(token)
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
