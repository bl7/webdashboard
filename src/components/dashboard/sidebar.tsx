"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  FaHome,
  FaChartPie,
  FaCog,
  FaUser,
  FaPrint,
  FaBars,
  FaChevronLeft,
  FaUpload,
} from "react-icons/fa"
import { GiShrimp, GiChickenOven } from "react-icons/gi"
import { MdRestaurantMenu } from "react-icons/md"
import { FaLayerGroup } from "react-icons/fa6"
import { IoLogOutOutline } from "react-icons/io5"
import { RiAdminLine } from "react-icons/ri"
import { GoLog } from "react-icons/go"
import Image from "next/image"
import { cn } from "@/lib/utils"
import AdminPinModal from "./adminPinModal"
import SidebarSkeleton from "./SidebarSkeleton"
import * as Tooltip from "@radix-ui/react-tooltip"

const NAV_ITEMS = [
  { label: "Dashboard", icon: <FaHome />, href: "/dashboard" },
  { label: "Analytics", icon: <FaChartPie />, href: "/dashboard/analytics" },
  { label: "Print Label", icon: <FaPrint />, href: "/dashboard/print" },
  { label: "Print Sessions", icon: <GoLog />, href: "/dashboard/logs" },
  { label: "PrintBridge Test", icon: <FaPrint />, href: "/dashboard/printbridge-test" },
  { label: "Menu Items", icon: <MdRestaurantMenu />, href: "/dashboard/menuitem" },
  { label: "Ingredients", icon: <GiChickenOven />, href: "/dashboard/ingredients" },
  { label: "Allergens", icon: <GiShrimp />, href: "/dashboard/allergens" },
  // { label: "Groups", icon: <FaLayerGroup />, href: "/dashboard/group" },
  { label: "Upload", icon: <FaUpload />, href: "/dashboard/upload" },
  { label: "Profile", icon: <FaUser />, href: "/dashboard/profile" },
  { label: "Settings", icon: <FaCog />, href: "/dashboard/settings" },
]

const ADMIN_ROUTES = NAV_ITEMS.filter((i) => !["Dashboard", "Print Label", "PrintBridge Test"].includes(i.label)).map(
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
    email: string | null
    address?: string | null
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

  const filteredNavItems = isAdmin
    ? NAV_ITEMS
    : NAV_ITEMS.filter((i) => ["Dashboard", "Print Label"].includes(i.label));
  const isExpanded = sidebarOpen || sidebarMobile

  // Insert PPDS link for admins only after 'Print Label'
  const navItemsWithPPDS = isAdmin
    ? [
        ...NAV_ITEMS.slice(0, 3),
        { label: "PPDS", icon: <FaPrint />, href: "/dashboard/ppds" },
        ...NAV_ITEMS.slice(3),
      ]
    : filteredNavItems;

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
      const token = localStorage.getItem("token")
      if (!userId || !token) return setError("User ID or token not found. Please login.")

      try {
        const [profileRes, subRes, adminRes] = await Promise.all([
          fetch(`/api/profile?user_id=${userId}`),
          fetch(`/api/subscription_better/status`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }),
          fetch(`/api/admin-access?user_id=${userId}`),
        ])

        // Check if any of the responses indicate authentication failure
        if (profileRes.status === 401 || subRes.status === 401 || adminRes.status === 401) {
          // Token is expired or invalid, redirect to login
          localStorage.clear()
          router.push("/login")
          return
        }

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
    const profileComplete = profile?.company_name && profile?.email
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
    return <SidebarSkeleton />
  }

  return (
    <Tooltip.Provider>
      <div className="sticky top-0 z-20 h-screen shrink-0 overflow-y-auto">
        {/* Mobile Toggle Button */}
        <div className="fixed left-0 top-0 z-50 flex items-center h-16 w-full bg-transparent lg:hidden">
        <button
          onClick={toggleSidebar}
            className="ml-4 flex h-10 w-10 items-center justify-center rounded-md bg-[hsl(var(--primary))] text-white shadow-lg"
          aria-label="Toggle Sidebar"
        >
          {sidebarMobile ? <FaChevronLeft size={22} /> : <FaBars size={22} />}
        </button>
        </div>

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
            // removed overflow-y-auto here!
            "lg:relative lg:z-auto lg:shadow-none",
            sidebarMobile ? "w-64 translate-x-0" : "w-64 -translate-x-full",
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
              <div className="w-full flex items-center justify-center">
              <Image
                src="/logo_sm_white.png"
                alt="Small Logo"
                  width={40}
                  height={40}
                className="transition-opacity"
              />
              </div>
            )}
          </div>

          {/* Make only the nav scrollable */}
          <nav className="flex flex-grow flex-col space-y-1 overflow-y-auto">
            {navItemsWithPPDS.map(({ label, icon, href }) => (
              <Tooltip.Root key={label} delayDuration={100}>
                <Tooltip.Trigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-white transition-colors hover:bg-white/10",
                      pathname === href && "bg-white/20"
                    )}
                    onClick={() => setSidebarMobile(false)}
                  >
                    <span className="text-[1.3rem]">{icon}</span>
                    {isExpanded && <span>{label}</span>}
                  </Link>
                </Tooltip.Trigger>
                {/* Only show tooltip when sidebar is collapsed */}
                {!isExpanded && (
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="right"
                      align="center"
                      className="z-[2147483647] select-none rounded bg-black px-2 py-1 text-xs text-white shadow-lg"
                      sideOffset={8}
                    >
                      {label}
                      <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                )}
              </Tooltip.Root>
            ))}
          </nav>

          {/* Admin Access Button - Always show when not admin */}
          {!isAdmin && (
            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => {
                    setShowPinModal(true)
                    setSidebarMobile(false)
                  }}
                  className="group relative mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-yellow-300 hover:bg-yellow-400/10"
                >
                  <RiAdminLine className="text-[1.3rem]" />
                  {isExpanded && <span>Admin Access</span>}
                </button>
              </Tooltip.Trigger>
              {!isExpanded && (
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    align="center"
                    className="z-[2147483647] select-none rounded bg-black px-2 py-1 text-xs text-white shadow-lg"
                    sideOffset={8}
                  >
                    Admin Access
                    <Tooltip.Arrow className="fill-black" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
          )}

          {/* Profile Section */}
          <div className="mb-4 mt-auto">
            <Tooltip.Root delayDuration={100}>
              <Tooltip.Trigger asChild>
                <div className="group relative flex cursor-pointer items-center gap-3 rounded-lg bg-white/10 p-3 text-sm text-white">
                  {avatar !== null && (
                    <Image
                      src={`/avatar${avatar}.png`}
                      width={32}
                      height={32}
                      alt="Avatar"
                      className="rounded-full border border-white"
                    />
                  )}
                  {isExpanded && profile?.company_name && (
                    <span className="font-medium">{profile.company_name}</span>
                  )}
                </div>
              </Tooltip.Trigger>
              {/* Tooltip for collapsed state */}
              {!isExpanded && profile?.company_name && (
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    align="center"
                    className="z-[2147483647] select-none rounded bg-black px-2 py-1 text-xs text-white shadow-lg"
                    sideOffset={8}
                  >
                    {profile.company_name}
                    <Tooltip.Arrow className="fill-black" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              )}
            </Tooltip.Root>
          </div>

          {/* Logout Button */}
          <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger asChild>
              <button
                onClick={handleLogout}
                className="group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-400/10"
              >
                <IoLogOutOutline className="text-[1.3rem]" />
                {isExpanded && <span>Logout</span>}
              </button>
            </Tooltip.Trigger>
            {/* Tooltip for collapsed state */}
            {!isExpanded && (
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  align="center"
                  className="z-[2147483647] select-none rounded bg-black px-2 py-1 text-xs text-white shadow-lg"
                  sideOffset={8}
                >
                  Logout
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        </aside>

        {/* Admin PIN Modal */}
        <AdminPinModal
          isOpen={showPinModal}
          onClose={() => setShowPinModal(false)}
          onSuccess={handleAdminSuccess}
        />
      </div>
    </Tooltip.Provider>
  )
}
