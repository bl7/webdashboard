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
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [editingPicture, setEditingPicture] = useState(false)
  const [newPictureUrl, setNewPictureUrl] = useState("")

  useEffect(() => {
    setName(localStorage.getItem("name"))
  }, [])

  // Fetch profile picture on mount
  useEffect(() => {
    const userId = localStorage.getItem("userid")
    if (!userId) return

    fetch(`/api/profile/picture?user_id=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.profile_picture) {
          setProfilePicture(data.profile_picture)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile picture:", err)
      })
  }, [])

  // Save new profile picture url to backend
  const saveProfilePicture = async () => {
    const userId = localStorage.getItem("userid")
    if (!userId) {
      alert("User ID missing")
      return
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          company_name: "", // Keep empty or fetch actual company_name if needed
          address: "", // Keep empty or fetch actual address if needed
          profile_picture: newPictureUrl,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setProfilePicture(newPictureUrl)
        setEditingPicture(false)
      } else {
        alert("Failed to update profile picture")
      }
    } catch (error) {
      console.error("Error updating profile picture:", error)
      alert("Error updating profile picture")
    }
  }

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

            {profilePicture ? (
              <Image
                src={profilePicture}
                alt="Profile Picture"
                width={40}
                height={40}
                className="rounded-full object-cover"
                onClick={() => setEditingPicture(true)}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <div
                className="h-10 w-10 rounded-full bg-[hsl(var(--primary))]"
                onClick={() => setEditingPicture(true)}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
        </header>

        {/* Editable profile picture input */}
        {editingPicture && (
          <div className="absolute right-10 top-20 z-50 flex flex-col gap-2 rounded-md bg-white p-4 shadow-lg">
            <label htmlFor="profile-picture-url" className="text-sm font-semibold text-gray-700">
              Profile Picture URL
            </label>
            <input
              id="profile-picture-url"
              type="text"
              className="rounded border px-2 py-1"
              placeholder="Enter new picture URL"
              value={newPictureUrl}
              onChange={(e) => setNewPictureUrl(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                className="rounded bg-gray-200 px-3 py-1 text-sm"
                onClick={() => setEditingPicture(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                onClick={saveProfilePicture}
                disabled={!newPictureUrl.trim()}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Page content */}
        <section className="flex-grow overflow-auto p-8">{children}</section>
      </main>
    </div>
  )
}
