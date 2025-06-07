"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui"
import Image from "next/image"

const navItems = [
  { label: "Features", href: "/features" },
  { label: "Plan", href: "/plan" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/about#contact" },
]

export const Header = () => {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href.replace("#", ""))
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo_long.png" alt="InstaLabel" width={120} height={28} priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-base font-medium text-gray-800 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary",
                isActive(item.href)
                  ? "border-b-2 border-primary font-semibold text-primary"
                  : "text-gray-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Auth */}
        <div className="flex items-center gap-2">
          <Link
            href="/book"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "h-9 rounded-full px-5 text-base"
            )}
          >
            Book a Demo
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

      {/* Mobile Nav */}
      <div className="container border-t md:hidden">
        <nav className="flex h-11 items-center justify-center gap-5 text-base font-medium text-gray-700">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary",
                isActive(item.href) ? "font-semibold text-primary" : ""
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
