import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { data } = await req.json()
  // TODO: In production, sign 'data' with your private key and return the signature
  // For now, return a placeholder
  const signature = process.env.QZ_SIGNATURE || "PLACEHOLDER_SIGNATURE"
  return new NextResponse(signature, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  })
}
