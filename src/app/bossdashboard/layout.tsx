"use client"
import React, { useState, useEffect } from "react"
import Sidebar from "./components/sidebar"
import Header from "./components/header"
import { DarkModeProvider, useDarkMode } from "./context/DarkModeContext" // Adjust path as needed

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

// Inner layout component that uses the dark mode context
function AdminLayoutInner({ children, title = "Dashboard" }: LayoutProps) {
  const { darkMode, toggleDarkMode } = useDarkMode()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    console.log("Logging out...")
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} darkMode={darkMode} />

      {/* Main content area - add left margin on desktop to account for sidebar */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-64">
        {/* Header (sticky on top) */}
        <Header
          title={title}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onOpenSidebar={() => setSidebarOpen(true)}
          userMenuOpen={userMenuOpen}
          onToggleUserMenu={() => setUserMenuOpen(!userMenuOpen)}
          onLogout={handleLogout}
        />

        {/* Page content */}
        <main
          className={`flex-1 overflow-auto ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
        >
          {children}
        </main>

        {/* Overlay click handler for mobile user menu */}
        {userMenuOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
        )}
      </div>
    </div>
  )
}

// Main layout component that provides the dark mode context
export default function AdminLayout({ children, title }: LayoutProps) {
  return (
    <DarkModeProvider>
      <AdminLayoutInner title={title}>{children}</AdminLayoutInner>
    </DarkModeProvider>
  )
}
