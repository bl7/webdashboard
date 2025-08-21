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

  // Add security headers
  const response = NextResponse.next()

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://checkout.stripe.com; frame-src https://js.stripe.com https://checkout.stripe.com;"
  )

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
