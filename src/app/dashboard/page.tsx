"use client"
import AppLoader from "@/components/AppLoader"
import { useAllergens } from "@/hooks/useAllergens"
import { useIngredients } from "@/hooks/useIngredients"
import { useMenuItems } from "@/hooks/useMenuItem"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const CARD_STYLES = {
  allergens: {
    bg: "bg-red-50",
    border: "border-red-500",
    shadow: "shadow-red-200",
    text: "text-red-700",
  },
  ingredients: {
    bg: "bg-green-50",
    border: "border-green-500",
    shadow: "shadow-green-200",
    text: "text-green-700",
  },
  menuItems: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    shadow: "shadow-blue-200",
    text: "text-blue-700",
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
  let activeKey = activeList ?? undefined
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
    },
    {
      key: "ingredients",
      title: "Ingredients",
      count: ingredients.length,
      loading: ingredientsLoading,
    },
    {
      key: "menuItems",
      title: "Menu Items",
      count: menuItems.length,
      loading: menuItemsLoading,
    },
  ] as const

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-2 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <section className="flex min-h-[80vh] flex-col rounded-2xl border-0 bg-white/80 p-8 shadow-xl backdrop-blur-md">
          <h1 className="mb-2 text-center text-5xl font-extrabold text-primary drop-shadow-lg">
            Dashboard
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-center text-lg font-medium text-gray-600">
            Welcome to your InstaLabel! Here you'll find an overview of your projects and stats.
          </p>
          <div className={`grid grid-cols-1 md:grid-cols-3 ${activeList ? "gap-0" : "gap-6"}`}>
            {cards.map((card) => {
              const isActive = activeList === card.key
              const style = CARD_STYLES[card.key]
              return (
                <button
                  key={card.key}
                  onClick={() => setActiveList(card.key)}
                  disabled={card.loading}
                  aria-label={`Show ${card.title}`}
                  className={[
                    "group flex flex-col items-center rounded-b-none rounded-t-2xl border-0 p-6 backdrop-blur-md transition-all duration-200",
                    style.bg,
                    style.shadow,
                    isActive ? `${style.border} ring-2 ring-inset ${style.border}` : "",
                  ].join(" ")}
                  style={{
                    cursor: card.loading ? "not-allowed" : "pointer",
                  }}
                >
                  <h2 className={`mb-2 text-xl font-semibold ${style.text}`}>{card.title}</h2>
                  <span className={`mb-1 text-4xl font-bold ${style.text}`}>
                    {card.loading ? <AppLoader message="" /> : card.count}
                  </span>
                </button>
              )
            })}

            <AnimatePresence>
              {activeList && (
                <div className="col-span-1 w-full md:col-span-3">
                  <div
                    className={[
                      "flex h-[400px] min-h-[40vh] flex-col rounded-b-2xl rounded-t-none border-t-0 p-6 backdrop-blur-md transition-all duration-300",
                      CARD_STYLES[activeList].bg,
                      CARD_STYLES[activeList].border,
                      CARD_STYLES[activeList].shadow,
                    ].join(" ")}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className={`text-xl font-bold ${CARD_STYLES[activeList].text}`}>
                        {listTitle}
                      </h2>
                      <button
                        className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
                        onClick={() => setActiveList(null)}
                      >
                        Close
                      </button>
                    </div>
                    <ul className="max-h-full flex-1 overflow-y-auto">
                      {listItems.length === 0 ? (
                        <li className="h-full py-2 text-center text-gray-500" />
                      ) : (
                        listItems.map((item, idx) => (
                          <li
                            key={idx}
                            className="border-b border-white/30 px-1 py-2 text-gray-900 hover:bg-white/10"
                          >
                            {item}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
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
