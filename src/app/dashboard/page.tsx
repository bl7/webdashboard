"use client"
import { useAllergens } from "@/hooks/useAllergens"
import { useIngredients } from "@/hooks/useIngredients"
import { useMenuItems } from "@/hooks/useMenuItem"
import { useState } from "react"

export default function DashboardPage() {
  const [activeList, setActiveList] = useState<"allergens" | "ingredients" | "menuItems" | null>(
    null
  )

  const { customAllergens, isLoading: allergensLoading } = useAllergens()
  const { ingredients, loading: ingredientsLoading } = useIngredients()
  const { menuItems, loading: menuItemsLoading } = useMenuItems()

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

  return (
    <section className="p-6">
      <h1 className="mb-4 text-3xl font-bold text-primary">Dashboard</h1>
      <p className="mb-8 text-muted-foreground">
        Welcome to your InstaLabel! Here you’ll find an overview of your projects and stats.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Allergens Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-foreground">Custom Allergens</h2>
          <button
            className="text-2xl font-bold text-blue-700 underline underline-offset-2"
            onClick={() => setActiveList("allergens")}
            disabled={allergensLoading}
            aria-label="Show custom allergens"
          >
            {customAllergens.length}
          </button>
          <p className="text-muted-foreground">active custom allergens</p>
        </div>

        {/* Ingredients Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-foreground">Ingredients</h2>
          <button
            className="text-2xl font-bold text-blue-700 underline underline-offset-2"
            onClick={() => setActiveList("ingredients")}
            disabled={ingredientsLoading}
            aria-label="Show ingredients"
          >
            {ingredients.length}
          </button>
          <p className="text-muted-foreground">ingredients being used in the restaurant</p>
        </div>

        {/* Menu Items Card */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-foreground">Menu Items</h2>
          <button
            className="text-2xl font-bold text-blue-700 underline underline-offset-2"
            onClick={() => setActiveList("menuItems")}
            disabled={menuItemsLoading}
            aria-label="Show menu items"
          >
            {menuItems.length}
          </button>
          <p className="text-muted-foreground">menu items</p>
        </div>
      </div>

      {/* Inline List Display */}
      {activeList && (
        <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-md">
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
      )}
    </section>
  )
}
