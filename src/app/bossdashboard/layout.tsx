"use client"
import React, { useState, useEffect } from "react"
import Sidebar from "./components/sidebar"
import Header from "./components/header"
import { DarkModeProvider, useDarkMode } from "./context/DarkModeContext" // Adjust path as needed
import { useRouter } from "next/navigation"

interface LayoutProps {
  children: React.ReactNode
  title?: string
}

// Inner layout component that uses the dark mode context
function AdminLayoutInner({ children, title = "Dashboard" }: LayoutProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("bossToken")
    console.log("[DEBUG] bossToken:", token)
    if (!token) {
      router.push("/boss/login")
      return
    }
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("bossToken")
    router.push("/boss/login")
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

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        darkMode={isDarkMode} 
      />

      {/* Main content area - adjust margin based on sidebar state */}
      <div className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      }`}>
        {/* Header (sticky on top) */}
        <Header
          title={title}
          darkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onOpenSidebar={() => setSidebarOpen(true)}
          userMenuOpen={userMenuOpen}
          onToggleUserMenu={() => setUserMenuOpen(!userMenuOpen)}
          onLogout={handleLogout}
        />

        {/* Page content */}
        <main
          className={`flex-1 overflow-auto ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
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
