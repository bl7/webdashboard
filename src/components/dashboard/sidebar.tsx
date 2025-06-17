"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { FaHome, FaChartPie, FaCog, FaUser, FaPrint, FaBars, FaChevronLeft } from "react-icons/fa"
import { GiShrimp, GiChickenOven } from "react-icons/gi"
import { MdRestaurantMenu } from "react-icons/md"
import { FaLayerGroup } from "react-icons/fa6"
import { IoLogOutOutline } from "react-icons/io5"
import { RiAdminLine } from "react-icons/ri"
import { GoLog } from "react-icons/go"
import Image from "next/image"
import { cn } from "@/lib/utils"
import AdminPinModal from "./adminPinModal"

const NAV_ITEMS = [
  { label: "Dashboard", icon: <FaHome />, href: "/dashboard" },
  { label: "Analytics", icon: <FaChartPie />, href: "/dashboard/analytics" },
  { label: "Print Label", icon: <FaPrint />, href: "/dashboard/print" },
  { label: "Allergens", icon: <GiShrimp />, href: "/dashboard/allergens" },
  { label: "Ingredients", icon: <GiChickenOven />, href: "/dashboard/ingredients" },
  { label: "Menu Items", icon: <MdRestaurantMenu />, href: "/dashboard/menuitem" },
  { label: "Groups", icon: <FaLayerGroup />, href: "/dashboard/group" },
  { label: "Logs", icon: <GoLog />, href: "/dashboard/logs" },
  { label: "Profile", icon: <FaUser />, href: "/dashboard/profile" },
  { label: "Settings", icon: <FaCog />, href: "/dashboard/settings" },
]

const ADMIN_ROUTES = NAV_ITEMS.filter((i) => !["Dashboard", "Print Label"].includes(i.label)).map(
  (i) => i.href
)

interface SidebarProps {
  isSetupPage?: boolean
}

export default function Sidebar({ isSetupPage = false }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

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
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing localStorage
  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredNavItems = isAdmin ? NAV_ITEMS : NAV_ITEMS.filter((i) => i.label === "Print Label")
  const isExpanded = sidebarOpen || sidebarMobile

  // Load initial data from localStorage
  useEffect(() => {
    if (!mounted) return

    setName(localStorage.getItem("name"))
    setIsAdmin(localStorage.getItem("adminAccess") === "true")
  }, [mounted])

  // Admin route protection
  useEffect(() => {
    if (!dataFetched || !mounted) return

    const onAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route))
    const onSetupProfile = pathname === "/dashboard/profile/setup"
    const adminFlag = localStorage.getItem("adminAccess") === "true"

    if (onAdminRoute && !adminFlag && !onSetupProfile) {
      router.push("/dashboard")
    }
  }, [pathname, dataFetched, router, mounted])

  // Load user data
  useEffect(() => {
    if (!mounted) return

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
  }, [dataFetched, mounted])

  // Profile setup redirect
  useEffect(() => {
    if (!dataFetched || isSetupPage || !mounted) return
    const profileComplete = profile?.company_name && profile?.address
    if (!profileComplete) router.push("/setup")
  }, [dataFetched, profile, subscription, pathname, isSetupPage, mounted])

  const handleLogout = () => {
    if (!mounted) return
    ;["token", "userid", "name", "profilePicture", "adminAccess"].forEach((k) =>
      localStorage.removeItem(k)
    )
    setIsAdmin(false)
    router.push("/login")
  }

  const toggleSidebar = () => {
    if (!mounted) return
    window.innerWidth < 1024 ? setSidebarMobile((v) => !v) : setSidebarOpen((v) => !v)
  }

  const handleAdminSuccess = () => {
    if (!mounted) return

    setIsAdmin(true)
    localStorage.setItem("adminAccess", "true")
    setShowPinModal(false)
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return null

  if (isSetupPage) return null

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
    <>
      <div className="z-20">
        {/* Mobile Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-50 h-10 w-10 rounded-md bg-[hsl(var(--primary))] text-white shadow-lg lg:hidden"
          aria-label="Toggle Sidebar"
        >
          {sidebarMobile ? <FaChevronLeft size={22} /> : <FaBars size={22} />}
        </button>

        {/* Desktop Toggle Button - positioned at sidebar edge */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "z-1 fixed top-1/2 hidden h-16 w-4 -translate-y-1/2 bg-[hsl(var(--primary))] text-white shadow-lg transition-all duration-300 ease-in-out hover:w-6 lg:flex lg:items-center lg:justify-center",
            sidebarOpen ? "left-64 rounded-r-lg" : "left-20 rounded-r-lg"
          )}
          aria-label="Toggle Sidebar"
        >
          <div className="flex flex-col space-y-1">
            <div className="h-1 w-2 rounded-full bg-white"></div>
            <div className="h-1 w-2 rounded-full bg-white"></div>
            <div className="h-1 w-2 rounded-full bg-white"></div>
          </div>
        </button>

        {/* Mobile Overlay */}
        <div
          onClick={() => setSidebarMobile(false)}
          className={cn("fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden", {
            "pointer-events-auto opacity-100": sidebarMobile,
            "pointer-events-none opacity-0": !sidebarMobile,
          })}
        />

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-50 flex h-full flex-col border-r bg-[hsl(var(--primary))] p-4 text-[hsl(var(--primary-foreground))] shadow-xl transition-all duration-300 ease-in-out",
            // Mobile behavior
            "lg:relative lg:z-auto lg:shadow-none",
            sidebarMobile ? "w-64 translate-x-0" : "w-64 -translate-x-full",
            // Desktop behavior
            sidebarOpen ? "lg:w-64 lg:translate-x-0" : "lg:w-20 lg:translate-x-0"
          )}
        >
          {/* Logo Section */}
          <div className="mb-6 flex">
            {isExpanded ? (
              <Image
                src="/long_longwhite.png"
                alt="Logo"
                width={120}
                height={40}
                className="transition-opacity"
              />
            ) : (
              <Image
                src="/logo_sm_white.png"
                alt="Small Logo"
                width={64}
                height={64}
                className="transition-opacity"
              />
            )}
          </div>

          <nav className="flex flex-grow flex-col space-y-1">
            {filteredNavItems.map(({ label, icon, href }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-white transition-colors hover:bg-white/10",
                  pathname === href && "bg-white/20"
                  //   isExpanded ? "justify-start" : "justify-center"
                )}
                onClick={() => setSidebarMobile(false)}
              >
                <span className="text-[1.3rem]">{icon}</span>
                {isExpanded && <span>{label}</span>}
                {!isExpanded && (
                  <span className="absolute left-full ml-2 hidden whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                    {label}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Admin Access Button - Only show when expanded and not admin */}
          {!isAdmin && isExpanded && (
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

          {/* Profile Section - Always same structure */}
          <div className="mb-4 mt-auto">
            <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3 text-sm text-white">
              {avatar !== null && (
                <div className="group relative">
                  <Image
                    src={`/avatar${avatar}.png`}
                    width={32}
                    height={32}
                    alt="Avatar"
                    className="rounded-full border border-white"
                  />
                  {/* Tooltip for collapsed state */}
                  {!isExpanded && profile?.company_name && (
                    <span className="absolute left-full z-10 ml-2 hidden whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                      {profile.company_name}
                    </span>
                  )}
                </div>
              )}
              {/* Company name - simple show/hide */}
              {isExpanded && profile?.company_name && (
                <div>
                  <span className="font-medium">{profile.company_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button - Always same structure */}
          <div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-400/10"
            >
              <div className="group relative">
                <IoLogOutOutline className="text-[1.3rem]" />
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <span className="absolute left-full z-10 ml-2 hidden whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                    Logout
                  </span>
                )}
              </div>
              {/* Logout text - simple show/hide */}
              {isExpanded && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* Admin PIN Modal */}
        <AdminPinModal
          isOpen={showPinModal}
          onClose={() => setShowPinModal(false)}
          onSuccess={handleAdminSuccess}
        />
      </div>
    </>
  )
}
