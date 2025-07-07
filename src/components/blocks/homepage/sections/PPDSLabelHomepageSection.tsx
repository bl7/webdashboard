import React from "react"
import LabelRender from "@/app/dashboard/print/LabelRender"

const sampleItem = {
  uid: "demo-ppds-1",
  id: "1",
  type: "menu",
  name: "Chicken Caesar Salad",
  quantity: 1,
  labelType: "ppds",
  ingredients: ["Chicken Breast", "Romaine Lettuce", "Caesar Dressing", "Parmesan Cheese", "Croutons"],
  printedOn: "2024-06-01",
  expiryDate: "2024-06-03"
}
const allIngredients = [
  { uuid: "a1", ingredientName: "Chicken Breast", allergens: [] },
  { uuid: "a2", ingredientName: "Romaine Lettuce", allergens: [] },
  { uuid: "a3", ingredientName: "Caesar Dressing", allergens: [ { allergenName: "Egg" }, { allergenName: "Fish" } ] },
  { uuid: "a4", ingredientName: "Parmesan Cheese", allergens: [ { allergenName: "Milk" } ] },
  { uuid: "a5", ingredientName: "Croutons", allergens: [ { allergenName: "Wheat" } ] },
]
const allergens = ["Egg", "Milk", "Wheat", "Fish"]

export const PPDSLabelHomepageSection = () => (
  <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-24 px-4 sm:px-6 md:px-12 lg:px-16">
    <div className="container mx-auto max-w-4xl flex flex-col md:flex-row items-center gap-12 md:gap-20">
      <div className="flex-1 space-y-6 text-center md:text-left">
        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200">
          <span role="img" aria-label="label">🏷️</span> For Every Food Business
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">PPDS & Natasha's Law Labels</span>
        </h2>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto md:mx-0 leading-relaxed">
          Whether you run a bakery, deli, food truck, or supermarket, InstaLabel makes it easy to print fully compliant food labels—no kitchen required. Protect your customers, your brand, and your business with effortless, professional labeling.
        </p>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-2xl border border-purple-200 p-6">
          <LabelRender
            item={sampleItem as any}
            expiry={sampleItem.expiryDate}
            useInitials={false}
            selectedInitial={""}
            allergens={allergens}
            labelHeight="80mm"
            allIngredients={allIngredients}
          />
        </div>
        <div className="text-xs text-gray-400 mt-2">Example: Chicken Caesar Salad (PPDS)</div>
      </div>
    </div>
  </section>
) 