"use client"

import React from "react"
import Image from "next/image"
import LabelRender from "@/app/dashboard/print/LabelRender"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/PPDSLabelRenderer"
import { Printer, Layers, BarChart3, LayoutDashboard } from "lucide-react"

const WhatWeDoShowcase = () => {
  // Device image
  const deviceImg = require("@/assets/images/plandevices.png")

  // Label sample data (reuse from LabelShowcase)
  const labelSamples = [
    {
      label: "Ingredient Label",
      props: {
        item: {
          uid: "1",
          id: "1",
          type: "ingredients" as "ingredients",
          name: "Fresh Basil",
          quantity: 1,
          allergens: [],
          printedOn: "2024-07-01T08:00:00Z",
          expiryDate: "2024-07-05T08:00:00Z",
        },
        expiry: "2024-07-05T08:00:00Z",
        useInitials: true,
        selectedInitial: "BR",
        allergens: [],
        labelHeight: "40mm" as const,
        allIngredients: [],
      },
    },
    {
      label: "Prep Label",
      props: {
        item: {
          uid: "2",
          id: "2",
          type: "menu" as "menu",
          name: "Mixed Vegetables",
          quantity: 1,
          ingredients: ["Carrots", "Broccoli", "Celery", "Peppers"],
          allergens: [
            {
              uuid: 3,
              allergenName: "Celery",
              category: "Vegetable",
              status: "Active" as const,
              addedAt: "",
              isCustom: false,
            },
          ],
          printedOn: "2024-07-01T09:00:00Z",
          expiryDate: "2024-07-01T18:00:00Z",
          labelType: "prep" as const,
        },
        expiry: "2024-07-01T18:00:00Z",
        useInitials: true,
        selectedInitial: "NG",
        allergens: ["Celery"],
        labelHeight: "40mm" as const,
        allIngredients: [
          { uuid: "6", ingredientName: "Carrots", allergens: [] },
          { uuid: "7", ingredientName: "Broccoli", allergens: [] },
          { uuid: "8", ingredientName: "Celery", allergens: [{ allergenName: "Celery" }] },
          { uuid: "9", ingredientName: "Peppers", allergens: [] },
        ],
      },
    },
    {
      label: "Cook Label",
      props: {
        item: {
          uid: "3",
          id: "3",
          type: "menu" as "menu",
          name: "Chicken Curry",
          quantity: 1,
          ingredients: ["Chicken", "Coconut Milk", "Curry Powder", "Onion", "Garlic"],
          allergens: [
            {
              uuid: 1,
              allergenName: "Milk",
              category: "Dairy",
              status: "Active" as const,
              addedAt: "",
              isCustom: false,
            },
            {
              uuid: 2,
              allergenName: "Mustard",
              category: "Spice",
              status: "Active" as const,
              addedAt: "",
              isCustom: false,
            },
          ],
          printedOn: "2024-07-01T10:00:00Z",
          expiryDate: "2024-07-02T10:00:00Z",
          labelType: "cooked" as const,
        },
        expiry: "2024-07-02T10:00:00Z",
        useInitials: true,
        selectedInitial: "BL",
        allergens: ["Milk", "Mustard"],
        labelHeight: "40mm" as const,
        allIngredients: [
          { uuid: "1", ingredientName: "Chicken", allergens: [] },
          { uuid: "2", ingredientName: "Coconut Milk", allergens: [{ allergenName: "Milk" }] },
          { uuid: "3", ingredientName: "Curry Powder", allergens: [{ allergenName: "Mustard" }] },
          { uuid: "4", ingredientName: "Onion", allergens: [] },
          { uuid: "5", ingredientName: "Garlic", allergens: [] },
        ],
      },
    },
  ]

  const ppdsSampleItem = {
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
  const ppdsAllIngredients = [
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
  const ppdsStorageInfo = "Keep refrigerated below 5°C. Consume within 2 days of opening."
  const ppdsBusinessName = "InstaLabel Ltd"

  // For the label grid, create a new array for the 2x2 layout
  const labelGrid = [
    {
      label: "PPDS Label",
      preview: (
        <PPDSLabelRenderer
          item={ppdsSampleItem}
          storageInfo={ppdsStorageInfo}
          businessName={ppdsBusinessName}
          allIngredients={ppdsAllIngredients}
        />
      ),
    },
    ...labelSamples.map((sample) => ({
      label: sample.label,
      preview: <LabelRender {...sample.props} />,
    })),
  ]

  return (
    <section className="relative bg-[#FCFCF7] px-4 py-16 text-foreground sm:px-6 md:px-12 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto flex max-w-6xl flex-col items-center"
      >
        <div className="flex w-full flex-col items-center justify-center gap-10 md:flex-row md:gap-20">
          {/* Left: Text Content */}
          <div className="flex min-w-[320px] flex-1 flex-col items-center justify-center md:pr-8">
            <h1 className="mb-4 text-center text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-left">
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Any Label, Any Device
              </span>
              <span className="block text-gray-900">Professional, Compliant, Easy</span>
            </h1>
            <div className="mb-6 max-w-xl text-center text-lg text-gray-700 md:text-left">
              Print professional kitchen labels (including PPDS and Natasha’s Law) with automatic
              date calculations, allergen warnings, and storage instructions. Works from any
              device—USB printer, Sunmi, or more. Perfect for any kitchen that needs to comply with
              food safety laws—from restaurants to delis to food trucks.
            </div>
            <ol className="mb-8 space-y-2 text-base text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-lg font-bold">①</span>
                <span>Tap a label type</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-lg font-bold">②</span>
                <span>Print instantly on USB/Sunmi</span>
              </li>
            </ol>
          </div>
          {/* Right: Device Image - larger and animated */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-[-32px] flex min-w-[320px] flex-1 items-start justify-center md:mt-0"
          >
            <Image
              src={deviceImg}
              alt="Supported label printers"
              width={380}
              height={270}
              style={{ borderRadius: 0, border: "none" }}
              priority
            />
          </motion.div>
        </div>
        {/* Label Types Row - responsive grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 w-full"
        >
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {labelGrid.slice(1, 4).map((item, i) => (
              <div key={i} className="flex h-full flex-col items-center justify-end">
                <div className="mb-2 text-center text-sm font-semibold text-gray-900 sm:text-base">
                  {item.label}
                </div>
                <div className="flex h-[160px] min-h-[160px] w-full items-center justify-center p-2 sm:h-[180px] sm:min-h-[180px] lg:h-[200px] lg:min-h-[200px]">
                  {item.preview}
                </div>
              </div>
            ))}
            {/* PPDS label preview last, needs more height for content */}
            <div className="flex h-full flex-col items-center justify-end">
              <div className="mb-2 text-center text-sm font-semibold text-gray-900 sm:text-base">
                {labelGrid[0].label}
              </div>
              <div className="flex h-[200px] min-h-[200px] w-full items-center justify-center p-2 sm:h-[220px] sm:min-h-[220px] lg:h-[240px] lg:min-h-[240px]">
                {labelGrid[0].preview}
              </div>
            </div>
          </div>
          {/* CTA Buttons Row - responsive */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:justify-start"
          ></motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default WhatWeDoShowcase
