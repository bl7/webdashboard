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

    // Check if user has completed profile setup and has an active subscription
    const checkUserStatus = async () => {
      if (!storedUserId) {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }

        const [profileRes, subRes] = await Promise.all([
          fetch(`/api/profile?user_id=${storedUserId}`),
          fetch(`/api/subscription_better/status`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ])

        if (profileRes.ok && subRes.ok) {
          const { profile } = await profileRes.json()
          const { subscription } = await subRes.json()

          // Only redirect if user has both profile and active/trial subscription
          if (
            profile?.company_name &&
            profile?.email &&
            (subscription?.status === "active" || subscription?.status === "trialing")
          ) {
            router.replace("/dashboard")
            return
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error)
      }

      setLoading(false)
    }

    checkUserStatus()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!userId) {
    return <div>Please login first.</div>
  }

  return <MultiStepProfileSetup userId={userId} />
}
