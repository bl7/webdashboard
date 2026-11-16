"use client"

import { useEffect, useState } from "react"
import React from "react"
import { LoginForm } from "./form"
import Link from "next/link"

function getTimeOfDayGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // Max 1 second to check auth

    const checkAuthStatus = () => {
      try {
        // Check if we're in the browser (not SSR)
        if (typeof window === "undefined") {
          setIsLoading(false)
          return
        }

        localStorage.removeItem("token")

        // A valid session is an HttpOnly cookie. Middleware redirects that request.
        clearTimeout(timeoutId)
        setIsLoading(false)
      } catch (error) {
        // If localStorage/cookie access fails, just show the form
        console.error("Error checking auth status:", error)
        clearTimeout(timeoutId)
        setIsLoading(false)
      }
    }

    // Small delay to ensure we're in the browser and DOM is ready
    const checkId = setTimeout(checkAuthStatus, 100)
    
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(checkId)
    }
  }, [])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    )
  }
  return (
    <section className="flex h-full min-h-fit w-full flex-col justify-between py-12">
      <div className="flex items-center justify-between">
        <div className="flex flex-shrink-0 items-center justify-center">
          <img src="/logo_sm.png" width={64} height={64} alt="logo" className="object-contain" />
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-primary">instalabel</h2>
        </div>
      </div>

      <div>
        <div className="mt-6">
          <p className="text-3xl font-medium text-muted-foreground">
            {getTimeOfDayGreeting()}, Welcome Back
          </p>
          <p className="text-lg text-muted-foreground">Please login to your account to continue</p>
        </div>
        <div className="mt-6 w-full">
          <LoginForm />
        </div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Copyright © 2026 - current. <Link href="/">INSTALABEL LIMITED</Link> All rights reserved.
        <div className="mt-2 flex gap-4 text-xs">
          <Link href="/features" className="hover:underline">
            Features
          </Link>
          <Link href="/plan" className="hover:underline">
            Pricing
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/faqs" className="hover:underline">
            Help
          </Link>
        </div>
      </div>
    </section>
  )
}
