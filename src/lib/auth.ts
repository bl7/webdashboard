import { NextRequest } from "next/server"
import { jwtVerify, SignJWT } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "changeme"

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function createToken(payload: any) {
  const secret = new TextEncoder().encode(JWT_SECRET)
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
  const token = getTokenFromHeader(req)
  if (!token) {
    throw new Error("Unauthorized: No token provided")
  }
  
  const payload = await verifyToken(token)
  if (!payload) {
    throw new Error("Unauthorized: Invalid token")
  }
  
  // Extract uuid from payload (prioritize uuid over id)
  const userUuid = payload.uuid || payload.id
  if (!userUuid) {
    throw new Error("Unauthorized: No user identifier found in token")
  }
  
  return { payload, userUuid }
}

export function requireAuth(req: NextRequest) {
  const token = getTokenFromCookie(req)
  if (!token) {
    throw new Error("Unauthorized: Authentication required")
  }
  return token
}
