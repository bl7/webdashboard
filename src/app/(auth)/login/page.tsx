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
    const checkAuthStatus = () => {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userid")

      // If user is already logged in, redirect to dashboard
      if (token && userId) {
        console.log("User already authenticated, redirecting to dashboard")
        router.push("/dashboard")
        return
      }

      // User is not authenticated, show login form
      setIsLoading(false)
    }

    checkAuthStatus()
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
          <Image src="/logo_sm.png" width={64} height={64} alt="logo" className="object-contain" />
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
