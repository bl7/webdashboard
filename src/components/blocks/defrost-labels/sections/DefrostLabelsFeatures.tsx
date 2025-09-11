"use client"

import { motion } from "framer-motion"

export const DefrostLabelsFeatures = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
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
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
            </svg>
            Features
          </div>
          <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need for HACCP-Compliant Defrost Labels
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
            InstaLabel's defrost labeling system provides all the tools you need to track frozen
            food safety, comply with HACCP regulations, and ensure proper defrost management.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
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
                  className="h-7 w-7 text-blue-600"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900">Defrost Start/End Times</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Every defrost label automatically includes the defrost start and end times, ensuring
              complete traceability and HACCP compliance.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Automatic timestamping</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>HACCP compliance</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Complete traceability</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>No manual entry errors</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
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
                  className="h-7 w-7 text-red-600"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                  <path d="M12 9v4"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900">Allergen Summary</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Clear allergen information prominently displayed to prevent cross-contamination and
              ensure customer safety.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Allergen highlighting</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Clear allergen summary</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Safety compliance</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Easy identification</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
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
                  className="h-7 w-7 text-green-600"
                >
                  <path d="M8 2v4"></path>
                  <path d="M16 2v4"></path>
                  <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                  <path d="M3 10h18"></path>
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900">Expiry Date Auto-Calculated</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Every defrost label automatically calculates the correct expiry date based on defrost
              time and food safety rules.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Automatic calculation</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>HACCP compliance</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Food safety rules</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>No manual errors</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
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
                  className="h-7 w-7 text-purple-600"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900">Staff Initials</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Staff initials are included on every defrost label for accountability and traceability
              in the kitchen.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Staff initials tracking</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Accountability system</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Kitchen traceability</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Clear identification</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-8">
            <h4 className="mb-6 text-center text-xl font-bold text-gray-900">
              Simple 3-Step Process
            </h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  1
                </div>
                <h5 className="font-semibold text-gray-900">Select Frozen Item</h5>
                <p className="text-sm text-gray-600">Choose from your frozen food database</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  2
                </div>
                <h5 className="font-semibold text-gray-900">Record Defrost Time</h5>
                <p className="text-sm text-gray-600">Enter defrost start & end times</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                  3
                </div>
                <h5 className="font-semibold text-gray-900">Print & Apply</h5>
                <p className="text-sm text-gray-600">Print label and apply to defrosted food</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
