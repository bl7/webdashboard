"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui"
import Image from "next/image"
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react"

const navItems = [
  { label: "Uses", href: "/uses" },
  { label: "Features", href: "/features" },
  { label: "PrintBridge", href: "/printbridge" },
  { label: "Plan", href: "/plan" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/about#contact", hideOnMobile: true },
]

export const Header = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href.replace("#", ""))
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-500 ease-out",
        isScrolled
          ? "border-purple-200/30 bg-white/95 shadow-xl backdrop-blur-xl"
          : "border-purple-200/20 bg-white/85 backdrop-blur-lg"
      )}
    >
      <div className="container flex h-16 sm:h-20 items-center justify-between px-2 sm:px-4 md:px-12 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "flex items-center h-full transition-all duration-300 ease-out", 
            "hover:scale-105 active:scale-95"
          )}
        >
          <div className="relative flex items-center  h-full overflow-hidden rounded-xl p-1 sm:p-2"> 
            <Image
              src="/logo_long.svg"
              alt="InstaLabel"
              width={140}
              height={38}
              priority
              className="transition-all duration-300 hover:brightness-110 drop-shadow-sm"
              style={{ display: 'block', margin: '0 auto' }}
            />
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out hover:translate-x-full" />
          </div>
        </Link>
        {/* Desktop Nav + CTA */}
        <div className="hidden md:flex items-center gap-4 sm:gap-10">
          <nav className="items-center gap-4 sm:gap-8 text-sm sm:text-base font-semibold text-gray-800 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative transition-all duration-300 hover:scale-105",
                  isActive(item.href)
                    ? "text-purple-700 font-bold"
                    : "text-gray-700 hover:text-purple-600"
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "h-9 sm:h-11 rounded-full px-4 sm:px-6 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              )}
            >
              Free Trial
            </Link>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-9 sm:h-11 rounded-full px-3 sm:px-5 text-sm sm:text-base border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-800 font-semibold transition-all duration-300 hover:scale-105"
              )}
            >
              Sign In
            </Link>
          </div>
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-purple-100 focus:outline-none"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon className="h-7 w-7 text-purple-700" />
        </button>
      </div>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-left-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-lg text-purple-700">Menu</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <CloseIcon className="h-7 w-7 text-purple-700" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-lg font-semibold transition-all duration-200 hover:text-purple-600",
                    isActive(item.href) ? "text-purple-700" : "text-gray-700"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 mt-8">
              <Link
                href="/register"
                className="rounded-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow hover:from-purple-700 hover:to-pink-700 text-center"
                onClick={() => setMobileOpen(false)}
              >
                Free Trial
              </Link>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-800 text-center font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </header>
  )
}