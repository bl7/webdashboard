"use client"
import React from "react"
import Link from "next/link"
import { X as CloseIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer"
import { PRODUCT_NAV, RESOURCES_NAV } from "@/lib/marketing/site"

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  isActive: (href: string) => boolean
}

const groups = [
  { heading: "Product", items: PRODUCT_NAV },
  { heading: "Kitchen workflows", items: [{ label: "All workflows", href: "/uses" }] },
  { heading: "Pricing", items: [{ label: "Pricing", href: "/plan" }] },
  { heading: "Resources", items: RESOURCES_NAV },
  { heading: "Company", items: [{ label: "About", href: "/about" }] },
]

export const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose, isActive }) => {
  return (
    <Drawer open={open} onOpenChange={(next) => (!next ? onClose() : undefined)}>
      <DrawerContent className="marketing w-full max-w-sm bg-white p-0">
        <DrawerHeader className="flex flex-row items-center justify-between border-b border-mkt-steel1 p-6">
          <DrawerTitle className="text-xl font-bold text-mkt-ink">Menu</DrawerTitle>
          <DrawerClose asChild>
            <button
              onClick={onClose}
              className={cn(
                "rounded-md p-2 transition-colors duration-200 hover:bg-mkt-canvas",
                "focus:outline-none focus:ring-2 focus:ring-offset-2"
              )}
              style={{ outlineColor: "#142124" }}
              aria-label="Close menu"
            >
              <CloseIcon className="h-6 w-6 text-mkt-ink" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        <nav className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.heading}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-mkt-steel">
                  {group.heading}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block py-2 text-base font-semibold",
                          isActive(item.href) ? "text-mkt-ink" : "text-mkt-ink8 hover:text-mkt-teal"
                        )}
                        onClick={onClose}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
        <div className="space-y-4 border-t border-mkt-steel1 px-6 py-8">
          <Link
            href="/register"
            className="block w-full rounded-md px-6 py-3 text-center font-semibold text-white"
            style={{ backgroundColor: "#142124", backgroundImage: "none" }}
            onClick={onClose}
          >
            Start free trial
          </Link>
          <Link
            href="/login"
            className="block w-full rounded-md px-6 py-3 text-center font-semibold text-mkt-ink"
            onClick={onClose}
          >
            Log in
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
