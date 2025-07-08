import React from "react"
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/page"
import { LabelShowcase } from "./LabelShowcase"
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
const storageInfo = "Keep refrigerated below 5°C. Consume within 2 days of opening."
const businessName = "InstaLabel Ltd"

export const PPDSLabelShowcaseSection = () => (
  <section className="relative bg-white px-4 sm:px-6 py-16 border-t border-b border-purple-100">
    <div className="relative mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-12 md:gap-20">
      <div className="flex-1 space-y-6">
        <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
          <span role="img" aria-label="label">🏷️</span> Natasha's Law / PPDS Labels
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Full-Compliance Food Labels, Instantly
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          InstaLabel makes it effortless to print fully compliant PPDS (Prepacked for Direct Sale) labels. Our system automatically pulls ingredients and allergens, formats them to FSA standards, and lets you add storage instructions and business info. No more manual editing or compliance worries—just tap, print, and go.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-base">
          <li>Allergen summary and inline highlighting</li>
          <li>Customisable storage instructions</li>
          <li>Business name and traceability info</li>
          <li>80mm label layout for maximum clarity</li>
        </ul>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* 60mm x 80mm at 96dpi: 60mm = ~227px, 80mm = ~303px */}
        <div style={{ width: 227, height: 303, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PPDSLabelRenderer
            item={sampleItem}
            storageInfo={storageInfo}
            businessName={businessName}
            allIngredients={allIngredients}
          />
        </div>
        <div className="text-xs text-gray-400 mt-2">Example: Chicken Caesar Salad (PPDS)</div>
      </div>
    </div>
    <LabelShowcase/>
  </section>
) 