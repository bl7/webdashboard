// import { NextRequest, NextResponse } from "next/server"

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl
//   const token = req.cookies.get("token")?.value

//   const isAuthRoute = pathname === "/login" || pathname === "/register"

//   if (!token && isAuthRoute) {
//     const loginUrl = new URL("/login", req.url)
//     return NextResponse.redirect(loginUrl)
//   }

//   // Allow authenticated users to access setup and other specific routes
//   const allowedAuthenticatedRoutes = ["/setup", "/dashboard"]
//   if (token && !isAuthRoute && !allowedAuthenticatedRoutes.includes(pathname)) {
//     const dashboardUrl = new URL("/dashboard", req.url)
//     return NextResponse.redirect(dashboardUrl)
//   }

//   // Add security headers
//   const response = NextResponse.next()

//   // Referrer Policy
//   response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

//   // X-Frame-Options
//   response.headers.set("X-Frame-Options", "DENY")

//   // X-Content-Type-Options
//   response.headers.set("X-Content-Type-Options", "nosniff")

//   // X-XSS-Protection
//   response.headers.set("X-XSS-Protection", "1; mode=block")

//   return response
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - boss (boss routes - handled separately)
//      * - public web pages (features, plan, about, etc.)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|boss|features|plan|about|uses|printbridge|square-integration|allergen-compliance|allergen-guide|bookdemo|blog|faqs|privacy-policy|terms|cookie-policy).*)",
//   ],
// }



import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get("token")?.value

  // ✅ Auth pages (public)
  // Use startsWith to handle /login/, /login/reset, /register/verify etc.
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")

  // ✅ If logged in, block access to auth pages
  if (token && isAuthRoute) {
    const dashboardUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // ✅ If NOT logged in, protect everything except auth pages
  if (!token && !isAuthRoute) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // ✅ Optional: restrict logged-in users to only specific routes
  // Keep this ONLY if you truly want to force users back to /dashboard
  const allowedAuthenticatedRoutes = ["/setup", "/dashboard"]
  if (
    token &&
    !isAuthRoute &&
    !allowedAuthenticatedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const dashboardUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // Add security headers
  const response = NextResponse.next()

  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|boss|features|plan|about|uses|printbridge|square-integration|allergen-compliance|allergen-guide|bookdemo|blog|faqs|privacy-policy|terms|cookie-policy).*)",
  ],
}
