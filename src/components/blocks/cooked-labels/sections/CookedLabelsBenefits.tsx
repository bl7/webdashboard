"use client"

import React from "react"
import { motion } from "framer-motion"
import { CheckCircle, Shield, Clock, Users, TrendingUp, Award } from "lucide-react"

export const CookedLabelsBenefits = () => {
  return (
    <section className="relative w-full bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <div className="mb-2 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200">
            <Award className="mr-2 h-4 w-4" />
            Benefits
          </div>
          <h3 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Why Cook Labels Transform Your Kitchen
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-gray-600">
            From HACCP compliance to faster service, discover how cook labels improve food safety
            and kitchen efficiency.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <Shield className="h-7 w-7 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Simplify HACCP Compliance</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Automated cook labels ensure complete temperature tracking, cooking records, and
              allergen information for full HACCP compliance.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Complete cooking records</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Temperature tracking</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Allergen compliance</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Audit-ready documentation</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <Clock className="h-7 w-7 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">
                Faster Service with Pre-Labelled Food
              </h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Pre-labelled hot food containers speed up service, reduce errors, and improve customer
              satisfaction during busy periods.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Faster food service</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Reduced service errors</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Better customer experience</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Streamlined operations</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <Shield className="h-7 w-7 text-red-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Reduce Food Safety Risks</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Complete cooking documentation and temperature tracking minimize food safety risks and
              protect your customers.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Temperature monitoring</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Allergen safety</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Traceability system</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Risk reduction</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-shrink-0">
                <Users className="h-7 w-7 text-purple-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Staff Accountability & Training</h4>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Staff initials and batch tracking create accountability while clear labels improve
              training and reduce errors.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Staff accountability</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Easier training</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Reduced errors</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Better handovers</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-8">
            <h4 className="mb-6 text-center text-xl font-bold text-gray-900">Cook Label Impact</h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-orange-600">95%</div>
                <div className="text-sm text-gray-600">HACCP Compliance Rate</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-orange-600">60%</div>
                <div className="text-sm text-gray-600">Faster Service Time</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-orange-600">80%</div>
                <div className="text-sm text-gray-600">Reduced Food Safety Issues</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-8">
            <h4 className="mb-6 text-center text-xl font-bold text-gray-900">
              Additional Benefits
            </h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-1 h-5 w-5 text-purple-600" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Improved Kitchen Efficiency</h5>
                    <p className="text-sm text-gray-600">
                      Streamlined cooking processes and reduced manual record-keeping
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="mt-1 h-5 w-5 text-purple-600" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Professional Standards</h5>
                    <p className="text-sm text-gray-600">
                      Consistent, professional labeling that impresses inspectors and customers
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="mt-1 h-5 w-5 text-purple-600" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Regulatory Compliance</h5>
                    <p className="text-sm text-gray-600">
                      Meet all food safety regulations and pass inspections with confidence
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 text-purple-600" />
                  <div>
                    <h5 className="font-semibold text-gray-900">Time Savings</h5>
                    <p className="text-sm text-gray-600">
                      Eliminate manual logging and reduce administrative overhead
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
