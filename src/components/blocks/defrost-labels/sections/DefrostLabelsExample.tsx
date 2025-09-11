"use client"

import { motion } from "framer-motion"
import LabelRender from "@/app/dashboard/print/LabelRender"

export const DefrostLabelsExample = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-white via-blue-50 to-cyan-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <div className="mb-2 inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-3 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Example Label
          </div>
          <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
            See Defrost Labels in Action
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
            Here's a real example of a Frozen Cod Fillet defrost label created with InstaLabel.
            Notice the defrost date, expiry date, and allergen information.
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start">
          {/* Left Side - Label Display */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <LabelRender
                item={{
                  uid: "defrost-1",
                  id: "1",
                  type: "ingredients",
                  name: "Frozen Cod Fillet (defrosted)",
                  quantity: 1,
                  ingredients: ["Cod Fillet"],
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
                  printedOn: "2024-07-01T08:00:00Z",
                  expiryDate: "2024-07-02T08:00:00Z",
                  labelType: "prep" as const,
                }}
                expiry="2024-07-02T08:00:00Z"
                useInitials={true}
                selectedInitial="BL"
                allergens={["Fish"]}
                labelHeight="40mm"
                allIngredients={[
                  {
                    uuid: "b1",
                    ingredientName: "Cod Fillet",
                    allergens: [{ allergenName: "Fish" }],
                  },
                ]}
              />
            </motion.div>
            <div className="mt-4 text-center">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1 h-3 w-3"
                >
                  <path d="m7.5 4.27 9 5.15"></path>
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
                  <path d="m3.3 7 8.7 5 8.7-5"></path>
                  <path d="M12 22V12"></path>
                </svg>
                Frozen Cod Fillet Defrost Label
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Example: Frozen Cod Fillet — Defrosted Mon 01 Jul — Use By Tue 02 Jul
              </div>
            </div>
          </div>

          {/* Right Side - Label Analysis */}
          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div>
                <h4 className="mb-4 text-xl font-bold text-gray-900">
                  What Makes This Label Effective
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 h-5 w-5 text-green-500"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                    <div>
                      <h5 className="font-semibold text-gray-900">Clear Product Name</h5>
                      <p className="text-sm text-gray-600">
                        Bold product name makes it easy to identify defrosted items at a glance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 h-5 w-5 text-green-500"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                    <div>
                      <h5 className="font-semibold text-gray-900">Defrost Date</h5>
                      <p className="text-sm text-gray-600">
                        Clear defrost date helps staff identify when food was defrosted for safety
                        tracking
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 h-5 w-5 text-green-500"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                    <div>
                      <h5 className="font-semibold text-gray-900">Expiry Date</h5>
                      <p className="text-sm text-gray-600">
                        Auto-calculated expiry date ensures proper food safety and waste reduction
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 h-5 w-5 text-green-500"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                    <div>
                      <h5 className="font-semibold text-gray-900">Allergen Information</h5>
                      <p className="text-sm text-gray-600">
                        Clear allergen warnings help prevent cross-contamination and ensure customer
                        safety
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-0.5 h-5 w-5 text-green-500"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                    <div>
                      <h5 className="font-semibold text-gray-900">Staff Initials</h5>
                      <p className="text-sm text-gray-600">
                        Staff initials for accountability and traceability in the kitchen
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h5 className="mb-2 font-semibold text-blue-800">HACCP Compliance Checklist ✓</h5>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Clear product identification</li>
                <li>• Defrost date for traceability</li>
                <li>• Expiry date for food safety</li>
                <li>• Allergen information displayed</li>
                <li>• Staff initials for accountability</li>
                <li>• Complete defrost records</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
