'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { X as CloseIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerOverlay,
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
      <DrawerContent className="p-0 max-w-sm w-full bg-white">
        <DrawerHeader className="flex flex-row items-center justify-between border-b border-purple-100 p-6">
          <DrawerTitle className="text-xl font-bold text-purple-700">Menu</DrawerTitle>
          <DrawerClose asChild>
            <button
              onClick={onClose}
              className={cn(
                "p-2 rounded-full hover:bg-purple-50 transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              )}
              aria-label="Close menu"
            >
              <CloseIcon className="h-6 w-6 text-purple-700" />
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
                      "hover:text-purple-600 hover:translate-x-1",
                      "focus:outline-none focus:text-purple-600",
                      "relative py-2",
                      isActive(item.href) 
                        ? "text-purple-700" 
                        : "text-gray-700"
                    )}
                    onClick={onClose}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full" />
                    )}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
        <div className="px-6 py-8 border-t border-purple-100 space-y-4">
          <Link
            href="/register"
            className={cn(
              "block w-full rounded-full px-6 py-3 text-center font-bold",
              "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
              "hover:from-purple-700 hover:to-pink-700",
              "transform transition-all duration-200 hover:scale-105",
              "shadow-lg hover:shadow-xl",
              "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            )}
            onClick={onClose}
          >
            Free Trial
          </Link>
          <Link
            href="/login"
            className={cn(
              "block w-full rounded-full px-6 py-3 text-center font-semibold",
              "border-2 border-purple-200 text-purple-700",
              "hover:bg-purple-50 hover:border-purple-300 hover:text-purple-800",
              "transform transition-all duration-200 hover:scale-105",
              "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            )}
            onClick={onClose}
          >
            Sign In
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  )
}