'use client'
import React from "react"
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/page"
import { motion } from "framer-motion"

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

export const PPDSLabelHomepageSection = () => (
  <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-16 px-4 sm:px-6 md:px-12 lg:px-16">
    <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-12 md:gap-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex-1 space-y-6 text-center md:text-left"
      >
        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200">
          <span role="img" aria-label="label">🏷️</span> Professional Labeling Made Simple
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            PPDS & Natasha's Law Labels
          </span>
          <br />
          <span className="text-gray-900">Professional, Compliant, Easy</span>
        </h2>
        <p className="text-xl text-gray-700 max-w-2xl mx-auto md:mx-0 leading-relaxed">
          Print professional PPDS labels with automatic date calculations, allergen warnings, and storage instructions. Perfect for any kitchen that needs to comply with Natasha's Law - from restaurants to delis to food trucks.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex-1 flex flex-col items-center justify-center"
      >
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
      </motion.div>
    </div>
  </section>
) 