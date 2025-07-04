"use client"

import React, { useEffect, useState } from "react"
import MultiStepProfileSetup from "./ProfileSetup"
import { useRouter } from "next/navigation"

export default function ProfileSetupPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUserId = localStorage.getItem("userid")
    setUserId(storedUserId)
    // Check for subscription data
    const subscription = localStorage.getItem("subscription")
    if (subscription) {
      router.replace("/dashboard")
      return
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!userId) {
    return <div>Please login first.</div>
  }

  return <MultiStepProfileSetup userId={userId} />
}
