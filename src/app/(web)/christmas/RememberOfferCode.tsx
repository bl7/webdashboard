"use client"

import { useEffect } from "react"

export function RememberOfferCode({ code }: { code: string }) {
  useEffect(() => {
    const next = code.trim()
    if (next) sessionStorage.setItem("campaign_promo_code", next)
  }, [code])
  return null
}
