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
        "fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ease-in-out",
        isScrolled
          ? "border-gray-200/50 bg-white/95 shadow-lg backdrop-blur-lg"
          : "border-gray-200/30 bg-white/80 backdrop-blur-md"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 md:px-12 lg:px-16">
        {/* Logo with hover animation */}
        <Link
          href="/"
          className={cn(
            "flex items-center transition-all duration-300 ease-out",
            "hover:scale-105 active:scale-95"
          )}
        >
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src="/logo_long.png"
              alt="InstaLabel"
              width={120}
              height={28}
              priority
              className="transition-all duration-300 hover:brightness-110"
            />
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out hover:translate-x-full" />
          </div>
        </Link>

        {/* Navigation + CTA + Auth moved to right */}
        <div className="flex items-center gap-8">
          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 text-base font-medium text-gray-800 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors duration-200",
                  isActive(item.href)
                    ? "border-b-2 border-primary font-semibold text-primary"
                    : "text-gray-700 hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Auth */}
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "h-9 rounded-full px-5 text-base"
              )}
            >
              Free Trial
            </Link>

            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "h-9 rounded-full px-4 text-base"
              )}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Nav with slide-in animation */}
      <div
        className={cn(
          "container border-t px-4 transition-all duration-300 ease-out sm:px-6 md:hidden md:px-12 lg:px-16",
          isScrolled ? "border-gray-200/50 bg-white/50" : "border-gray-200/30"
        )}
      >
        <nav className="flex h-12 items-center justify-center gap-6 text-base font-medium text-gray-700">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors duration-200",
                "duration-300 animate-in fade-in slide-in-from-bottom-2",
                isActive(item.href) ? "font-semibold text-primary" : "hover:text-primary"
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