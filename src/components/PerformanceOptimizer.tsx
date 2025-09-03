"use client"

import { useEffect } from "react"

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical images from public folder
    const preloadImages = ["/logo_sm.png", "/long_longwhite.png"]

    preloadImages.forEach((src) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "image"
      link.href = src
      document.head.appendChild(link)
    })

    // Note: globals.css is automatically handled by Next.js
    // No need to manually preload it

    // Prefetch critical routes
    const prefetchRoutes = ["/register", "/bookdemo", "/features"]

    prefetchRoutes.forEach((route) => {
      const link = document.createElement("link")
      link.rel = "prefetch"
      link.href = route
      document.head.appendChild(link)
    })
  }, [])

  return null
}
