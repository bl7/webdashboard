import { NextRequest, NextResponse } from "next/server"

export function userAuthMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value
  
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/features" ||
    pathname === "/plan" ||
    pathname === "/about"

  if (!token && isAuthRoute) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  if (token && !isAuthRoute) {
    const dashboardUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
} 