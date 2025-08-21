import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  const isAuthRoute = pathname === "/login" || pathname === "/register"

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

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - boss (boss routes - handled separately)
     * - public web pages (features, plan, about, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|boss|features|plan|about|uses|printbridge|square-integration|allergen-compliance|allergen-guide|bookdemo|blog|faqs|privacy-policy|terms|cookie-policy).*)",
  ],
}
