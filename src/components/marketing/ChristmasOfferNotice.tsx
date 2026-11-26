"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

import { isChristmasOfferActive } from "@/lib/marketing/trialOffer"

const SEEN = "xmas-offer-seen"

export function ChristmasOfferNotice() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (pathname === "/christmas") return
    if (!isChristmasOfferActive()) return
    if (sessionStorage.getItem(SEEN)) return
    let waited = false
    const heroClear = () => {
      const hero = document.querySelector("h1")
      if (!hero) return true
      return hero.getBoundingClientRect().bottom < 80
    }
    const maybeOpen = () => {
      if (sessionStorage.getItem(SEEN)) return
      if (waited && heroClear()) setOpen(true)
    }
    const timer = window.setTimeout(() => {
      waited = true
      maybeOpen()
    }, 15000)
    window.addEventListener("scroll", maybeOpen, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("scroll", maybeOpen)
    }
  }, [pathname])

  function dismiss() {
    sessionStorage.setItem(SEEN, "1")
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) dismiss()
      }}
    >
      <DialogContent
        className="max-w-md border-0 p-8 text-center sm:rounded-2xl"
        style={{ background: "#f6efe6", color: "#2c241c" }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6d6256]">
          Christmas offer
        </p>
        <DialogTitle
          className="mt-3 text-center font-serif text-4xl font-normal leading-none text-[#9c1c2e]"
          style={{ fontFamily: "Georgia, Palatino, serif" }}
        >
          Merry Christmas
        </DialogTitle>
        <DialogDescription className="mt-4 text-base leading-relaxed text-[#2c241c]">
          New customers get 60 days free. An annual plan also gets 30% off the first payment.
          The offer ends on 10 January 2027.
        </DialogDescription>
        <Link
          href="/christmas"
          onClick={dismiss}
          className="mt-6 inline-flex justify-center rounded-full bg-[#9c1c2e] px-5 py-3 text-sm font-extrabold text-white no-underline hover:bg-[#7e1424]"
        >
          See the offer
        </Link>
      </DialogContent>
    </Dialog>
  )
}
