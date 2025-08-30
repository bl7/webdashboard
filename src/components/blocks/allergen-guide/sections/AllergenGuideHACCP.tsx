"use client"

import { Shield, FileText, AlertTriangle, CheckCircle2, Zap } from "lucide-react"
import React from "react"
import { motion } from "framer-motion"

export const AllergenGuideHACCP = () => {
  return (
    <section id="haccp-labelling" className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h3 className="mb-4 font-accent text-3xl font-bold text-gray-900 sm:text-4xl">
            Allergen Labelling & HACCP in Practice
          </h3>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Understanding how proper allergen management fits into your food safety system
          </p>
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left side - HACCP Explanation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">What is HACCP?</h3>
              </div>
              <p className="mb-4 text-gray-700">
                <strong>HACCP</strong> (Hazard Analysis and Critical Control Points) is a systematic
                approach to food safety that identifies, evaluates, and controls hazards throughout
                the food production process.
              </p>
              <p className="text-gray-700">
                For allergens, this means identifying where cross-contamination can occur and
                implementing controls to prevent it.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Why HACCP Matters for Allergens:
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <span className="font-medium text-gray-900">Legal Compliance:</span>
                    <span className="text-gray-700">
                      {" "}
                      Required by UK food law and enforced by EHO inspections
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <span className="font-medium text-gray-900">Customer Safety:</span>
                    <span className="text-gray-700">
                      {" "}
                      Prevents allergic reactions and protects vulnerable customers
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <span className="font-medium text-gray-900">Business Protection:</span>
                    <span className="text-gray-700">
                      {" "}
                      Reduces risk of fines, legal action, and reputational damage
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Labelling in Practice */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <FileText className="h-6 w-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">How Labels Fit Into Compliance</h3>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-2 font-semibold text-gray-900">Critical Control Points:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Ingredient declaration on all food items</li>
                    <li>• Clear allergen highlighting on menus</li>
                    <li>• Staff training on allergen awareness</li>
                    <li>• Cross-contamination prevention procedures</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-purple-800">
                      InstaLabel Simplifies This
                    </span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Create compliant allergen labels in seconds with our automated system. No more
                    manual errors or missing information.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-6">
              <div className="mb-3 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Key Statistic</h4>
              </div>
              <p className="text-sm text-green-700">
                <strong>Food allergies affect 2 million people in the UK.</strong>
                Proper allergen labelling isn't just good practice—it's essential for protecting
                your customers.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
