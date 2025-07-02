"use client"
import React from "react"
import { Search, Menu, LogOut, ChevronDown, User, Moon, Sun, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface HeaderProps {
  title: string
  darkMode: boolean
  onToggleDarkMode: () => void
  onOpenSidebar: () => void
  userMenuOpen: boolean
  onToggleUserMenu: () => void
  onLogout: () => void
}

export default function Header({
  title,
  darkMode,
  onToggleDarkMode,
  onOpenSidebar,
  userMenuOpen,
  onToggleUserMenu,
  onLogout,
}: HeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Clear the bossToken from localStorage
    localStorage.removeItem("bossToken")
    
    // Redirect to boss login
    router.push("/boss/login")
  }

  return (
    <header
      className={`sticky top-0 z-50 ${
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      } border-b shadow-sm`}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-4">
          {/* Sidebar toggle only on mobile */}
          <button
            onClick={onOpenSidebar}
            className={`rounded-md p-2 lg:hidden ${
              darkMode
                ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
            className={`h-9 w-9 p-0 ${
              darkMode
                ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`h-9 w-9 rounded-full p-0 ${
                  darkMode
                    ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
