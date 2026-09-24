"use client"
import React from "react"
import { motion } from "framer-motion"

export const TestedInKitchens = () => {
  return (
    <section className="relative bg-white px-4 py-12 sm:px-6 sm:py-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative mx-auto max-w-7xl space-y-16 sm:space-y-20">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-4 text-center"
        >
          <div className="inline-flex items-center rounded-full bg-mkt-canvas px-4 py-2 text-sm font-medium text-mkt-ink ring-1 ring-mkt-steel1">
            <span className="mr-2">🧪</span>
            Kitchen Tested & Chef Approved
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built in Kitchens, for Kitchens
          </h3>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
            InstaLabel was shaped on the ground — inside real prep stations, walk-ins, and catering
            fridges. Every feature was refined with real chef feedback to make label printing
            faster, simpler, and compliant.
          </p>
        </motion.div>

        {/* Enhanced Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Feature 1 */}
          <div className="group">
            <div className="h-full rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-mkt-steel1 hover:shadow-md">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-mkt-canvas text-mkt-teal transition-colors duration-200 group-hover:bg-mkt-canvas">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Up and Running in Minutes
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    From laptop to labels in under 10 minutes. No installations. No training
                    sessions. Just plug in and start printing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group">
            <div className="h-full rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-mkt-steel1 hover:shadow-md">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-mkt-canvas text-mkt-teal transition-colors duration-200 group-hover:bg-mkt-canvas">
                  <span className="text-2xl">👨‍🍳</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Built with Chef Feedback
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Every workflow was stress-tested during real prep shifts. Fewer taps. Faster
                    output. Designed by chefs who get it.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group">
            <div className="h-full rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-mkt-steel1 hover:shadow-md">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-mkt-canvas text-mkt-teal transition-colors duration-200 group-hover:bg-mkt-canvas">
                  <span className="text-2xl">🔒</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Built around kitchen labelling
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    Designed to support consistent prep, cook, defrost and PPDS labelling. Your
                    team still checks recipes, supplier information and finished labels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats or Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mx-auto grid max-w-4xl grid-cols-2 gap-8 text-center sm:grid-cols-4"
        >
          <div className="space-y-2">
            <div className="text-3xl font-bold text-mkt-teal sm:text-4xl">Real</div>
            <div className="text-sm font-medium uppercase tracking-wider text-gray-600">
              Kitchens
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-mkt-teal sm:text-4xl">2</div>
            <div className="text-sm font-medium uppercase tracking-wider text-gray-600">
              Label sizes
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-mkt-teal sm:text-4xl">PPDS</div>
            <div className="text-sm font-medium uppercase tracking-wider text-gray-600">
              Label support
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-mkt-teal sm:text-4xl">14</div>
            <div className="text-sm font-medium uppercase tracking-wider text-gray-600">
              Day trial
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
