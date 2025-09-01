"use client"
import React from "react"
import { motion } from "framer-motion"
import { Monitor, Smartphone, Printer, CheckCircle, Wifi, Usb, ArrowRight } from "lucide-react"

export const PrintingSetup = () => {
  const printingMethods = [
    {
      title: "Web Dashboard Printing",
      subtitle: "For kitchens with existing thermal printers",
      icon: <Monitor className="h-8 w-8 text-blue-600" />,
      features: [
        "Works with any USB thermal printer (Epson TM series, Brother QL series, etc.)",
        "PrintBridge software creates direct connection from browser to printer",
        "Print from Windows or Mac computers",
        "No special drivers or complicated setup required",
        "Silent printing without popups or file downloads",
      ],
      color: "blue",
      step: "01",
    },
    {
      title: "Android Tablet Printing",
      subtitle: "For mobile kitchen setups",
      icon: <Smartphone className="h-8 w-8 text-green-600" />,
      features: [
        "Download InstaLabel app from Google Play Store",
        "Connect any Bluetooth thermal printer to your Android tablet",
        "Print directly from the app without additional software",
        "Perfect for food trucks, catering, or space-limited kitchens",
        "Works offline once labels are created",
      ],
      color: "green",
      step: "02",
    },
  ]

  const labelSpecs = [
    {
      title: "Compatible Label Sizes",
      items: [
        "60mm width for ingredient and prep labels",
        "80mm width for PPDS and detailed information labels",
        "Direct thermal labels (no ink or ribbon required)",
        "Waterproof and grease-resistant options available",
        "Temperature-resistant for freezer and hot environments",
      ],
    },
    {
      title: "Printer Compatibility",
      items: [
        "USB thermal printers for desktop/laptop use",
        "Bluetooth thermal printers for Android devices",
        "No network or WiFi printing required",
        "Works with any TSPL compliant thermal printer",
        "Automatic printer detection and configuration",
      ],
    },
  ]

  return (
    <section className="relative bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            How to Print Your Labels
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            InstaLabel works with the printing equipment you already have. Choose the method that
            fits your kitchen setup.
          </p>
        </motion.div>

        {/* Printing Methods - Step-by-Step Flow */}
        <div className="relative mb-20">
          {/* Connection Line */}
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-0.5 -translate-x-1/2 transform bg-gradient-to-b from-blue-200 via-purple-200 to-green-200 lg:block" />

          <div className="space-y-12">
            {printingMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Step Number */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-full bg-${method.color}-600 text-lg font-bold text-white shadow-lg`}
                  >
                    {method.step}
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1">
                  <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md">
                    <div className="mb-6 flex items-center gap-4">
                      <div className={`rounded-xl bg-${method.color}-100 p-3`}>{method.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{method.title}</h3>
                        <p className="text-gray-600">{method.subtitle}</p>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {method.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: idx * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Arrow for Flow */}
                {index < printingMethods.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="hidden lg:block"
                  >
                    <ArrowRight className="h-8 w-8 text-purple-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Label Specifications - Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <Printer className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Label Specifications</h3>
            <p className="text-gray-600">
              Everything you need to know about compatible labels and printers
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {labelSpecs.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-gray-100 bg-gray-50 p-6"
              >
                <h4 className="mb-4 text-lg font-semibold text-gray-900">{spec.title}</h4>
                <ul className="space-y-2">
                  {spec.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
