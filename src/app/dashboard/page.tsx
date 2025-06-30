"use client"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import AppLoader from "@/components/AppLoader"
import { useAllergens } from "@/hooks/useAllergens"
import { useIngredients } from "@/hooks/useIngredients"
import { useMenuItems } from "@/hooks/useMenuItem"

const CARD_STYLES = {
  allergens: {
    bg: "bg-gradient-to-br from-red-50 to-red-100",
    border: "border-red-300",
    shadow: "shadow-red-100",
    text: "text-red-700",
    accent: "bg-red-500",
    hover: "hover:from-red-100 hover:to-red-150",
    icon: "🚫"
  },
  ingredients: {
    bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    border: "border-emerald-300",
    shadow: "shadow-emerald-100",
    text: "text-emerald-700",
    accent: "bg-emerald-500",
    hover: "hover:from-emerald-100 hover:to-emerald-150",
    icon: "🥬"
  },
  menuItems: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    border: "border-blue-300",
    shadow: "shadow-blue-100",
    text: "text-blue-700",
    accent: "bg-blue-500",
    hover: "hover:from-blue-100 hover:to-blue-150",
    icon: "📋"
  },
}

export default function DashboardPage() {
  const [activeList, setActiveList] = useState<"allergens" | "ingredients" | "menuItems" | null>(null)

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
      description: "Manage your custom allergen list"
    },
    {
      key: "ingredients",
      title: "Ingredients",
      count: ingredients.length,
      loading: ingredientsLoading,
      description: "Track all available ingredients"
    },
    {
      key: "menuItems",
      title: "Menu Items",
      count: menuItems.length,
      loading: menuItemsLoading,
      description: "View your complete menu"
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
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
            Dashboard
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Welcome to your InstaLabel! Here you'll find an overview of your projects and stats.
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Stats Cards */}
          <div className={`grid transition-all duration-500 ease-in-out ${
            activeList ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3 gap-0'
          } w-full`}>
            {!activeList && cards.map((card, index) => {
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
                  className={`
                    group relative p-8 text-left transition-all duration-300 ease-out w-full
                    ${style.bg} ${style.hover} ${style.shadow}
                    border-r border-white/30 last:border-r-0 md:border-r md:last:border-r-0
                    hover:shadow-xl hover:shadow-slate-200/50
                    disabled:cursor-not-allowed disabled:opacity-50
                  `}
                >
                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl mb-2">{style.icon}</div>
                      <div className={`w-3 h-3 rounded-full ${style.accent} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
                    </div>
                    
                    <h3 className={`text-lg font-bold ${style.text} mb-2 group-hover:text-opacity-90 transition-colors`}>
                      {card.title}
                    </h3>
                    
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className={`text-4xl font-black ${style.text}`}>
                        {card.loading ? <AppLoader message="" /> : card.count}
                      </span>
                      <span className="text-sm text-slate-500 font-medium">items</span>
                    </div>
                    
                    <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                      {card.description}
                    </p>
                  </div>

                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  className="col-span-1 md:col-span-3 overflow-hidden"
                >
                  <div className={`
                    p-8 min-h-[500px] relative
                    ${CARD_STYLES[activeList].bg}
                  `}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{CARD_STYLES[activeList].icon}</div>
                        <div>
                          <h2 className={`text-2xl font-bold ${CARD_STYLES[activeList].text}`}>
                            {listTitle}
                          </h2>
                          <p className="text-slate-600 text-sm mt-1">
                            {listItems.length} total items
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-white/80 hover:bg-white text-slate-700 font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 backdrop-blur-sm border border-white/50"
                        onClick={() => setActiveList(null)}
                      >
                        ← Back to Overview
                      </motion.button>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                      {listItems.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-500">
                          <div className="text-6xl mb-4 opacity-30">📋</div>
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
                            className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${CARD_STYLES[activeList].accent} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
                              <span className="text-slate-800 font-medium group-hover:text-slate-900 transition-colors truncate">
                                {item}
                              </span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                    
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-xl"></div>
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
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="text-center py-12 px-8">
        <div className="h-12 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mb-4 animate-pulse"></div>
        <div className="h-6 bg-slate-200 rounded-lg mb-12 max-w-md mx-auto animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-8 border-r border-white/30 last:border-r-0">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
              <div className="h-6 bg-slate-200 rounded animate-pulse w-3/4"></div>
              <div className="h-10 bg-slate-200 rounded animate-pulse w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}