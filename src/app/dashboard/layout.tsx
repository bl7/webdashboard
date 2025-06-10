"use client"

import React, { ReactNode, useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { FaHome, FaChartPie, FaCog, FaUser, FaPrint } from "react-icons/fa"
import { GiShrimp, GiChickenOven } from "react-icons/gi"
import { MdRestaurantMenu } from "react-icons/md"
import { FaLayerGroup } from "react-icons/fa6"
import { IoLogOutOutline } from "react-icons/io5"
import { RiAdminLine } from "react-icons/ri"
import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

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

  // User info states
  const [name, setName] = useState<string | null>(null)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [profile, setProfile] = useState<null | {
    company_name: string | null
    address: string | null
    profile_picture?: string | null
  }>(null)
  const [subscription, setSubscription] = useState<null | { status: string }>(null)

  // Loading and error
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Admin access states
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Load name and admin access from localStorage on mount
  useEffect(() => {
    setName(localStorage.getItem("name"))
    setIsAdmin(localStorage.getItem("adminAccess") === "true")
  }, [])

  // Fetch profile, subscription, and admin PIN existence
  useEffect(() => {
    async function fetchProfileAndSubscription() {
      const userId = localStorage.getItem("userid")
      if (!userId) {
        setError("User ID not found. Please login.")
        setLoading(false)
        return
      }

      try {
        const [profileRes, subscriptionRes, adminRes] = await Promise.all([
          fetch(`/api/profile?user_id=${encodeURIComponent(userId)}`),
          fetch(`/api/subscriptions?user_id=${encodeURIComponent(userId)}`),
          fetch(`/api/admin-access?user_id=${encodeURIComponent(userId)}`),
        ])

        if (!profileRes.ok) throw new Error("Failed to fetch profile")
        if (!subscriptionRes.ok) throw new Error("Failed to fetch subscription")
        if (!adminRes.ok) throw new Error("Failed to fetch admin access")

        const profileData = await profileRes.json()
        const subscriptionData = await subscriptionRes.json()
        const adminData = await adminRes.json()

        setProfile(profileData.profile)
        setSubscription(subscriptionData.subscription)
        setLoading(false)

        if (profileData.profile?.profile_picture) {
          setProfilePicture(profileData.profile.profile_picture)
        } else {
          setProfilePicture(null)
        }

        // Check profile completeness and subscription status
        const onProfileSetup = pathname === "/dashboard/profile/setup"
        const profileComplete = profileData.profile?.company_name && profileData.profile?.address
        const subscriptionActive = subscriptionData.subscription?.status === "active"

        // Redirect to setup if incomplete or no subscription
        if ((!profileComplete || !subscriptionActive) && !onProfileSetup) {
          router.push("/dashboard/profile/setup")
        }

        // Set admin access if PIN exists and localStorage says true
        if (adminData.hasPin && localStorage.getItem("adminAccess") === "true") {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
          localStorage.removeItem("adminAccess")
        }
      } catch (err) {
        console.error(err)
        setError("Error loading profile, subscription, or admin data.")
        setLoading(false)
      }
    }

    fetchProfileAndSubscription()
  }, [router, pathname])

  // Handle logout clears all localStorage and resets admin access
  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userid")
    localStorage.removeItem("name")
    localStorage.removeItem("profilePicture")
    localStorage.removeItem("adminAccess")
    setIsAdmin(false)
    router.push("/login")
  }

  // PIN input handlers
  const handlePinChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      const newDigits = [...pinDigits]
      newDigits[index] = value
      setPinDigits(newDigits)

      // Focus next input
      if (index < 3 && value) {
        inputRefs.current[index + 1]?.focus()
      }

      // Auto-verify when all digits entered
      if (newDigits.every((d) => d !== "")) {
        verifyPin(newDigits.join(""))
      }
    } else if (value === "") {
      // Allow clearing input and focus previous
      const newDigits = [...pinDigits]
      newDigits[index] = ""
      setPinDigits(newDigits)

      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  // Verify PIN with backend
  const verifyPin = async (pin: string) => {
    try {
      const userId = localStorage.getItem("userid")
      if (!userId) return

      // Debug: Log the PIN and userId being sent
      console.log("Sending PIN:", pin)
      console.log("Sending userId:", userId)

      const res = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin }),
      })

      // Debug: Log the raw response
      const data = await res.json()
      console.log("Response from /api/verify-pin:", data)

      if (data.valid) {
        setIsAdmin(true)
        localStorage.setItem("adminAccess", "true")
        setShowPinModal(false)
        setPinDigits(["", "", "", ""])
      } else {
        alert("Incorrect PIN. Please try again.")
        setPinDigits(["", "", "", ""])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      console.error("PIN verification error:", error)
      alert("Error verifying PIN. Please try again.")
      setPinDigits(["", "", "", ""])
      inputRefs.current[0]?.focus()
    }
  }

  // Determine if on profile setup page
  const onProfileSetup = pathname === "/dashboard/profile/setup"

  // Filter nav items based on admin status and profile setup
  const filteredNavItems = onProfileSetup
    ? navItems.filter((item) => item.label === "Print Labels")
    : isAdmin
      ? navItems
      : navItems.filter((item) => item.label === "Print Labels")

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* PIN Modal using shadcn/ui Dialog */}
      <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Admin PIN</DialogTitle>
          </DialogHeader>
          <div className="mb-4 flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                type="password"
                maxLength={1}
                value={pinDigits[i]}
                onChange={(e) => handlePinChange(i, e.target.value)}
                ref={(el) => {
                  inputRefs.current[i] = el
                }}
                className="h-12 w-12 rounded border border-gray-300 text-center text-2xl focus:border-blue-600 focus:outline-none"
                autoFocus={i === 0}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowPinModal(false)}
              className="rounded bg-gray-200 px-4 py-2 font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sidebar */}
      {!onProfileSetup && (
        <aside className="flex w-64 flex-col bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))]">
          <div className="mb-12 flex items-center space-x-3">
            <Image src="/logo_white.png" width={120} height={40} alt="Logo" />
          </div>

          <nav className="flex flex-grow flex-col space-y-6">
            {filteredNavItems.map(({ label, icon, href }) => (
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

          {/* Show Admin Access button only if not admin */}
          {!isAdmin && (
            <button
              onClick={() => setShowPinModal(true)}
              className="mt-4 flex items-center gap-4 text-lg font-semibold text-yellow-400 hover:text-yellow-300"
              aria-label="Request Admin Access"
            >
              <RiAdminLine className="text-[1.3rem]" />
              <span>Admin Access</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-4 text-lg font-semibold text-[hsl(var(--destructive-foreground))] transition-colors hover:text-[hsl(var(--destructive))]"
            aria-label="Logout"
          >
            <IoLogOutOutline className="text-[1.3rem]" />
            <span>Logout</span>
          </button>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex flex-grow flex-col overflow-auto bg-[hsl(var(--card))] p-8 text-[hsl(var(--card-foreground))]">
        {/* Header */}
        {!onProfileSetup && (
          <header className="mb-4 flex items-center justify-end border-b border-[hsl(var(--border))] pb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{name || "Guest"}</span>
              <Image
                src={
                  profilePicture
                    ? profilePicture.endsWith(".png")
                      ? `/avatar${profilePicture}`
                      : `/avatar${profilePicture}.png`
                    : "/avatar1.png"
                }
                alt="Profile Picture"
                width={40}
                height={40}
                className="cursor-pointer rounded-full object-cover"
              />
            </div>
          </header>
        )}

        <section className={`flex-grow overflow-auto ${onProfileSetup ? "mt-0" : "mt-8"}`}>
          {children}
        </section>
      </main>
    </div>
  )
}
