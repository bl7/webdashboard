"use client"
import React from "react"
import { motion } from "framer-motion"
import {
  Shield,
  Zap,
  Database,
  Printer,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Wifi,
  Bluetooth,
  Usb,
} from "lucide-react"
import Link from "next/link"

export const EnhancedSquareIntegration = () => {
  const integrationSteps = [
    {
      step: "Step 1: Secure Authentication",
      icon: <Shield className="h-6 w-6 text-green-600" />,
      title: "Click 'Connect Square' in your InstaLabel dashboard",
      details: [
        "Authorize connection using Square's official OAuth system",
        "No passwords stored - uses secure token authentication",
        "Connection verified and tested automatically",
        "Setup time: Under 5 minutes with guided wizard",
      ],
    },
    {
      step: "Step 2: Menu Analysis & Import",
      icon: <Database className="h-6 w-6 text-blue-600" />,
      title: "AI scans your Square menu items and modifier descriptions",
      details: [
        "Automatically identifies ingredients from item descriptions",
        "Detects allergens using pattern recognition algorithms",
        "Creates ingredient database ready for label printing",
        "Maximum items: 10,000 per Square location",
      ],
    },
    {
      step: "Step 3: Ongoing Synchronization",
      icon: <Zap className="h-6 w-6 text-purple-600" />,
      title: "Choose real-time sync or scheduled updates (daily/weekly)",
      details: [
        "Safe create-only mode prevents overwriting existing Square data",
        "New menu items automatically available for labeling",
        "Menu changes reflected in InstaLabel within minutes",
        "Data mapping: Items, variations, modifiers, and categories",
      ],
    },
  ]

  const printerCompatibility = [
    {
      type: "USB Thermal Printers",
      icon: <Usb className="h-6 w-6 text-blue-600" />,
      requirement: "PrintBridge Required",
      printers: [
        "Epson TM series: TM-T20, TM-T82, TM-T88 ✓",
        "Brother QL series: QL-800, QL-820NWB, QL-1110NWB ✓",
        "Zebra desktop: ZD220, ZD420, ZD888 ✓",
        "Generic ESC/POS compatible printers ✓",
      ],
    },
    {
      type: "Bluetooth Printers",
      icon: <Bluetooth className="h-6 w-6 text-green-600" />,
      requirement: "Android App",
      printers: [
        "Any Bluetooth 4.0+ thermal printer ✓",
        "Connection range: 10 meters typical",
        "Offline printing queue: Up to 50 labels",
        "Pairing time: Under 30 seconds",
      ],
    },
  ]

  return (
    <section className="relative bg-gradient-to-br from-white via-blue-50/30 to-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-3 inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-200">
            <Database className="mr-2 h-4 w-4 text-blue-600" />
            Square POS Integration
          </div>
          <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Seamless Square POS Integration
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            Connect your Square POS in minutes and start printing compliant labels automatically. No
            manual data entry required.
          </p>
        </motion.div>

        {/* Integration Process - Simplified Steps */}
        <div className="mb-16">
          <div className="grid gap-8 md:grid-cols-3">
            {integrationSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {step.icon}
                  </div>
                </div>
                <div className="mb-2 text-sm font-semibold text-blue-600">{step.step}</div>
                <h5 className="mb-4 text-lg font-semibold text-gray-900">{step.title}</h5>
                <div className="space-y-2">
                  {step.details.slice(0, 2).map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-500" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Requirements & Compatibility */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="mb-12 text-center">
            <h4 className="mb-4 text-2xl font-semibold text-gray-900">
              System Requirements & Compatibility
            </h4>
            <p className="text-gray-600">Everything you need to get started with InstaLabel</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* System Requirements */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h5 className="mb-6 text-lg font-semibold text-gray-900">System Requirements</h5>

              <div className="space-y-6">
                <div>
                  <h6 className="mb-3 font-semibold text-gray-900">Web Dashboard</h6>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-gray-700">
                        Modern web browser (Chrome, Firefox, Safari, Edge)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-gray-700">
                        Internet connection for dashboard access
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-gray-700">
                        USB thermal printer OR Android device with Bluetooth printer
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h6 className="mb-3 font-semibold text-gray-900">PrintBridge (USB Printing)</h6>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-gray-700">Windows 10+ or macOS 10.14+</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-gray-700">
                        140MB storage space for PrintBridge
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-sm text-gray-700">
                        USB port for thermal printer connection
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Printer Compatibility */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h5 className="mb-6 text-lg font-semibold text-gray-900">Printer Compatibility</h5>

              <div className="space-y-6">
                {printerCompatibility.map((printer, index) => (
                  <div key={printer.type}>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="rounded-lg bg-gray-100 p-2">{printer.icon}</div>
                      <div>
                        <h6 className="font-semibold text-gray-900">{printer.type}</h6>
                        <div className="text-sm text-purple-600">{printer.requirement}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {printer.printers.map((printerModel, modelIndex) => (
                        <div key={modelIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">{printerModel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
      </div>
    </section>
  )
}
