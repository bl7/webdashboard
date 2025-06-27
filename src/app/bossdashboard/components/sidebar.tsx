"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Shield,
  Home,
  Users,
  Settings,
  BarChart3,
  X,
  User,
  Database,
  FileText,
  Activity,
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  darkMode: boolean
}

export default function Sidebar({ isOpen, onClose, darkMode }: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/bossdashboard", icon: Home },
    { name: "Users", href: "/bossdashboard/users", icon: Users },
    { name: "Analytics", href: "/bossdashboard/analytics", icon: BarChart3 },
    { name: "Bosses", href: "/bossdashboard/bosses", icon: Database },
    { name: "Reports", href: "/bossdashboard/reports", icon: FileText },
  ]

  const isActive = (href: string) => {
    if (href === "/bossdashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${
          darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        } flex flex-col border-r`}
      >
        {/* Sidebar header */}
        <div
          className={`flex h-16 flex-shrink-0 items-center justify-between px-6 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } border-b`}
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              SuperAdmin
            </span>
          </div>
          {/* Close button only visible on mobile */}
          <button
            onClick={onClose}
            className={`rounded-md p-1 lg:hidden ${
              darkMode
                ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation: make scrollable and fill space */}
        <nav className="mt-6 flex-1 overflow-y-auto px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose} // Close sidebar on mobile after click
                  className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? darkMode
                        ? "bg-purple-600 text-white"
                        : "bg-purple-100 text-purple-900"
                      : darkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      active
                        ? "text-white"
                        : darkMode
                          ? "text-gray-400 group-hover:text-white"
                          : "text-gray-500 group-hover:text-gray-900"
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div
          className={`flex flex-shrink-0 items-center space-x-3 rounded-lg p-3 ${
            darkMode ? "border-gray-700 bg-gray-700" : "border-gray-200 bg-gray-100"
          } border-t`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
              Admin User
            </p>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Super Administrator
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
