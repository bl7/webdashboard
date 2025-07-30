"use client"

import { useEffect } from 'react'

export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical images
    const preloadImages = [
      '/instaLabel.png',
      '/logo_sm.png',
      '/long_longwhite.png'
    ]

    preloadImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })

    // Preload critical CSS
    const preloadCSS = document.createElement('link')
    preloadCSS.rel = 'preload'
    preloadCSS.as = 'style'
    preloadCSS.href = '/globals.css'
    document.head.appendChild(preloadCSS)

    // Prefetch critical routes
    const prefetchRoutes = [
      '/register',
      '/bookdemo',
      '/features'
    ]

    prefetchRoutes.forEach(route => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = route
      document.head.appendChild(link)
    })
  }, [])

  return null
} 