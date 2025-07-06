"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui"
import Image from "next/image"

const navItems = [
  { label: "Uses", href: "/uses" },
  { label: "Features", href: "/features" },
  { label: "PrintBridge", href: "/printbridge" },
  { label: "Plan", href: "/plan" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/about#contact" },
]

export const Header = () => {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

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
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6 md:px-12 lg:px-16">
        {/* Enhanced Logo with premium styling */}
        <Link
          href="/"
          className={cn(
            "flex items-center transition-all duration-300 ease-out",
            "hover:scale-105 active:scale-95"
          )}
        >
          <div className="relative overflow-hidden rounded-xl p-1">
            <Image
              src="/logo_long.png"
              alt="InstaLabel"
              width={140}
              height={32}
              priority
              className="transition-all duration-300 hover:brightness-110 drop-shadow-sm"
            />
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out hover:translate-x-full" />
          </div>
        </Link>

        {/* Navigation + CTA + Auth moved to right */}
        <div className="flex items-center gap-10">
          {/* Enhanced Desktop Nav */}
          <nav className="hidden items-center gap-8 text-base font-semibold text-gray-800 md:flex">
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

          {/* Enhanced CTA + Auth */}
          <div className="flex items-center gap-4">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "h-11 rounded-full px-6 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              )}
            >
              Free Trial
            </Link>

            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 rounded-full px-5 text-base border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-800 font-semibold transition-all duration-300 hover:scale-105"
              )}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Nav */}
      <div
        className={cn(
          "container border-t px-4 transition-all duration-300 ease-out sm:px-6 md:hidden md:px-12 lg:px-16",
          isScrolled ? "border-purple-200/30 bg-white/90 backdrop-blur-lg" : "border-purple-200/20 bg-white/80 backdrop-blur-md"
        )}
      >
        <nav className="flex h-14 items-center justify-center gap-6 text-base font-semibold text-gray-700">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-all duration-300 hover:scale-105",
                "duration-300 animate-in fade-in slide-in-from-bottom-2",
                isActive(item.href) ? "font-bold text-purple-700" : "hover:text-purple-600"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}