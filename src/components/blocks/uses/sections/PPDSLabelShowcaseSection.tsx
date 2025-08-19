"use client"
import React from "react"
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/PPDSLabelRenderer"
import { LabelShowcase } from "./LabelShowcase"
import { motion } from "framer-motion"
const sampleItem = {
  uid: "demo-ppds-1",
  id: "1",
  type: "menu",
  name: "Chicken Caesar Salad",
  quantity: 1,
  labelType: "ppds",
  ingredients: [
    "Chicken Breast",
    "Romaine Lettuce",
    "Caesar Dressing",
    "Parmesan Cheese",
    "Croutons",
  ],
  printedOn: "2024-06-01",
  expiryDate: "2024-06-03",
}
const allIngredients = [
  { uuid: "a1", ingredientName: "Chicken Breast", allergens: [] },
  { uuid: "a2", ingredientName: "Romaine Lettuce", allergens: [] },
  {
    uuid: "a3",
    ingredientName: "Caesar Dressing",
    allergens: [{ allergenName: "Egg" }, { allergenName: "Fish" }],
  },
  { uuid: "a4", ingredientName: "Parmesan Cheese", allergens: [{ allergenName: "Milk" }] },
  { uuid: "a5", ingredientName: "Croutons", allergens: [{ allergenName: "Wheat" }] },
]
const storageInfo = "Keep refrigerated below 5°C. Consume within 2 days of opening."
const businessName = "InstaLabel Ltd"

export const PPDSLabelShowcaseSection = () => (
  <section className="relative border-b border-t border-purple-100 bg-white px-4 py-16 sm:px-6">
    <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row md:gap-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex-1 space-y-6"
      >
        <div className="mx-auto inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200 lg:mx-0">
          <span role="img" aria-label="label">
            🏷️
          </span>{" "}
          Natasha's Law / PPDS Labels
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-left">
          Full-Compliance Food Labels, Instantly
        </h2>
        <p className="text-center text-lg leading-relaxed text-gray-700 lg:text-left">
          InstaLabel makes it effortless to print fully compliant PPDS (Prepacked for Direct Sale)
          labels. Our system automatically pulls ingredients and allergens, formats them to FSA
          standards, and lets you add storage instructions and business info. No more manual editing
          or compliance worries—just tap, print, and go.
        </p>
        <ul className="mx-auto list-disc space-y-2 text-center text-base text-gray-700 lg:mx-0 lg:text-left">
          <li>Allergen summary and inline highlighting</li>
          <li>Customisable storage instructions</li>
          <li>Business name and traceability info</li>
          <li>80mm label layout for maximum clarity</li>
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex flex-1 flex-col items-center justify-center"
      >
        {/* 60mm x 80mm at 96dpi: 60mm = ~227px, 80mm = ~303px */}
        <div
          style={{
            width: 227,
            height: 303,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PPDSLabelRenderer
            item={sampleItem}
            storageInfo={storageInfo}
            businessName={businessName}
            allIngredients={allIngredients}
          />
        </div>
        <div className="mt-2 text-xs text-gray-400">Example: Chicken Caesar Salad (PPDS)</div>
      </motion.div>
    </div>
    <LabelShowcase />
  </section>
)
