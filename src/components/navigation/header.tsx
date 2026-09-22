"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ChevronDown, Menu as MenuIcon } from "lucide-react"
import { MobileMenu } from "@/components/navigation/mobile-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PRODUCT_NAV, RESOURCES_NAV } from "@/lib/marketing/site"

const simpleNav = [
  { label: "Kitchen workflows", href: "/uses" },
  { label: "Pricing", href: "/plan" },
  { label: "About", href: "/about" },
]

export const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
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

  const isGroupActive = (items: readonly { href: string }[]) =>
    items.some((item) => isActive(item.href))

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
          </div>
        </Link>
        <div className="hidden items-center gap-4 sm:gap-8 lg:gap-10 md:flex">
          <nav className="items-center gap-4 text-sm font-semibold text-gray-800 sm:gap-6 sm:text-base md:flex lg:gap-8">
            <NavDropdown
              label="Product"
              items={PRODUCT_NAV}
              active={isGroupActive(PRODUCT_NAV)}
              onNavigate={(href) => router.push(href)}
            />
            {simpleNav.map((item) => (
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
                  <div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: "#142124" }}
                  />
                )}
              </Link>
            ))}
            <NavDropdown
              label="Resources"
              items={RESOURCES_NAV}
              active={isGroupActive(RESOURCES_NAV)}
              onNavigate={(href) => router.push(href)}
            />
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="inline-flex h-9 items-center px-3 text-sm font-semibold text-mkt-ink hover:text-mkt-teal sm:h-11 sm:px-5 sm:text-base"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center rounded-md px-4 text-sm font-semibold text-white sm:h-11 sm:px-6 sm:text-base"
              style={{ backgroundColor: "#142124", backgroundImage: "none" }}
            >
              Start free trial
            </Link>
          </div>
        </div>
        <button
          className="flex items-center justify-center rounded-lg p-2 hover:bg-mkt-canvas focus:outline-none md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <MenuIcon className="h-7 w-7 text-mkt-ink" />
        </button>
      </div>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} isActive={isActive} />
    </header>
  )
}

function NavDropdown({
  label,
  items,
  active,
  onNavigate,
}: {
  label: string
  items: readonly { label: string; href: string }[]
  active: boolean
  onNavigate: (href: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "relative inline-flex items-center gap-1 outline-none transition-all duration-300 hover:scale-105",
          active ? "font-bold text-mkt-ink" : "text-mkt-ink8 hover:text-mkt-teal"
        )}
      >
        {label}
        <ChevronDown className="h-4 w-4" />
        {active && (
          <div
            className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
            style={{ backgroundColor: "#142124" }}
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-56 border-mkt-steel1 bg-white p-1"
      >
        {items.map((item) => (
          <DropdownMenuItem
            key={item.href}
            className="cursor-pointer"
            style={{ color: "#142124" }}
            onSelect={() => onNavigate(item.href)}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
