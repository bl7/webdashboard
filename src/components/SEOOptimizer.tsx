"use client"

import { useEffect } from 'react'
import Head from 'next/head'

interface SEOOptimizerProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  structuredData?: object
}

export const SEOOptimizer = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  structuredData
}: SEOOptimizerProps) => {
  useEffect(() => {
    // Preload critical resources
    const preloadLinks = [
      { rel: 'preload', href: '/fonts/manrope.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'preload', href: '/fonts/oxygen.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
      { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ]

    // Add preload links to head
    preloadLinks.forEach(link => {
      const linkElement = document.createElement('link')
      Object.entries(link).forEach(([key, value]) => {
        if (value !== undefined) {
          linkElement.setAttribute(key, value)
        }
      })
      document.head.appendChild(linkElement)
    })

    // Cleanup function
    return () => {
      // Remove preload links on unmount
      preloadLinks.forEach(link => {
        const existingLink = document.querySelector(`link[href="${link.href}"]`)
        if (existingLink) {
          existingLink.remove()
        }
      })
    }
  }, [])

  return (
    <Head>
      {/* Meta tags */}
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="InstaLabel" />
      
      {/* Twitter Card */}
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      
      {/* Performance optimizations */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#7c3aed" />
      <meta name="msapplication-TileColor" content="#7c3aed" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      
      {/* Performance hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </Head>
  )
} 