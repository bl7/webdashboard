"use client"
import React from "react"
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/PPDSLabelRenderer"
import { motion } from "framer-motion"
import { CheckCircle, Eye } from "lucide-react"

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

export const NatashasLawExampleLabel = () => (
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
          Example PPDS Label
        </div>
        <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
          See InstaLabel PPDS Labels in Action
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
          Here's a real example of a fully compliant PPDS label created with InstaLabel. Notice how
          allergens are automatically highlighted and all required information is included.
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
          {/* 60mm x 80mm at 96dpi: 60mm = ~227px, 80mm = ~303px */}
          <div
            style={{
              width: 227,
              height: 303,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <PPDSLabelRenderer
              item={sampleItem}
              storageInfo={storageInfo}
              businessName={businessName}
              allIngredients={allIngredients}
            />
          </div>
          <div className="mt-4 text-center">
            <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Fully Compliant PPDS Label
            </div>
            <div className="mt-2 text-xs text-gray-500">Example: Chicken Caesar Salad (PPDS)</div>
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
              What Makes This Label Compliant
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <h5 className="font-semibold text-gray-900">Complete Ingredient List</h5>
                  <p className="text-sm text-gray-600">
                    All ingredients are listed in descending order of weight
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <h5 className="font-semibold text-gray-900">Allergen Highlighting</h5>
                  <p className="text-sm text-gray-600">
                    Allergens are clearly highlighted in red for maximum visibility
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <h5 className="font-semibold text-gray-900">Storage Instructions</h5>
                  <p className="text-sm text-gray-600">
                    Clear storage and handling instructions included
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <h5 className="font-semibold text-gray-900">Business Information</h5>
                  <p className="text-sm text-gray-600">
                    Business name and traceability information included
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <h5 className="font-semibold text-gray-900">Best Before Date</h5>
                  <p className="text-sm text-gray-600">
                    Clear expiry date for food safety compliance
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h5 className="mb-2 font-semibold text-purple-800">FSA Compliance Checklist ✓</h5>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>• Full ingredient list with allergens highlighted</li>
              <li>• Storage and handling instructions</li>
              <li>• Business name and contact details</li>
              <li>• Best before date clearly marked</li>
              <li>• 80mm thermal printer format</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)
