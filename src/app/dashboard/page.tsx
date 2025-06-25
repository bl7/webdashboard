"use client"
import AppLoader from "@/components/AppLoader"
import { useAllergens } from "@/hooks/useAllergens"
import { useIngredients } from "@/hooks/useIngredients"
import { useMenuItems } from "@/hooks/useMenuItem"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export default function DashboardPage() {
  const [activeList, setActiveList] = useState<"allergens" | "ingredients" | "menuItems" | null>(
    null
  )

  const { customAllergens, isLoading: allergensLoading } = useAllergens()
  const { ingredients, loading: ingredientsLoading } = useIngredients()
  const { menuItems, loading: menuItemsLoading } = useMenuItems()

  const allLoading = allergensLoading || ingredientsLoading || menuItemsLoading

  // Show skeleton for the whole page if any data is loading and nothing is loaded yet
  if (
    (allergensLoading && customAllergens.length === 0) ||
    (ingredientsLoading && ingredients.length === 0) ||
    (menuItemsLoading && menuItems.length === 0)
  ) {
    return (
      <div className="flex min-h-screen items-start justify-center bg-gradient-to-br from-muted/60 to-white px-2 py-10">
        <div className="w-full max-w-5xl">
          <DashboardSkeleton />
        </div>
      </div>
    )
  }

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
    listItems = menuItems.map((m) => m.name)
  }

  // Card configs
  const cards = [
    {
      key: "allergens",
      title: "Custom Allergens",
      count: customAllergens.length,
      loading: allergensLoading,
      desc: "active custom allergens",
    },
    {
      key: "ingredients",
      title: "Ingredients",
      count: ingredients.length,
      loading: ingredientsLoading,
      desc: "ingredients being used in the restaurant",
    },
    {
      key: "menuItems",
      title: "Menu Items",
      count: menuItems.length,
      loading: menuItemsLoading,
      desc: "menu items",
    },
  ] as const

  return (
    <div className="flex min-h-screen items-start justify-center bg-gradient-to-br from-muted/60 to-white px-2 py-10">
      <div className="w-full max-w-5xl">
        <section className="rounded-2xl border bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-3xl font-bold text-primary">Dashboard</h1>
          <p className="mb-8 text-muted-foreground">
            Welcome to your InstaLabel! Here you’ll find an overview of your projects and stats.
          </p>

          <div className={`grid grid-cols-1 md:grid-cols-3 ${activeList ? "gap-0" : "gap-6"}`}>
            {cards.map((card) => {
              const isActive = activeList === card.key
              return (
                <button
                  key={card.key}
                  onClick={() => setActiveList(card.key)}
                  disabled={card.loading}
                  aria-label={`Show ${card.title}`}
                  className={[
                    // Remove bottom radius always, keep top radius
                    "group flex flex-col items-center rounded-b-none rounded-t-lg border-2 border-primary bg-card p-6 shadow-md outline-none transition-all duration-200",
                    isActive ? "border-b-0" : "border-b-2",
                    "hover:border-primary hover:shadow-lg focus:ring-2 focus:ring-primary/40",
                  ].join(" ")}
                  style={{
                    cursor: card.loading ? "not-allowed" : "pointer",
                  }}
                >
                  <h2 className="mb-2 text-xl font-semibold text-foreground">{card.title}</h2>
                  <span className="mb-1 text-3xl font-bold text-blue-700 underline underline-offset-2 group-hover:text-primary">
                    {card.loading ? <AppLoader message="" /> : card.count}
                  </span>
                  <p className="text-muted-foreground">{card.desc}</p>
                </button>
              )
            })}

            <AnimatePresence>
              {activeList && (
                <motion.div
                  key={activeList}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22 }}
                  className="col-span-1 w-full md:col-span-3"
                >
                  {/* Remove top radius, keep bottom radius */}
                  <div className="rounded-b-2xl rounded-t-none border-2 border-t-0 border-primary bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-xl font-bold">{listTitle}</h2>
                      <button
                        className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
                        onClick={() => setActiveList(null)}
                      >
                        Close
                      </button>
                    </div>
                    <ul className="max-h-96 overflow-y-auto">
                      {listItems.length === 0 ? (
                        <li className="py-2 text-center text-gray-500">No items found.</li>
                      ) : (
                        listItems.map((item, idx) => (
                          <li key={idx} className="border-b px-1 py-2 hover:bg-gray-100">
                            {item}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  )
}
function DashboardSkeleton() {
  return (
    <section className="rounded-2xl border bg-white p-8 shadow-lg">
      <div className="mb-4 h-10 w-1/3 animate-pulse rounded bg-muted-foreground/20" />
      <div className="mb-8 h-6 w-1/2 animate-pulse rounded bg-muted-foreground/10" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-b-none rounded-t-lg border-2 border-primary bg-card p-6 shadow-md"
          >
            <div className="mb-2 h-6 w-24 animate-pulse rounded bg-muted-foreground/20" />
            <div className="mb-1 h-10 w-16 animate-pulse rounded bg-muted-foreground/20" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted-foreground/10" />
          </div>
        ))}
      </div>
    </section>
  )
}
// Place DashboardSkeleton above or below your component in the same file.
