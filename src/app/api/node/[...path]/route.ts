import { NextRequest, NextResponse } from "next/server"
import { buildNodeTarget } from "@/lib/nodeProxy"
import { CUSTOMER_COOKIE } from "@/lib/sessionCookie"

export const dynamic = "force-dynamic"

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const token = request.cookies.get(CUSTOMER_COOKIE)?.value
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const base = process.env.NEXT_PUBLIC_API_URL
  const { path } = await context.params
  const target = buildNodeTarget(base || "", path || [], request.nextUrl.search)
  if (!target) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 })
  }

  const headers = new Headers()
  headers.set("Authorization", `Bearer ${token}`)
  const accept = request.headers.get("accept")
  const contentType = request.headers.get("content-type")
  if (accept) headers.set("Accept", accept)
  if (contentType) headers.set("Content-Type", contentType)

  const method = request.method.toUpperCase()
  const hasBody = method !== "GET" && method !== "HEAD"
  const upstream = await fetch(target, {
    method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    redirect: "manual",
  })

  const responseHeaders = new Headers()
  const upstreamType = upstream.headers.get("content-type")
  const disposition = upstream.headers.get("content-disposition")
  if (upstreamType) responseHeaders.set("content-type", upstreamType)
  if (disposition) responseHeaders.set("content-disposition", disposition)
  return new NextResponse(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export const GET = proxy
export const POST = proxy
export const PUT = proxy
export const PATCH = proxy
export const DELETE = proxy
