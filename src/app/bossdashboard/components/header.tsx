"use client"
import React from "react"
import { Search, Menu, LogOut, ChevronDown, User, Moon, Sun } from "lucide-react"

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
          {/* Search bar */}
          <div className="relative hidden md:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className={`h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className={`block w-80 rounded-lg border py-2 pl-10 pr-3 text-sm transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                darkMode
                  ? "border-gray-600 bg-gray-700 text-white placeholder-gray-400"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`rounded-lg p-2 transition-colors duration-200 ${
              darkMode
                ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={onToggleUserMenu}
              className={`flex items-center space-x-2 rounded-lg p-2 transition-colors duration-200 ${
                darkMode
                  ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <User className="h-4 w-4 text-white" />
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {userMenuOpen && (
              <div
                className={`absolute right-0 z-50 mt-2 w-48 rounded-lg border shadow-lg ${
                  darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                }`}
              >
                <div className="py-2">
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Profile Settings
                  </a>
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Account Security
                  </a>
                  <hr className={`my-2 ${darkMode ? "border-gray-700" : "border-gray-200"}`} />
                  <button
                    onClick={onLogout}
                    className={`flex w-full items-center space-x-2 px-4 py-2 text-left text-sm transition-colors duration-200 ${
                      darkMode ? "text-red-400 hover:bg-gray-700" : "text-red-600 hover:bg-gray-100"
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
