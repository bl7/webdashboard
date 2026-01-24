"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as Tooltip from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  Settings,
  BarChart3,
  X,
  User,
  Database,
  FileText,
  CalendarClock,
  Tablet,
  Package,
  Bell,
  List,
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
  darkMode: boolean
}

export default function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
  darkMode,
}: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/bossdashboard", icon: Home },
    { name: "Users", href: "/bossdashboard/users", icon: Users },
    { name: "Orders", href: "/bossdashboard/orders", icon: FileText },
    { name: "Analytics", href: "/bossdashboard/analytics", icon: BarChart3 },
    { name: "Plans", href: "/bossdashboard/plans", icon: Settings },
    { name: "Bosses", href: "/bossdashboard/bosses", icon: Database },
    { name: "Devices", href: "/bossdashboard/devices", icon: Tablet },
    { name: "Notifications", href: "/bossdashboard/notifications", icon: Bell },
    // { name: "Bulk Email", href: "/bossdashboard/bulk-email", icon: FileText },
    { name: "Label Products", href: "/bossdashboard/label-products", icon: Package },
    { name: "Demo Requests", href: "/bossdashboard/bookdemo", icon: CalendarClock },
    {
      name: "Cancel Requests",
      href: "/bossdashboard/cancellations",
      icon: () => <span className="mr-3 text-lg">👋</span>,
    },
    { name: "Reports", href: "/bossdashboard/reports", icon: FileText },
    { name: "Waitlist", href: "/bossdashboard/waitlist", icon: List },
  ]

  const isActive = (href: string) => {
    if (href === "/bossdashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <Tooltip.Provider>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
      )}

      {/* Desktop Toggle Button - positioned at sidebar edge */}
      <button
        onClick={onToggleCollapse}
        className={cn(
          "z-1 fixed top-1/2 hidden h-16 w-4 -translate-y-1/2 text-white shadow-lg transition-all duration-300 ease-in-out hover:w-6 lg:flex lg:items-center lg:justify-center",
          darkMode ? "bg-gray-700" : "bg-gray-200",
          isCollapsed ? "left-16 rounded-r-lg" : "left-64 rounded-r-lg"
        )}
        aria-label="Toggle Sidebar"
      >
        <div className="flex flex-col space-y-1">
          <div className={cn("h-1 w-2 rounded-full", darkMode ? "bg-white" : "bg-gray-600")}></div>
          <div className={cn("h-1 w-2 rounded-full", darkMode ? "bg-white" : "bg-gray-600")}></div>
          <div className={cn("h-1 w-2 rounded-full", darkMode ? "bg-white" : "bg-gray-600")}></div>
        </div>
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        )}
      >
        {/* Sidebar header */}
        <div
          className={cn(
            "flex h-16 flex-shrink-0 items-center justify-between border-b px-3",
            darkMode ? "border-gray-700" : "border-gray-200"
          )}
        >
          <div className="flex min-w-0 items-center justify-center">
            {!isCollapsed ? (
              <span
                className={cn(
                  "select-none text-2xl font-bold tracking-tight",
                  darkMode
                    ? "text-white"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
                )}
                style={{ letterSpacing: "-0.03em" }}
              >
                instaLabel
              </span>
            ) : (
              <img
                src={darkMode ? "/logo_sm_white.png" : "/logo_sm.png"}
                alt="Small Logo"
                width={darkMode ? 48 : 64}
                height={darkMode ? 48 : 64}
                className={darkMode ? "h-12 w-12 object-contain" : "h-16 w-16 object-contain"}
              />
            )}
          </div>

          {/* Close button only visible on mobile */}
          <button
            onClick={onClose}
            className={cn(
              "rounded-md p-1 lg:hidden",
              darkMode
                ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation: make only nav scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Tooltip.Root key={item.name} delayDuration={100}>
                  <Tooltip.Trigger asChild>
                    <Link
                      href={item.href}
                      onClick={onClose} // Close sidebar on mobile after click
                      className={cn(
                        "group relative flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                        active
                          ? darkMode
                            ? "bg-purple-600 text-white"
                            : "bg-purple-100 text-purple-900"
                          : darkMode
                            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          !isCollapsed ? "mr-3" : "",
                          active
                            ? "text-white"
                            : darkMode
                              ? "text-gray-400 group-hover:text-white"
                              : "text-gray-500 group-hover:text-gray-900"
                        )}
                      />
                      {!isCollapsed && item.name}
                    </Link>
                  </Tooltip.Trigger>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="right"
                        align="center"
                        className="z-[2147483647] select-none rounded bg-black px-2 py-1 text-xs text-white shadow-lg"
                        sideOffset={8}
                      >
                        {item.name}
                        <Tooltip.Arrow className="fill-black" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  )}
                </Tooltip.Root>
              )
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div
          className={cn(
            "flex flex-shrink-0 items-center space-x-3 rounded-lg border-t p-3",
            darkMode ? "border-gray-700 bg-gray-700" : "border-gray-200 bg-gray-100"
          )}
        >
          <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger asChild>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <User className="h-4 w-4 text-white" />
              </div>
            </Tooltip.Trigger>
            {isCollapsed && (
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  align="center"
                  className="z-[2147483647] select-none rounded bg-black px-2 py-1 text-xs text-white shadow-lg"
                  sideOffset={8}
                >
                  Admin User
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className={cn("text-sm font-medium", darkMode ? "text-white" : "text-gray-900")}>
                Admin User
              </p>
              <p className={cn("text-xs", darkMode ? "text-gray-400" : "text-gray-500")}>
                Super Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </Tooltip.Provider>
  )
}
