import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  const isAuthRoute = pathname === "/login" || pathname === "/register"

  // Allow auth routes to pass through without token (users need to access login/register)
  if (isAuthRoute) {
    // If user is already authenticated and tries to access login/register, redirect to dashboard
    if (token) {
      const dashboardUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(dashboardUrl)
    }
    // Otherwise, allow access to login/register pages
    const response = NextResponse.next()
    // Add security headers
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-XSS-Protection", "1; mode=block")
    return response
  }

  // For protected routes, redirect to login if no token
  if (!token) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Allow authenticated users to access setup and other specific routes
  const allowedAuthenticatedRoutes = ["/setup", "/dashboard"]
  if (token && !allowedAuthenticatedRoutes.some(route => pathname.startsWith(route))) {
    const dashboardUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // Add security headers
  const response = NextResponse.next()

  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // X-Frame-Options
  response.headers.set("X-Frame-Options", "DENY")

  // X-Content-Type-Options
  response.headers.set("X-Content-Type-Options", "nosniff")

  // X-XSS-Protection
  response.headers.set("X-XSS-Protection", "1; mode=block")

  return response
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

