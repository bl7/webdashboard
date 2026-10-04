"use client"

import { useEffect } from "react"

/** Keeps ?code= from an ad link available on the plan step. */
export function CampaignCodeCapture() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code")?.trim()
    if (code) sessionStorage.setItem("campaign_promo_code", code)
  }, [])
  return null
}
