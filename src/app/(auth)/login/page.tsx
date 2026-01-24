"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import React from "react"
import { LoginForm } from "./form"
import Link from "next/link"
import Image from "next/image"

function getTimeOfDayGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export default function LoginPage() {
  const router = useRouter()
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

        // Check both cookie and localStorage for token
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`
          const parts = value.split(`; ${name}=`)
          if (parts.length === 2) return parts.pop()?.split(';').shift()
          return null
        }

        const cookieToken = getCookie("token")
        const localStorageToken = localStorage.getItem("token")
        const userId = localStorage.getItem("userid")

        // Only redirect if we have BOTH cookie and localStorage token
        // This ensures middleware and client are in sync
        if (cookieToken && localStorageToken && userId) {
          console.log("User already authenticated, redirecting to dashboard")
          clearTimeout(timeoutId)
          router.push("/dashboard")
          return
        }

        // If we have localStorage token but no cookie, sync them
        if (localStorageToken && !cookieToken && userId) {
          const maxAge = 7 * 24 * 60 * 60 // 7 days
          const isSecure = window.location.protocol === 'https:'
          document.cookie = `token=${localStorageToken}; path=/; max-age=${maxAge}; SameSite=Lax${isSecure ? '; Secure' : ''}`
          // After setting cookie, redirect will be handled by middleware on next request
          clearTimeout(timeoutId)
          router.push("/dashboard")
          return
        }

        // User is not authenticated, show login form
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
  }, [router])

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
          <Image src="/logo_sm.png" width={64} height={64} alt="logo" className="object-contain" unoptimized priority />
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
        Copyright © 2026 - current. <Link href="/">InstaLabel Pvt. Ltd.</Link> All rights reserved.
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
