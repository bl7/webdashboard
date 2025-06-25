import jwt from "jsonwebtoken"
import { NextApiRequest } from "next"

const JWT_SECRET = process.env.JWT_SECRET || "changeme"

export function getSessionBoss(req: NextApiRequest) {
  // Try to get token from Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null
  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string }
    if (decoded.role === "boss") return decoded
    return null
  } catch {
    return null
  }
}
