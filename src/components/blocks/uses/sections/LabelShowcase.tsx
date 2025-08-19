"use client"

import React from "react"
import { motion } from "framer-motion"
import LabelRender from "@/app/dashboard/print/LabelRender"

export const LabelShowcase = () => {
  // Defrost label sample data
  const defrostSampleItem = {
    uid: "defrost-1",
    id: "defrost-1",
    type: "menu" as const,
    name: "Frozen Cod Fillet",
    quantity: 1,
    ingredients: ["Cod Fillet", "Water", "Salt"],
    allergens: [
      {
        uuid: 6,
        allergenName: "Fish",
        category: "Seafood",
        status: "Active" as const,
        addedAt: "",
        isCustom: false,
      },
    ],
    printedOn: "2024-07-01T12:00:00Z",
    expiryDate: "2024-07-02T12:00:00Z",
    labelType: "prep" as const,
  }
  const defrostAllIngredients = [
    { uuid: "b1", ingredientName: "Cod Fillet", allergens: [{ allergenName: "Fish" }] },
    { uuid: "b2", ingredientName: "Water", allergens: [] },
    { uuid: "b3", ingredientName: "Salt", allergens: [] },
  ]

  return (
    <section className="relative px-2 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-2">
          {/* Left: Labels Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Labels Grid */}
            <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2">
              {/* Ingredient Label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="group transform cursor-pointer transition-all duration-300 hover:rotate-1 hover:scale-110"
              >
                <div className="relative">
                  <LabelRender
                    item={{
                      uid: "1",
                      id: "1",
                      type: "ingredients",
                      name: "Fresh Basil",
                      quantity: 1,
                      allergens: [],
                      printedOn: "2024-07-01T08:00:00Z",
                      expiryDate: "2024-07-05T08:00:00Z",
                    }}
                    expiry="2024-07-05T08:00:00Z"
                    useInitials={true}
                    selectedInitial="BR"
                    allergens={[]}
                    labelHeight="40mm"
                    allIngredients={[]}
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs font-medium text-gray-600 transition-colors group-hover:text-blue-600">
                    Ingredient Label
                  </span>
                </div>
              </motion.div>

              {/* Prep Label (restored) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="group transform cursor-pointer transition-all duration-300 hover:-rotate-1 hover:scale-110"
              >
                <div className="relative">
                  <LabelRender
                    item={{
                      uid: "2",
                      id: "2",
                      type: "menu",
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
                      labelType: "prep",
                    }}
                    expiry="2024-07-01T18:00:00Z"
                    useInitials={true}
                    selectedInitial="NG"
                    allergens={["Celery"]}
                    labelHeight="40mm"
                    allIngredients={[
                      { uuid: "6", ingredientName: "Carrots", allergens: [] },
                      { uuid: "7", ingredientName: "Broccoli", allergens: [] },
                      {
                        uuid: "8",
                        ingredientName: "Celery",
                        allergens: [{ allergenName: "Celery" }],
                      },
                      { uuid: "9", ingredientName: "Peppers", allergens: [] },
                    ]}
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs font-medium text-gray-600 transition-colors group-hover:text-green-600">
                    Prep Label
                  </span>
                </div>
              </motion.div>

              {/* Cook Label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="group transform cursor-pointer transition-all duration-300 hover:rotate-1 hover:scale-110"
              >
                <div className="relative">
                  <LabelRender
                    item={{
                      uid: "3",
                      id: "3",
                      type: "menu",
                      name: "Chicken Curry",
                      quantity: 1,
                      ingredients: ["Chicken", "Coconut Milk", "Curry Powder", "Onion", "Garlic"],
                      allergens: [
                        {
                          uuid: 1,
                          allergenName: "Milk",
                          category: "Dairy",
                          status: "Active",
                          addedAt: "",
                          isCustom: false,
                        },
                        {
                          uuid: 2,
                          allergenName: "Mustard",
                          category: "Spice",
                          status: "Active",
                          addedAt: "",
                          isCustom: false,
                        },
                      ],
                      printedOn: "2024-07-01T10:00:00Z",
                      expiryDate: "2024-07-02T10:00:00Z",
                      labelType: "cooked",
                    }}
                    expiry="2024-07-02T10:00:00Z"
                    useInitials={true}
                    selectedInitial="BL"
                    allergens={["Milk", "Mustard"]}
                    labelHeight="40mm"
                    allIngredients={[
                      { uuid: "1", ingredientName: "Chicken", allergens: [] },
                      {
                        uuid: "2",
                        ingredientName: "Coconut Milk",
                        allergens: [{ allergenName: "Milk" }],
                      },
                      {
                        uuid: "3",
                        ingredientName: "Curry Powder",
                        allergens: [{ allergenName: "Mustard" }],
                      },
                      { uuid: "4", ingredientName: "Onion", allergens: [] },
                      { uuid: "5", ingredientName: "Garlic", allergens: [] },
                    ]}
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs font-medium text-gray-600 transition-colors group-hover:text-orange-600">
                    Cook Label
                  </span>
                </div>
              </motion.div>

              {/* Defrost Label (replaces PPDS) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="group transform cursor-pointer transition-all duration-300 hover:-rotate-1 hover:scale-110"
              >
                <div className="relative">
                  <LabelRender
                    item={defrostSampleItem}
                    expiry={defrostSampleItem.expiryDate}
                    useInitials={true}
                    selectedInitial="DF"
                    allergens={["Fish"]}
                    labelHeight="40mm"
                    allIngredients={defrostAllIngredients}
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-xs font-medium text-gray-600 transition-colors group-hover:text-cyan-600">
                    Defrost Label
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Technical Specs - Moved here */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-center text-xl font-bold text-gray-900">
                Label Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-purple-600">40/80mm</div>
                  <div className="text-xs text-gray-600">Label Height</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-purple-600">Thermal</div>
                  <div className="text-xs text-gray-600">Printer Type</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-purple-600">HACCP</div>
                  <div className="text-xs text-gray-600">Compliant</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-xs text-gray-600">Printing</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="grid gap-4">
              <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-purple-200 hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors duration-200 group-hover:bg-blue-100">
                    <span className="text-lg">📦</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Ingredient Labels</h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Simple, clean labels for individual ingredients. Perfect for storage
                      containers and prep stations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Prep Labels description (restored) */}
              <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-green-200 hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 transition-colors duration-200 group-hover:bg-green-100">
                    <span className="text-lg">🥬</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Prep Labels</h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Detailed labels showing ingredients, allergens, prep times, and expiry dates
                      for prepared items.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-purple-200 hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 transition-colors duration-200 group-hover:bg-orange-100">
                    <span className="text-lg">🍳</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Cook Labels</h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Hot food labels with cook times, temperatures, and allergen information for
                      service.
                    </p>
                  </div>
                </div>
              </div>

              {/* Defrost Labels description (replaces PPDS) */}
              <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-cyan-200 hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 transition-colors duration-200 group-hover:bg-cyan-100">
                    <span className="text-lg">❄️</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">Defrost Labels</h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      Track defrost dates, times, and staff for frozen foods. Ensure food safety and
                      compliance with clear, automated defrost labeling.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
