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

export function requireAuth(req: NextRequest) {
  const token = getTokenFromCookie(req)
  if (!token) {
    throw new Error("Unauthorized: Authentication required")
  }
  return token
}
