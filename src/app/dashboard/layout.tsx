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
import PrinterStatusBar from "@/components/PrinterStatusBar"
import { cn } from "@/lib/utils"
import { PrinterProvider } from "@/context/PrinterContext"

interface LayoutProps {
  children: ReactNode
}

const NAV_ITEMS = [
  { label: "Dashboard", icon: <FaHome />, href: "/dashboard" },
  { label: "Analytics", icon: <FaChartPie />, href: "/dashboard/analytics" },
  { label: "Print Labels", icon: <FaPrint />, href: "/dashboard/print" },
  { label: "Label Demo", icon: <FaPrint />, href: "/dashboard/labeldemo" },
  { label: "Allergens", icon: <GiShrimp />, href: "/dashboard/allergens" },
  { label: "Ingredients", icon: <GiChickenOven />, href: "/dashboard/ingredients" },
  { label: "Menu Items", icon: <MdRestaurantMenu />, href: "/dashboard/menuitem" },
  { label: "Groups", icon: <FaLayerGroup />, href: "/dashboard/group" },
  { label: "Logs", icon: <GoLog />, href: "/dashboard/logs" },
  { label: "Profile", icon: <FaUser />, href: "/dashboard/profile" },
  { label: "Settings", icon: <FaCog />, href: "/dashboard/settings" },
]

const ADMIN_ROUTES = NAV_ITEMS.filter(
  (i) => !["Dashboard", "Print Labels", "Label Demo"].includes(i.label)
).map((i) => i.href)

export default function DashboardLayout({ children }: LayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarMobile, setSidebarMobile] = useState(false)
  const [avatar, setAvatar] = useState<number | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [profile, setProfile] = useState<{
    company_name: string | null
    address: string | null
  } | null>(null)
  const [subscription, setSubscription] = useState<{ status: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataFetched, setDataFetched] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""])

  const isSetupPage = pathname === "/setup"
  const filteredNavItems = isAdmin
    ? NAV_ITEMS
    : NAV_ITEMS.filter((i) => ["Print Labels", "Label Demo"].includes(i.label))

  useEffect(() => {
    setName(localStorage.getItem("name"))
    setIsAdmin(localStorage.getItem("adminAccess") === "true")
  }, [])

  useEffect(() => {
    if (!dataFetched) return

    const onAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route))
    const onSetupProfile = pathname === "/dashboard/profile/setup"
    const adminFlag = localStorage.getItem("adminAccess") === "true"

    if (onAdminRoute && !adminFlag && !onSetupProfile) {
      router.push("/dashboard")
    }
  }, [pathname, dataFetched, router])

  useEffect(() => {
    const loadUserData = async () => {
      const userId = localStorage.getItem("userid")
      if (!userId) return setError("User ID not found. Please login.")

      try {
        const [profileRes, subRes, adminRes] = await Promise.all([
          fetch(`/api/profile?user_id=${userId}`),
          fetch(`/api/subscriptions?user_id=${userId}`),
          fetch(`/api/admin-access?user_id=${userId}`),
        ])

        if (!profileRes.ok || !subRes.ok || !adminRes.ok) throw new Error("Failed to load data")

        const { profile } = await profileRes.json()
        const { subscription } = await subRes.json()
        const { hasPin } = await adminRes.json()

        setProfile(profile)
        setSubscription(subscription)

        const match = profile?.profile_picture?.match(/\/avatar(\d+)\.png/)
        if (match) {
          const avatarNum = parseInt(match[1], 10)
          if (avatarNum >= 1 && avatarNum <= 8) {
            setAvatar(avatarNum)
            localStorage.setItem("avatar", avatarNum.toString())
          }
        }

        const adminFlag = localStorage.getItem("adminAccess") === "true"
        setIsAdmin(adminFlag && hasPin)
        if (!hasPin) localStorage.removeItem("adminAccess")
      } catch {
        setError("Error loading profile or subscription.")
      } finally {
        setLoading(false)
        setDataFetched(true)
      }
    }

    if (!dataFetched) loadUserData()
  }, [dataFetched])

  useEffect(() => {
    if (!dataFetched || isSetupPage) return
    const profileComplete = profile?.company_name && profile?.address
    // const subActive = subscription?.status === "active"
    if (!profileComplete) router.push("/setup")
  }, [dataFetched, profile, subscription, pathname])

  const handlePinChange = (index: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const updated = [...pinDigits]
    updated[index] = val
    setPinDigits(updated)

    if (val && index < 3) inputRefs.current[index + 1]?.focus()
    if (val === "" && index > 0) inputRefs.current[index - 1]?.focus()

    if (updated.every((d) => d)) verifyPin(updated.join(""))
  }

  const verifyPin = async (pin: string) => {
    const userId = localStorage.getItem("userid")
    if (!userId) return

    try {
      const res = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin }),
      })

      const { valid } = await res.json()
      if (valid) {
        setIsAdmin(true)
        localStorage.setItem("adminAccess", "true")
        setShowPinModal(false)
      } else {
        alert("Incorrect PIN")
      }
    } catch {
      alert("Verification error")
    } finally {
      setPinDigits(["", "", "", ""])
      inputRefs.current[0]?.focus()
    }
  }

  const handleLogout = () => {
    ;["token", "userid", "name", "profilePicture", "adminAccess"].forEach((k) =>
      localStorage.removeItem(k)
    )
    setIsAdmin(false)
    router.push("/login")
  }

  const toggleSidebar = () => {
    window.innerWidth < 1024 ? setSidebarMobile((v) => !v) : setSidebarOpen((v) => !v)
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-600">{error}</div>
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[hsl(var(--primary))] border-t-transparent" />
      </div>
    )
  }

  return (
    <PrinterProvider>
      <div className="flex h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        {/* Global Printer Status Bar - only show when not on setup page */}
        {!isSetupPage && <PrinterStatusBar />}

        {!isSetupPage && (
          <>
            <button
              onClick={toggleSidebar}
              className="fixed left-4 top-4 z-50 h-10 w-10 rounded-md bg-[hsl(var(--primary))] text-white shadow-lg"
              aria-label="Toggle Sidebar"
            >
              {sidebarMobile || sidebarOpen ? <FaChevronLeft size={22} /> : <FaBars size={22} />}
            </button>

            <div
              onClick={() => setSidebarMobile(false)}
              className={cn("fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden", {
                "pointer-events-auto opacity-100": sidebarMobile,
                "pointer-events-none opacity-0": !sidebarMobile,
              })}
            />
          </>
        )}

        {/* Sidebar */}
        {!isSetupPage && (
          <aside
            className={cn(
              "fixed left-0 top-0 z-50 flex h-full flex-col border-r bg-[hsl(var(--primary))] p-4 text-[hsl(var(--primary-foreground))] shadow-xl transition-all duration-300 ease-in-out",
              sidebarMobile ? "w-64 translate-x-0" : "w-64 -translate-x-full",
              sidebarOpen ? "lg:w-64 lg:translate-x-0" : "lg:w-20 lg:translate-x-0"
            )}
          >
            <Image
              src="/logo_white.png"
              alt="Logo"
              width={120}
              height={40}
              className={cn("mb-6 transition-opacity", {
                "opacity-100": sidebarOpen || sidebarMobile,
                "w-0 opacity-0": !sidebarOpen && !sidebarMobile,
              })}
            />

            <nav className="flex flex-grow flex-col space-y-1">
              {filteredNavItems.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-white transition-colors hover:bg-white/10",
                    sidebarOpen || sidebarMobile ? "justify-start" : "justify-center"
                  )}
                  onClick={() => setSidebarMobile(false)}
                >
                  <span className="text-[1.3rem]">{icon}</span>
                  {(sidebarOpen || sidebarMobile) && <span>{label}</span>}
                  {!sidebarOpen && !sidebarMobile && (
                    <span className="absolute left-full ml-2 hidden rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                      {label}
                    </span>
                  )}
                </a>
              ))}
            </nav>

            {!isAdmin && (sidebarOpen || sidebarMobile) && (
              <button
                onClick={() => {
                  setShowPinModal(true)
                  setSidebarMobile(false)
                }}
                className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-400/10"
              >
                <RiAdminLine className="text-[1.3rem]" />
                <span>Admin Access</span>
              </button>
            )}

            {(sidebarOpen || sidebarMobile) && (
              <div className="mb-4 mt-auto flex items-center gap-3 rounded-lg bg-white/10 p-3 text-sm text-white">
                {avatar !== null && (
                  <Image
                    src={`/avatar${avatar}.png`}
                    width={36}
                    height={36}
                    alt="Avatar"
                    className="rounded-full border border-white"
                  />
                )}
                {profile?.company_name && (
                  <div>
                    <span className="font-medium">{profile.company_name}</span>
                  </div>
                )}
              </div>
            )}

            {(sidebarOpen || sidebarMobile) && (
              <button
                onClick={handleLogout}
                className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-400/10"
              >
                <IoLogOutOutline className="text-[1.3rem]" />
                <span>Logout</span>
              </button>
            )}
          </aside>
        )}

        <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Admin PIN</DialogTitle>
            </DialogHeader>
            <div className="mb-4 flex justify-center gap-3">
              {pinDigits.map((digit, i) => (
                <input
                  key={i}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  ref={(el) => {
                    inputRefs.current[i] = el
                  }}
                  className="h-12 w-12 rounded border text-center text-2xl"
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

        <main
          className={cn(
            "flex flex-grow flex-col overflow-auto bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] transition-all",
            // Add top padding to account for the fixed PrinterStatusBar
            "pt-12",
            {
              "lg:ml-64": sidebarOpen,
              "lg:ml-20": !sidebarOpen,
            }
          )}
        >
          <section className="flex-grow overflow-auto p-8">{children}</section>
        </main>
      </div>
    </PrinterProvider>
  )
}
