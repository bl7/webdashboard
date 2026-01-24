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

  // ✅ Public marketing routes (no login needed)
  const isPublicRoute =
    pathname === "/" ||
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

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // ✅ Auth routes (public)
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-otp")

  // ✅ If logged in, block auth pages
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // ✅ If NOT logged in, protect everything except auth routes
  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // ✅ Add security headers
  const response = NextResponse.next()
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|boss).*)",
  ],
}
