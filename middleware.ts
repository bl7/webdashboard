import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ]
  
  const isPublicRoute = publicRoutes.includes(pathname) || 
    pathname.startsWith("/features") ||
    pathname.startsWith("/plan") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/uses") ||
    pathname.startsWith("/printbridge") ||
    pathname.startsWith("/square-integration") ||
    pathname.startsWith("/allergen-compliance") ||
    pathname.startsWith("/allergen-guide") ||
    pathname.startsWith("/bookdemo") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/faqs") ||
    pathname.startsWith("/privacy-policy") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/cookie-policy")

  // Allow public routes to pass through
  if (isPublicRoute) {
    // If user is authenticated and tries to access login/register, redirect to dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
      const dashboardUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(dashboardUrl)
    }
    
    // Otherwise, allow access to public routes
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

  // Allow authenticated users to access setup and dashboard routes
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

