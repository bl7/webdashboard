"use client"

import React, { ReactNode, useState, useEffect } from "react"
import { FaHome, FaChartPie, FaCog, FaUser, FaPrint } from "react-icons/fa"
import { GiShrimp, GiChickenOven } from "react-icons/gi"
import { MdRestaurantMenu } from "react-icons/md"
import { FaLayerGroup } from "react-icons/fa6"
import { useRouter } from "next/navigation"
import { IoLogOutOutline } from "react-icons/io5"
import Image from "next/image"

interface LayoutProps {
  children: ReactNode
}

const navItems = [
  { label: "Dashboard", icon: <FaHome />, href: "/dashboard" },
  { label: "Analytics", icon: <FaChartPie />, href: "/dashboard/analytics" },
  { label: "Print Labels", icon: <FaPrint />, href: "/dashboard/print" },
  { label: "Allergens", icon: <GiShrimp />, href: "/dashboard/allergens" },
  { label: "Ingredients", icon: <GiChickenOven />, href: "/dashboard/ingredients" },
  { label: "Menu Items", icon: <MdRestaurantMenu />, href: "/dashboard/menuitem" },
  { label: "Groups", icon: <FaLayerGroup />, href: "/dashboard/group" },
  { label: "Logs", icon: <FaLayerGroup />, href: "/dashboard/logs" },
  { label: "Profile", icon: <FaUser />, href: "/dashboard/profile" },
  { label: "Settings", icon: <FaCog />, href: "/dashboard/settings" },
]

export default function DashboardLayout({ children }: LayoutProps) {
  const router = useRouter()
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    setName(localStorage.getItem("name"))
  }, [])

  const handleLogout = () => {
    console.log("destroying token", localStorage.getItem("token"))
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Sidebar */}
      <aside
        className="flex w-64 flex-col bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))]"
        style={{ minWidth: "16rem" }}
      >
        {/* Logo */}
        <div className="mb-12 flex items-center space-x-3">
          <Image src="/logo_white.png" width={120} height={40} alt="Logo" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-grow flex-col space-y-6">
          {navItems.map(({ label, icon, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-4 text-lg font-semibold transition-colors hover:text-[hsl(var(--accent))]"
            >
              <span className="text-[1.2rem]">{icon}</span>
              <span>{label}</span>
            </a>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-4 text-lg font-semibold text-[hsl(var(--destructive-foreground))] transition-colors hover:text-[hsl(var(--destructive))]"
          aria-label="Logout"
        >
          <IoLogOutOutline className="text-[1.3rem]" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex flex-grow flex-col overflow-auto bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
        {/* Top header */}
        <header className="flex items-center justify-end border-b border-[hsl(var(--border))] p-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{name || "Guest"}</span>
            <div className="h-10 w-10 rounded-full bg-[hsl(var(--primary))]" />
          </div>
        </header>

        {/* Page content */}
        <section className="flex-grow overflow-auto p-8">{children}</section>
      </main>
    </div>
  )
}
