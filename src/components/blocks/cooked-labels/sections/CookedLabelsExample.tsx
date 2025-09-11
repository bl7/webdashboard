"use client"

import React from "react"
import { motion } from "framer-motion"
import { CheckCircle, Eye, Package } from "lucide-react"
import LabelRender from "@/app/dashboard/print/LabelRender"

export const CookedLabelsExample = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-white via-purple-50 to-pink-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="mb-2 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200">
            <Eye className="mr-2 h-4 w-4" />
            Example Label
          </div>
          <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
            See Cook Labels in Action
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
            Here's a real example of a Chicken Curry cook label created with InstaLabel. Notice the
            cooking date, allergen information, and temperature tracking.
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start">
          {/* Label Visual */}
          <motion.div
            className="flex flex-1 flex-col items-center justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Real Cook Label Renderer */}
            <div className="relative">
              <LabelRender
                item={{
                  uid: "demo-cook-1",
                  id: "1",
                  type: "menu",
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

            <div className="mt-4 text-center">
              <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                <Package className="mr-1 h-3 w-3" />
                Chicken Curry Cook Label
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Example: Cooked: 01 Jul — Chicken Curry — Contains: Milk, Mustard
              </div>
            </div>
          </motion.div>

          {/* Label Features */}
          <motion.div
            className="flex-1 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div>
              <h4 className="mb-4 text-xl font-bold text-gray-900">
                What Makes This Label Effective
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Clear Product Name</h5>
                    <p className="text-sm text-gray-600">
                      Bold product name makes it easy to identify cooked dishes at a glance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Cooking Date</h5>
                    <p className="text-sm text-gray-600">
                      Clear cooking date helps staff identify when food was prepared for freshness
                      tracking
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Allergen Information</h5>
                    <p className="text-sm text-gray-600">
                      Clear allergen warnings help prevent cross-contamination and ensure customer
                      safety
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Staff Initials</h5>
                    <p className="text-sm text-gray-600">
                      Staff initials for accountability and traceability in the kitchen
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                  <div>
                    <h5 className="font-semibold text-gray-900">HACCP Compliance</h5>
                    <p className="text-sm text-gray-600">
                      Complete cooking records ensure compliance with food safety regulations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <h5 className="mb-2 font-semibold text-orange-800">HACCP Compliance Checklist ✓</h5>
              <ul className="space-y-1 text-sm text-orange-700">
                <li>• Clear product identification</li>
                <li>• Cooking date for traceability</li>
                <li>• Allergen information displayed</li>
                <li>• Staff initials for accountability</li>
                <li>• Complete cooking records</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
