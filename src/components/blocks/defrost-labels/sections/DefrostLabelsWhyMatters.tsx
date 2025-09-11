"use client"

import { motion } from "framer-motion"

export const DefrostLabelsWhyMatters = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-white via-blue-50 to-cyan-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 md:flex-row">
        {/* Left Side - Problem Visual */}
        <div className="mx-auto w-full max-w-md flex-1">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-lg"
          >
            <div className="mb-4 flex items-center gap-2">
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
                className="h-5 w-5 text-red-500"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <path d="M12 9v4"></path>
                <path d="M12 17h.01"></path>
              </svg>
              <span className="text-sm font-semibold text-gray-700">Handwritten Freezer Logs</span>
            </div>
            <div className="space-y-3">
              <div className="rounded border border-gray-300 bg-white p-3">
                <div className="text-sm font-semibold text-gray-800">Frozen Cod Fillet</div>
                <div className="mt-1 text-xs text-gray-600">Defrosted: ??? (illegible)</div>
                <div className="mt-2 text-xs text-red-600">⚠️ No expiry date</div>
              </div>
              <div className="rounded border border-gray-300 bg-white p-3">
                <div className="text-sm font-semibold text-gray-800">Frozen Chicken</div>
                <div className="mt-1 text-xs text-gray-600">Defrosted: ??? (illegible)</div>
                <div className="mt-2 text-xs text-red-600">⚠️ No staff initials</div>
              </div>
              <div className="text-xs text-gray-500">
                <div>❌ Incomplete records</div>
                <div>❌ No defrost tracking</div>
                <div>❌ HACCP violations</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 space-y-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="mb-1 inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200">
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
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <path d="M12 9v4"></path>
                <path d="M12 17h.01"></path>
              </svg>
              Why Defrost Labels
            </div>
            <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
              Frozen → Fridge Transitions Are a Compliance Hotspot. Wrong Dates = Serious Risks.
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
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
                    className="mt-0.5 h-5 w-5 text-red-600"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                  <div>
                    <h4 className="font-semibold text-red-800">
                      Handwritten Logs Create HACCP Violations
                    </h4>
                    <p className="mt-1 text-sm text-red-700">
                      Incomplete defrost records, missing expiry dates, and illegible handwriting
                      lead to food safety violations and potential health risks.
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 text-sm text-gray-700">
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
                    className="h-4 w-4 text-purple-600"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Missing defrost times</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
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
                    className="h-4 w-4 text-purple-600"
                  >
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                  </svg>
                  <span>No expiry dates</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
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
                    className="h-4 w-4 text-purple-600"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                    <path d="M10 9H8"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                  </svg>
                  <span>Incomplete logs</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
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
                    className="h-4 w-4 text-purple-600"
                  >
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                  <span>HACCP violations</span>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="text-sm font-semibold text-purple-800">
                <span className="font-bold text-purple-700">The Solution:</span> Automated defrost
                labels with date tracking, expiry dates, and allergen information ensure HACCP
                compliance and food safety.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
