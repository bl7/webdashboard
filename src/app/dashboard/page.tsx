"use client"
import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, Clock, ChevronDown, ChevronUp } from "lucide-react"

import AppLoader from "@/components/AppLoader"
import { useAllergens } from "@/hooks/useAllergens"
import { useIngredients } from "@/hooks/useIngredients"
import { useMenuItems } from "@/hooks/useMenuItem"
import NextToExpireList from "./analytics/NextToExpireList"
import AboutToExpireList from "./analytics/AboutToExpireList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SalesPrepSuggestions from "@/components/dashboard/SalesPrepSuggestions"
import LowStockAlerts from "@/components/dashboard/LowStockAlerts"
import PopularItemsDashboard from "@/components/dashboard/PopularItemsDashboard"

const CARD_STYLES = {
  allergens: {
    bg: "bg-gradient-to-br from-red-50 to-red-100",
    border: "border-red-300",
    shadow: "shadow-red-100",
    text: "text-red-700",
    accent: "bg-red-500",
    hover: "hover:from-red-100 hover:to-red-150",
    icon: "🚫",
  },
  ingredients: {
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    border: "border-emerald-300",
    shadow: "shadow-emerald-100",
    text: "text-emerald-700",
    accent: "bg-emerald-500",
    hover: "hover:from-emerald-100 hover:to-emerald-150",
    icon: "🥬",
  },
  menuItems: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    border: "border-purple-300",
    shadow: "shadow-blue-100",
    text: "text-purple-700",
    accent: "bg-purple-500",
    hover: "hover:from-blue-100 hover:to-blue-150",
    icon: "📋",
  },
}

export default function DashboardPage() {
  const [activeList, setActiveList] = useState<"allergens" | "ingredients" | "menuItems" | null>(
    null
  )

  const { customAllergens, isLoading: allergensLoading } = useAllergens()
  const { ingredients, loading: ingredientsLoading } = useIngredients()
  const { menuItems, loading: menuItemsLoading } = useMenuItems()

  const allLoading = allergensLoading || ingredientsLoading || menuItemsLoading

  // Helper to get the correct list and title
  let listTitle = ""
  let listItems: string[] = []
  if (activeList === "allergens") {
    listTitle = "Custom Allergens"
    listItems = customAllergens.map((a) => a.name)
  } else if (activeList === "ingredients") {
    listTitle = "Ingredients"
    listItems = ingredients.map((i) => i.ingredientName)
  } else if (activeList === "menuItems") {
    listTitle = "Menu Items"
    listItems = menuItems.map((m) => m.menuItemName)
  }

  // Card configs
  const cards = [
    {
      key: "allergens",
      title: "Custom Allergens",
      count: customAllergens.length,
      loading: allergensLoading,
      description: "Manage your custom allergen list",
    },
    {
      key: "ingredients",
      title: "Ingredients",
      count: ingredients.length,
      loading: ingredientsLoading,
      description: "Track all available ingredients",
    },
    {
      key: "menuItems",
      title: "Menu Items",
      count: menuItems.length,
      loading: menuItemsLoading,
      description: "View your complete menu",
    },
  ] as const

  if (
    (allergensLoading && customAllergens.length === 0) ||
    (ingredientsLoading && ingredients.length === 0) ||
    (menuItemsLoading && menuItems.length === 0)
  ) {
    return (
      <div className="flex min-h-screen items-start justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12">
        <div className="w-full max-w-7xl">
          <DashboardSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto w-full max-w-7xl">
        {/* Expiration Metrics Cards */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <AboutToExpireList />
        </motion.section>

        {/* Next To Expire Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <NextToExpireList />
        </motion.section>

        {/* Square Integration Dashboard */}
        {/* <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesPrepSuggestions />
            <LowStockAlerts />
          </div>
          <PopularItemsDashboard />
        </motion.section> */}

        {/* Main Content */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl"
        >
          {/* Stats Cards */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              activeList ? "grid-cols-1" : "grid-cols-1 gap-0 md:grid-cols-3"
            } w-full`}
          >
            {!activeList &&
              cards.map((card, index) => {
                const style = CARD_STYLES[card.key]
                return (
                  <motion.button
                    key={card.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveList(card.key)}
                    disabled={card.loading}
                    className={`group relative w-full p-8 text-left transition-all duration-300 ease-out ${style.bg} ${style.hover} ${style.shadow} border-r border-white/30 last:border-r-0 hover:shadow-xl hover:shadow-slate-200/50 disabled:cursor-not-allowed disabled:opacity-50 md:border-r md:last:border-r-0`}
                  >
                    {/* Card Content */}
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="mb-2 text-4xl">{style.icon}</div>
                        <div
                          className={`h-3 w-3 rounded-full ${style.accent} opacity-60 transition-opacity group-hover:opacity-100`}
                        ></div>
                      </div>

                      <h3
                        className={`text-lg font-bold ${style.text} mb-2 transition-colors group-hover:text-opacity-90`}
                      >
                        {card.title}
                      </h3>

                      <div className="mb-3 flex items-baseline gap-2">
                        <span className={`text-4xl font-black ${style.text}`}>
                          {card.loading ? <AppLoader message="" /> : card.count}
                        </span>
                        <span className="text-sm font-medium text-slate-500">items</span>
                      </div>

                      <p className="text-sm text-slate-600 transition-colors group-hover:text-slate-700">
                        {card.description}
                      </p>
                    </div>

                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </motion.button>
                )
              })}

            {/* Expanded List View */}
            <AnimatePresence mode="wait">
              {activeList && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="col-span-1 overflow-hidden md:col-span-3"
                >
                  <div className={`relative min-h-[500px] p-8 ${CARD_STYLES[activeList].bg} `}>
                    {/* Header */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl sm:text-3xl">{CARD_STYLES[activeList].icon}</div>
                        <div>
                          <h2 className={`text-xl font-bold sm:text-2xl ${CARD_STYLES[activeList].text}`}>
                            {listTitle}
                          </h2>
                          <p className="mt-1 text-sm text-slate-600">
                            {listItems.length} total items
                          </p>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full rounded-xl border border-white/50 bg-white/80 px-6 py-3 font-medium text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-lg sm:w-auto"
                        onClick={() => setActiveList(null)}
                      >
                        ← Back to Overview
                      </motion.button>
                    </div>

                    {/* Items Grid */}
                    <div className="custom-scrollbar grid max-h-80 grid-cols-1 gap-4 overflow-y-auto pr-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {listItems.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-500">
                          <div className="mb-4 text-6xl opacity-30">📋</div>
                          <p className="text-lg font-medium">No items found</p>
                          <p className="text-sm">Add some items to get started</p>
                        </div>
                      ) : (
                        listItems.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: idx * 0.02 }}
                            whileHover={{ scale: 1.02, y: -1 }}
                            className="group cursor-pointer rounded-xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-2 w-2 rounded-full ${CARD_STYLES[activeList].accent} opacity-60 transition-opacity group-hover:opacity-100`}
                              ></div>
                              <span className="truncate font-medium text-slate-800 transition-colors group-hover:text-slate-900">
                                {item}
                              </span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>

                    {/* Background decoration */}
                    <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-xl"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Expiration Metrics Skeleton */}
      <div className="mb-8">
        <div className="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200"></div>
                <div>
                  <div className="mb-1 h-5 w-32 animate-pulse rounded bg-slate-200"></div>
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-1 h-8 w-16 animate-pulse rounded bg-slate-200"></div>
                <div className="h-4 w-12 animate-pulse rounded bg-slate-200"></div>
              </div>
            </div>
            <div className="h-4 w-48 animate-pulse rounded bg-slate-200"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-xl">
        <div className="px-8 py-12 text-center">
          <div className="mb-4 h-12 animate-pulse rounded-lg bg-gradient-to-r from-slate-200 to-slate-300"></div>
          <div className="mx-auto mb-12 h-6 max-w-md animate-pulse rounded-lg bg-slate-200"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-r border-white/30 p-8 last:border-r-0">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200"></div>
                  <div className="h-3 w-3 animate-pulse rounded-full bg-slate-200"></div>
                </div>
                <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200"></div>
                <div className="h-10 w-1/2 animate-pulse rounded bg-slate-200"></div>
                <div className="h-4 w-full animate-pulse rounded bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
