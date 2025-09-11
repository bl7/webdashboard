"use client"
import React from "react"
import { motion } from "framer-motion"
import { CheckCircle, Eye, Package } from "lucide-react"
import LabelRender from "@/app/dashboard/print/LabelRender"

export const IngredientLabelsExample = () => (
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
          See Ingredient Labels in Action
        </h3>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
          Here's a real example of a Fresh Basil ingredient label created with InstaLabel. Notice
          the clear expiry date, printed date, and staff initials.
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
          {/* Real Ingredient Label Renderer */}
          <div className="relative">
            <LabelRender
              item={{
                uid: "demo-ingredient-1",
                id: "1",
                type: "ingredients",
                name: "Fresh Basil",
                quantity: 1,
                allergens: [],
                printedOn: "2024-12-12T08:00:00Z",
                expiryDate: "2024-12-15T08:00:00Z",
              }}
              expiry="2024-12-15T08:00:00Z"
              useInitials={true}
              selectedInitial="BL"
              allergens={[]}
              labelHeight="40mm"
              allIngredients={[]}
            />
          </div>

          <div className="mt-4 text-center">
            <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              <Package className="mr-1 h-3 w-3" />
              Fresh Basil Ingredient Label
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Example: Fresh Basil with expiry + printed date
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
                    Bold product name makes it easy to identify ingredients at a glance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <h5 className="font-semibold text-gray-900">Use By Date</h5>
                  <p className="text-sm text-gray-600">
                    Clear expiry date helps staff identify when ingredients are no longer safe to
                    use
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
                  <h5 className="font-semibold text-gray-900">40mm Format</h5>
                  <p className="text-sm text-gray-600">
                    Perfect size for small storage containers, spice jars, and prep stations
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <h5 className="font-semibold text-gray-900">Clean Design</h5>
                  <p className="text-sm text-gray-600">
                    Simple, uncluttered layout that's easy to read and understand quickly
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h5 className="mb-2 font-semibold text-purple-800">Kitchen Organization Checklist ✓</h5>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>• Clear product identification</li>
              <li>• Use by date for food safety</li>
              <li>• Staff initials for accountability</li>
              <li>• 40mm format for small containers</li>
              <li>• Clean, readable design</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)
