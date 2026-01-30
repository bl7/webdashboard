import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Skip middleware for static assets (images, fonts, etc.)
  const staticFileExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.ico', '.pdf', '.mp4', '.txt', '.xml', '.json', '.woff', '.woff2', '.ttf', '.eot']
  const isStaticFile = staticFileExtensions.some(ext => pathname.toLowerCase().endsWith(ext))
  
  if (isStaticFile) {
    return NextResponse.next()
  }
  
  const tokenCookie = req.cookies.get("token")
  // Check if token exists and is not empty/whitespace
  const token = tokenCookie?.value?.trim() || null

  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ]
  
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    // Core marketing pages
    pathname.startsWith("/features") ||
    pathname.startsWith("/plan") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/uses") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/faqs") ||
    // Landing / integration pages
    pathname.startsWith("/printbridge") ||
    pathname.startsWith("/mobile-app") ||
    pathname.startsWith("/kitchen-label-printer") ||
    pathname.startsWith("/label-printer-uk-comparison") ||
    // Allergen & legal resources
    pathname.startsWith("/allergen-compliance") ||
    pathname.startsWith("/allergen-guide") ||
    pathname.startsWith("/privacy-policy") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/cookie-policy") ||
    // Demo / contact entry points
    pathname.startsWith("/bookdemo") ||
    pathname.startsWith("/contact") ||
    // Label-specific landing pages
    pathname.startsWith("/natashas-law") ||
    pathname.startsWith("/prep-labels") ||
    pathname.startsWith("/cooked-labels") ||
    pathname.startsWith("/defrost-labels") ||
    pathname.startsWith("/ingredient-labels") ||
    pathname.startsWith("/expiry-date-labels") ||
    pathname.startsWith("/haccp-labels") ||
    pathname.startsWith("/dissolvable-kitchen-labels")

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

  // For protected routes (including /dashboard and /setup), redirect to login if no valid token
  if (!token || token === "") {
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
     * Note: Static file extensions are handled in the middleware function itself
     */
    "/((?!api|_next/static|_next/image|favicon.ico|boss|features|plan|about|uses|printbridge|allergen-compliance|allergen-guide|bookdemo|blog|faqs|privacy-policy|terms|cookie-policy).*)",
  ],
}

