"use client"

// components/RealWorldSection.tsx
import Image from "next/image"
import { motion } from "framer-motion"

export const FeaturesGridUses = () => {
  return (
    <section className="relative bg-white px-4 py-12 sm:px-6 sm:py-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative mx-auto max-w-7xl space-y-16 sm:space-y-20">
        {/* Benefits Section */}
        <div className="space-y-8">
          <motion.div
            className="space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Enterprise-Ready Labelling for Modern Kitchens
            </h3>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Go beyond basic printing with tools built for speed, traceability, and food safety
              compliance.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <span className="text-2xl">⚡</span>,
                title: "Instant Label Generation",
                description:
                  "Print prep, cook, PPDS, use-first, defrost, and custom labels in seconds — no popups, no file downloads, just click and print.",
              },
              {
                icon: <span className="text-2xl">📊</span>,
                title: "Label Usage Analytics",
                description:
                  "Track who printed what, when, and how much. Monitor staff activity, weekly/monthly label usage, and keep an eye on label stock levels.",
              },
              {
                icon: <span className="text-2xl">🧠</span>,
                title: "Allergen Intelligence",
                description:
                  "Highlight allergens automatically from your ingredient data — fully supports Natasha’s Law and reduces costly mistakes.",
              },
              {
                icon: <span className="text-2xl">🗃️</span>,
                title: "Label History & Logs",
                description:
                  "Every label is recorded — when it was printed, by whom, and for what item. Essential for audits and internal tracking.",
              },
              {
                icon: <span className="text-2xl">🖨️</span>,
                title: "Universal Printer Support",
                description:
                  "Works out of the box with any USB label printer or Sunmi device — no locked-in hardware or special drivers required.",
              },
              {
                icon: <span className="text-2xl">🧾</span>,
                title: "Flexible Expiry Handling",
                description:
                  "Automatically calculate expiry dates from prep/cook time — or override them manually when needed, giving your team full control.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="h-full rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-purple-200 hover:shadow-md">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors duration-200 group-hover:bg-purple-100">
                      {benefit.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-600">{benefit.description}</p>
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
            className="space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built for Frictionless Printing
            </h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              No clunky drivers. No popups. Just click and print — exactly how kitchen tech should
              feel.
            </p>
          </motion.div>

          <div className="relative mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Local Print Bridge for USB Printers",
                  description:
                    "Our lightweight server connects your browser directly to any USB label printer. No drivers, no dialogs — just fast, reliable printing.",
                  icon: <span className="text-3xl">🔗</span>,
                },
                {
                  step: "02",
                  title: "Native Android App Support",
                  description:
                    "Using a tablet for your restaurant? You're already set. InstaLabel prints directly from your android device — no setup required, just connect your printer via bluetooth.",
                  icon: <span className="text-3xl">📱</span>,
                },
                {
                  step: "03",
                  title: "Cross-Platform Simplicity",
                  description:
                    "Whether you're using Windows or Mac, InstaLabel works with the printers you already have. Set it up once and print labels from any modern browser or Android device.",
                  icon: <span className="text-3xl">💻</span>,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-8 text-center transition-all duration-200 hover:border-purple-200 hover:shadow-lg">
                    {/* Step number */}
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-lg font-bold text-white">
                      {step.step}
                    </div>
                    {/* Icon */}
                    <div className="mb-4 flex justify-center text-gray-600">{step.icon}</div>
                    {/* Content */}
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-base leading-relaxed text-gray-600">{step.description}</p>
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
