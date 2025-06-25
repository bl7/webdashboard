import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  const { data } = await req.json()
  const privateKey = process.env.QZ_PRIVATE_KEY
  if (!privateKey) {
    return new NextResponse("Missing private key", { status: 500 })
  }
  try {
    const sign = crypto.createSign("SHA1")
    sign.update(data)
    sign.end()
    const signature = sign.sign(privateKey, "base64")
    return new NextResponse(signature, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    })
  } catch (err) {
    return new NextResponse("Signing error", { status: 500 })
  }
} 