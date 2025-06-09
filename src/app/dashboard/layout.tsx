"use client"

import React, { ReactNode, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { FaHome, FaChartPie, FaCog, FaUser, FaPrint } from "react-icons/fa"
import { GiShrimp, GiChickenOven } from "react-icons/gi"
import { MdRestaurantMenu } from "react-icons/md"
import { FaLayerGroup } from "react-icons/fa6"
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
  const pathname = usePathname()
  const [name, setName] = useState<string | null>(null)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [profile, setProfile] = useState<null | {
    company_name: string | null
    address: string | null
    profile_picture?: string | null
  }>(null)
  const [subscription, setSubscription] = useState<null | { status: string }>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(localStorage.getItem("name"))
  }, [])

  useEffect(() => {
    async function fetchProfileAndSubscription() {
      const userId = localStorage.getItem("userid")
      if (!userId) {
        setError("User ID not found. Please login.")
        setLoading(false)
        return
      }

      try {
        const [profileRes, subscriptionRes] = await Promise.all([
          fetch(`/api/profile?user_id=${encodeURIComponent(userId)}`),
          fetch(`/api/subscriptions?user_id=${encodeURIComponent(userId)}`),
        ])

        if (!profileRes.ok) throw new Error("Failed to fetch profile")
        if (!subscriptionRes.ok) throw new Error("Failed to fetch subscription")

        const profileData = await profileRes.json()
        const subscriptionData = await subscriptionRes.json()

        setProfile(profileData.profile)
        setSubscription(subscriptionData.subscription)
        setLoading(false)

        // Set profile picture if exists, else null
        if (profileData.profile?.profile_picture) {
          setProfilePicture(profileData.profile.profile_picture)
        } else {
          setProfilePicture(null)
        }

        if (!subscriptionData.subscription && pathname !== "/dashboard/profile/setup") {
          router.push("/dashboard/profile/setup")
        }
      } catch (err) {
        console.error(err)
        setError("Error loading profile or subscription data.")
        setLoading(false)
      }
    }

    fetchProfileAndSubscription()
  }, [router, pathname])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userid")
    localStorage.removeItem("name")
    localStorage.removeItem("profilePicture")
    router.push("/login")
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  // Prepare avatar src logic:
  // If profilePicture already includes .png, don't add again,
  // otherwise add .png.
  // If no profilePicture, fallback to default "1.png" avatar.
  const avatarSrc = profilePicture
    ? profilePicture.endsWith(".png")
      ? `/avatar${profilePicture}`
      : `/avatar${profilePicture}.png`
    : "/avatar1.png"

  return (
    <div className="flex h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))]">
        <div className="mb-12 flex items-center space-x-3">
          <Image src="/logo_white.png" width={120} height={40} alt="Logo" />
        </div>

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
      <main className="flex flex-grow flex-col overflow-auto bg-[hsl(var(--card))] p-8 text-[hsl(var(--card-foreground))]">
        <header className="mb-4 flex items-center justify-end border-b border-[hsl(var(--border))] pb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{name || "Guest"}</span>
            <Image
              src={avatarSrc}
              alt="Profile Picture"
              width={40}
              height={40}
              className="cursor-pointer rounded-full object-cover"
            />
          </div>
        </header>

        <section className="mt-8 flex-grow overflow-auto">{children}</section>
      </main>
    </div>
  )
}
