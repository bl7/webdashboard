'use client'
import React from 'react'
import Link from 'next/link'
import { X as CloseIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from '@/components/ui/drawer'

interface NavItem {
  label: string
  href: string
  hideOnMobile?: boolean
}

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  navItems: NavItem[]
  isActive: (href: string) => boolean
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose, navItems, isActive }) => {
  return (
    <Drawer open={open} onOpenChange={open => !open ? onClose() : undefined}>
      <DrawerContent className="marketing w-full max-w-sm bg-white p-0">
        <DrawerHeader className="flex flex-row items-center justify-between border-b border-mkt-steel1 p-6">
          <DrawerTitle className="text-xl font-bold text-mkt-ink">Menu</DrawerTitle>
          <DrawerClose asChild>
            <button
              onClick={onClose}
              className={cn(
                "p-2 rounded-md hover:bg-mkt-canvas transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-offset-2"
              )}
              style={{ outlineColor: "#142124" }}
              aria-label="Close menu"
            >
              <CloseIcon className="h-6 w-6 text-mkt-ink" />
            </button>
          </DrawerClose>
        </DrawerHeader>
        <nav className="flex-1 px-6 py-8">
          <ul className="space-y-6">
            {navItems
              .filter(item => !item.hideOnMobile)
              .map((item, index) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block text-lg font-semibold transition-all duration-200",
                      "hover:text-mkt-teal",
                      "relative py-2",
                      isActive(item.href)
                        ? "text-mkt-ink"
                        : "text-mkt-ink8"
                    )}
                    onClick={onClose}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full" style={{ backgroundColor: "#142124" }} />
                    )}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
        <div className="px-6 py-8 border-t border-mkt-steel1 space-y-4">
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
            Sign in
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
