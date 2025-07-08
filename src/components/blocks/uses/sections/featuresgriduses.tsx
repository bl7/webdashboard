"use client"

// components/RealWorldSection.tsx
import Image from "next/image"
import { motion } from "framer-motion"

export const FeaturesGridUses = () => {
  return (
    <section className="relative bg-white px-4 sm:px-6 py-12 sm:py-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative mx-auto max-w-7xl space-y-16 sm:space-y-20">
        {/* Benefits Section */}
        <div className="space-y-8">
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Enterprise-Ready Labelling for Modern Kitchens
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Go beyond basic printing with tools built for speed, traceability, and food safety compliance.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                icon: (
                  <span className="text-2xl">⚡</span>
                ),
                title: "Instant Label Generation",
                description: "Print prep, cook, PPDS, use-first, defrost, and custom labels in seconds — no popups, no file downloads, just click and print."
              },
              {
                icon: (
                  <span className="text-2xl">📊</span>
                ),
                title: "Label Usage Analytics",
                description: "Track who printed what, when, and how much. Monitor staff activity, weekly/monthly label usage, and keep an eye on label stock levels."
              },
              {
                icon: (
                  <span className="text-2xl">🧠</span>
                ),
                title: "Allergen Intelligence",
                description: "Highlight allergens automatically from your ingredient data — fully supports Natasha’s Law and reduces costly mistakes."
              },
              {
                icon: (
                  <span className="text-2xl">🗃️</span>
                ),
                title: "Label History & Logs",
                description: "Every label is recorded — when it was printed, by whom, and for what item. Essential for audits and internal tracking."
              },
              {
                icon: (
                  <span className="text-2xl">🖨️</span>
                ),
                title: "Universal Printer Support",
                description: "Works out of the box with any USB label printer or Sunmi device — no locked-in hardware or special drivers required."
              },
              {
                icon: (
                  <span className="text-2xl">🧾</span>
                ),
                title: "Flexible Expiry Handling",
                description: "Automatically calculate expiry dates from prep/cook time — or override them manually when needed, giving your team full control."
              }
            ].map((benefit, index) => (
              <motion.div 
                key={index} 
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-white border border-gray-200 rounded-lg p-6 h-full hover:border-purple-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                      {benefit.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Integration Section */}
        <div className="space-y-12">
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Built for Frictionless Printing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              No clunky drivers. No popups. Just click and print — exactly how kitchen tech should feel.
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Local Print Bridge for USB Printers",
                  description: "Our lightweight server connects your browser directly to any USB label printer. No drivers, no dialogs — just fast, reliable printing.",
                  icon: <span className="text-3xl">🔗</span>
                },
                {
                  step: "02",
                  title: "Native Sunmi App Support",
                  description: "Using a Sunmi handheld? You're already set. InstaLabel prints directly from the browser — no bridge, no setup required.",
                  icon: <span className="text-3xl">📱</span>
                },
                {
                  step: "03",
                  title: "Cross-Platform Simplicity",
                  description: "Whether you're using Windows or Mac, InstaLabel works with the printers you already have. Set it up once and print labels from any modern browser or Sunmi device.",
                  icon: <span className="text-3xl">💻</span>
                }
              ].map((step, index) => (
                <motion.div 
                  key={index} 
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center hover:border-purple-200 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
                    {/* Step number */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full font-bold text-lg mb-6">
                      {step.step}
                    </div>
                    {/* Icon */}
                    <div className="flex justify-center mb-4 text-gray-600">
                      {step.icon}
                    </div>
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}