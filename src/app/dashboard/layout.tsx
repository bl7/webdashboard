"use client"

import React, { ReactNode, useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  FaHome,
  FaChartPie,
  FaCog,
  FaUser,
  FaPrint,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"
import { GiShrimp, GiChickenOven } from "react-icons/gi"
import { MdRestaurantMenu } from "react-icons/md"
import { FaLayerGroup } from "react-icons/fa6"
import { IoLogOutOutline } from "react-icons/io5"
import { RiAdminLine } from "react-icons/ri"
import { GoLog } from "react-icons/go"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { PrinterProvider } from "@/context/PrinterContext"
import PrinterStatusBar from "@/components/PrinterStatusBar"

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
  { label: "Logs", icon: <GoLog />, href: "/dashboard/logs" },
  { label: "Profile", icon: <FaUser />, href: "/dashboard/profile" },
  { label: "Settings", icon: <FaCog />, href: "/dashboard/settings" },
]

const adminOnlyRoutes = [
  "/dashboard/analytics",
  "/dashboard/allergens",
  "/dashboard/ingredients",
  "/dashboard/menuitem",
  "/dashboard/group",
  "/dashboard/logs",
  "/dashboard/profile",
  "/dashboard/settings",
]

export default function DashboardLayout({ children }: LayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarMobile, setSidebarMobile] = useState(false)
  const [avatar, setAvatar] = useState<number | null>(null)

  // User info states
  const [name, setName] = useState<string | null>(null)
  const [profile, setProfile] = useState<null | {
    company_name: string | null
    address: string | null
  }>(null)
  const [subscription, setSubscription] = useState<null | { status: string }>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataFetched, setDataFetched] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    setName(localStorage.getItem("name"))
    setIsAdmin(localStorage.getItem("adminAccess") === "true")
  }, [])

  useEffect(() => {
    const checkRouteAccess = () => {
      const isAdminRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route))
      const onProfileSetup = pathname === "/dashboard/profile/setup"
      const currentIsAdmin = localStorage.getItem("adminAccess") === "true"
      if (isAdminRoute && !currentIsAdmin && !onProfileSetup) {
        router.push("/dashboard")
        return
      }
    }
    if (dataFetched) {
      checkRouteAccess()
    }
  }, [pathname, dataFetched, router])

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
        const pic = profileData.profile?.profile_picture
        if (pic && pic.startsWith("/avatar")) {
          const match = pic.match(/\/avatar(\d+)\.png/)
          if (match) {
            const avatarNum = parseInt(match[1], 10)
            if (!isNaN(avatarNum) && avatarNum >= 1 && avatarNum <= 8) {
              setAvatar(avatarNum)
              localStorage.setItem("avatar", avatarNum.toString())
            }
          }
        }
        setLoading(false)
        setDataFetched(true)
        if (adminData.hasPin && localStorage.getItem("adminAccess") === "true") {
          setIsAdmin(true)
        } else {
          setIsAdmin(false)
          localStorage.removeItem("adminAccess")
        }
      } catch (err) {
        setError("Error loading profile, subscription, or admin data.")
        setLoading(false)
        setDataFetched(true)
      }
    }
    if (!dataFetched) {
      fetchProfileAndSubscription()
    }
  }, [dataFetched])
  useEffect(() => {
    const onProfileSetup = pathname === "/setup"
    const profileComplete = profile?.company_name && profile?.address
    const subscriptionActive = subscription?.status === "active"
    if (dataFetched && !onProfileSetup) {
      if (!profile || !profileComplete || !subscription || !subscriptionActive) {
        router.push("/setup")
      }
    }
  }, [dataFetched, profile, subscription, pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userid")
    localStorage.removeItem("name")
    localStorage.removeItem("profilePicture")
    localStorage.removeItem("adminAccess")
    setIsAdmin(false)
    router.push("/login")
  }

  const handlePinChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      const newDigits = [...pinDigits]
      newDigits[index] = value
      setPinDigits(newDigits)
      if (index < 3 && value) {
        inputRefs.current[index + 1]?.focus()
      }
      if (newDigits.every((d) => d !== "")) {
        verifyPin(newDigits.join(""))
      }
    } else if (value === "") {
      const newDigits = [...pinDigits]
      newDigits[index] = ""
      setPinDigits(newDigits)
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const verifyPin = async (pin: string) => {
    try {
      const userId = localStorage.getItem("userid")
      if (!userId) return
      const res = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin }),
      })
      const data = await res.json()
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
      alert("Error verifying PIN. Please try again.")
      setPinDigits(["", "", "", ""])
      inputRefs.current[0]?.focus()
    }
  }

  const onProfileSetup = pathname === "/setup"
  const filteredNavItems = onProfileSetup
    ? navItems.filter((item) => item.label === "Print Labels")
    : isAdmin
      ? navItems
      : navItems.filter((item) => item.label === "Print Labels")

  // Sidebar toggle logic
  const handleSidebarToggle = () => {
    if (window.innerWidth < 1024) {
      setSidebarMobile((v) => !v)
    } else {
      setSidebarOpen((v) => !v)
    }
  }
  const handleSidebarClose = () => setSidebarMobile(false)

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
    <PrinterProvider printQueue={[]}>
      <div className="flex h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        {/* Sidebar toggle button (always visible) */}
        {!onProfileSetup && (
          <button
            className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-md bg-[hsl(var(--primary))] text-white shadow-lg"
            onClick={handleSidebarToggle}
            aria-label="Toggle navigation"
          >
            {sidebarMobile || sidebarOpen ? <FaChevronLeft size={22} /> : <FaBars size={22} />}
          </button>
        )}

        {/* Mobile backdrop */}
        {!onProfileSetup && (
          <div
            className={`fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden ${sidebarMobile ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
            onClick={handleSidebarClose}
          />
        )}

        {/* Sidebar */}
        {!onProfileSetup && (
          <aside
            className={`fixed left-0 top-0 z-50 flex h-full flex-col bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))] shadow-lg transition-all duration-300 ${sidebarMobile ? "w-64 translate-x-0" : "w-64 -translate-x-full"} ${sidebarOpen ? "lg:w-64 lg:translate-x-0" : "lg:w-20 lg:translate-x-0"} `}
          >
            <div className="mb-12 flex items-center space-x-3">
              <Image
                src="/logo_white.png"
                width={120}
                height={40}
                alt="Logo"
                className={`${sidebarOpen || sidebarMobile ? "block" : "hidden"} transition-all duration-200`}
              />
            </div>
            <nav className="flex flex-grow flex-col space-y-6">
              {filteredNavItems.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  className={`flex items-center gap-4 text-lg font-semibold transition-colors hover:text-[hsl(var(--accent))] ${sidebarOpen || sidebarMobile ? "" : "justify-center"}`}
                  onClick={handleSidebarClose}
                >
                  <span className="text-[1.2rem]">{icon}</span>
                  {(sidebarOpen || sidebarMobile) && <span>{label}</span>}
                </a>
              ))}
            </nav>
            {!isAdmin && (sidebarOpen || sidebarMobile) && (
              <button
                onClick={() => {
                  setShowPinModal(true)
                  handleSidebarClose()
                }}
                className="mt-4 flex items-center gap-4 text-lg font-semibold text-yellow-400 hover:text-yellow-300"
                aria-label="Request Admin Access"
              >
                <RiAdminLine className="text-[1.3rem]" />
                <span>Admin Access</span>
              </button>
            )}
            {(sidebarOpen || sidebarMobile) && avatar !== null && profile?.company_name && (
              <div className="mb-4 mt-auto flex items-center gap-4 rounded-lg bg-white/10 p-3 text-sm text-white">
                <Image
                  src={`/avatar${avatar}.png`}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border border-white"
                />
                <div className="flex flex-col">
                  <span className="font-semibold">{profile.company_name}</span>
                  <span className="text-xs text-white/70">Company</span>
                </div>
              </div>
            )}

            {(sidebarOpen || sidebarMobile) && (
              <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-4 text-lg font-semibold text-[hsl(var(--destructive-foreground))] transition-colors hover:text-[hsl(var(--destructive))]"
                aria-label="Logout"
              >
                <IoLogOutOutline className="text-[1.3rem]" />
                <span>Logout</span>
              </button>
            )}
          </aside>
        )}

        {/* PIN Modal */}
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

        {/* Main Content */}
        <main
          className={`flex flex-grow flex-col overflow-auto bg-[hsl(var(--card))] p-8 text-[hsl(var(--card-foreground))] transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"} `}
        >
          {!onProfileSetup && (
            <header className="mb-4 flex items-center justify-end border-b border-[hsl(var(--border))] pb-4">
              <PrinterStatusBar />
            </header>
          )}
          <section className={`flex-grow overflow-auto ${onProfileSetup ? "mt-0" : "mt-8"}`}>
            {children}
          </section>
        </main>
      </div>
    </PrinterProvider>
  )
}
