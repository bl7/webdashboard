"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Menu as MenuIcon } from "lucide-react"
import { MobileMenu } from "@/components/navigation/mobile-menu"

const navItems = [
  { label: "Uses", href: "/uses" },
  { label: "Features", href: "/features" },
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
        "fixed left-0 right-0 top-0 z-50 w-full border-b transition-all duration-500 ease-out",
        isScrolled
          ? "border-mkt-steel1 bg-white/95 shadow-sm backdrop-blur-xl"
          : "border-mkt-steel1/60 bg-white/90 backdrop-blur-lg"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-2 sm:h-20 sm:px-4 md:px-12 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "flex h-full items-center transition-all duration-300 ease-out",
            "hover:scale-105 active:scale-95"
          )}
        >
          <div className="relative flex h-full items-center overflow-hidden rounded-xl p-1 sm:p-2">
            <Image
              src="/logo_long.svg"
              alt="InstaLabel"
              width={140}
              height={38}
              priority
              className="drop-shadow-sm transition-all duration-300 hover:brightness-110"
              style={{ display: "block", margin: "0 auto" }}
            />
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out hover:translate-x-full" />
          </div>
        </Link>
        {/* Desktop Nav + CTA */}
        <div className="hidden items-center gap-4 sm:gap-10 md:flex">
          <nav className="items-center gap-4 text-sm font-semibold text-gray-800 sm:gap-8 sm:text-base md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative transition-all duration-300 hover:scale-105",
                  isActive(item.href)
                    ? "font-bold text-mkt-ink"
                    : "text-mkt-ink8 hover:text-mkt-teal"
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: "#142124" }} />
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/register"
              className="inline-flex h-9 items-center rounded-md px-4 text-sm font-semibold text-white sm:h-11 sm:px-6 sm:text-base"
              style={{ backgroundColor: "#142124", backgroundImage: "none" }}
            >
              Start free trial
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center px-3 text-sm font-semibold text-mkt-ink hover:text-mkt-teal sm:h-11 sm:px-5 sm:text-base"
            >
              Sign in
            </Link>
          </div>
        </div>
        {/* Hamburger for mobile */}
        <button
          className="flex items-center justify-center rounded-lg p-2 hover:bg-mkt-canvas focus:outline-none md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon className="h-7 w-7 text-mkt-ink" />
        </button>
      </div>
      {/* Mobile Drawer */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
        isActive={isActive}
      />
    </header>
  )
}
