import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const token = localStorage.getItem("token")
  console.log("im working bruv")
  const isAuthRoute =
    req.nextUrl.pathname === "/login" ||
    req.nextUrl.pathname === "/register" ||
    req.nextUrl.pathname === "/features" ||
    req.nextUrl.pathname === "/plan" ||
    req.nextUrl.pathname === "/about"
  // req.nextUrl.pathname === "/"

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
