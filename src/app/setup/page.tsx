"use client"

import React, { useEffect, useState } from "react"
import MultiStepProfileSetup from "./ProfileSetup"

export default function ProfileSetupPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUserId = localStorage.getItem("userid")
    setUserId(storedUserId)
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
