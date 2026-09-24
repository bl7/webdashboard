"use client"
import React from "react"
import {
  CheckCircle,
  ShieldCheck,
  Zap,
  Cloud,
  Repeat,
  Settings,
  FileText,
  Smartphone,
  BarChart3,
  Lock,
  Printer,
  Wifi,
  Globe,
  ArrowRight,
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const softwareFeatures = [
  {
    icon: <CheckCircle className="h-7 w-7 text-green-600" />,
    title: "Smart Label Generation",
    description:
      "Manage ingredients and recorded allergens, then print a consistent label.",
    technicalDetails: [
      "Ingredients come from the records you save or import",
      "Allergen emphasis uses the allergens saved against each ingredient",
      "Layouts follow the label type and size you select",
      "Label preview shows exact layout before printing",
      "Bulk label generation for multiple items simultaneously",
    ],
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-mkt-teal" />,
    title: "Compliance & Safety",
    description:
      "PPDS layouts, print records and the allergen information your business saves.",
    technicalDetails: [
      "You update ingredient, allergen and date information when your recipes change",
      "Complete audit trail logs every label printed with timestamp and staff ID",
      "PPDS layouts include the ingredient list and allergen emphasis from your records",
      "Allergen highlighting uses color coding and bold text for visibility",
      "Inspection-ready reports export in PDF format for EHO visits",
    ],
  },
  {
    icon: <Zap className="h-7 w-7 text-yellow-500" />,
    title: "Lightning Fast Setup",
    description:
      "Get started in minutes with automatic printer detection and intuitive guided onboarding.",
    technicalDetails: [
      "PrintBridge software automatically detects USB thermal printers on Windows/Mac",
      "The Android app pairs with a supported Bluetooth printer",
      "Menu import wizard guides you through ingredient and allergen mapping",
      "Test print feature verifies printer compatibility before going live",
    ],
  },
  {
    icon: <Cloud className="h-7 w-7 text-blue-600" />,
    title: "Cloud-First Architecture",
    description:
      "Products are stored in your InstaLabel account and can be printed from the dashboard or Android app.",
    technicalDetails: [
      "Menu items and ingredients are stored with the allergen information you record",
      "Use the web dashboard or the Android app",
      "Items are stored in your InstaLabel account",
      "Printing still depends on the computer or Android setup you are using",
    ],
  },
  {
    icon: <FileText className="h-7 w-7 text-indigo-600" />,
    title: "Bulk Operations",
    description:
      "Mass label printing, batch ingredient updates, bulk allergen management, and automated workflow optimization for busy kitchens.",
    technicalDetails: [
      "Print more than one label from a saved list",
      "Excel/CSV import with duplicate detection and validation",
      "Bulk allergen updates across multiple menu items simultaneously",
      "Automated workflow templates for common kitchen procedures",
      "Queue management for high-volume printing periods",
    ],
  },
  {
    icon: <Smartphone className="h-7 w-7 text-mkt-teal" />,
    title: "Mobile-First Design",
    description:
      "Responsive web app optimized for mobile devices, Android app for thermal printing, and seamless cross-device experience.",
    technicalDetails: [
      "Native Android app for mobile kitchen operations",
      "Android app: MUNBYN RW411B or Born4Ship DB403; Bluetooth 4.0+ thermal printers supported",
      "Touch-optimized interface for kitchen glove compatibility",
      "Offline printing queue stores up to 50 labels when disconnected",
      "Cross-device synchronization maintains consistent data across platforms",
    ],
  },

  {
    icon: <BarChart3 className="h-7 w-7 text-orange-600" />,
    title: "Analytics & Reporting",
    description:
      "Comprehensive usage analytics, compliance reports, cost tracking, and performance metrics to optimize your operations.",
    technicalDetails: [
      "Track labels printed by date, staff member, and label type",
      "Monitor which allergens are most commonly printed for training insights",
      "Generate monthly compliance reports for management review",
      "Identify peak printing times to optimize kitchen workflows",
      "Export data to Excel for custom analysis and record keeping",
    ],
  },
  {
    icon: <Lock className="h-7 w-7 text-red-600" />,
    title: "Enterprise Security",
    description:
      "The dashboard is opened with your account login. Ask us if you need specific security documentation.",
    technicalDetails: [
      "Account access is required to open the dashboard",
      "Staff can be given their own logins where your plan includes them",
      "Ask us before relying on a specific encryption, backup or certification claim",
    ],
  },

  {
    icon: <Printer className="h-7 w-7 text-gray-600" />,
    title: "Universal Printer Support",
    description:
      "Works with USB and Bluetooth thermal label printers. Computer: a label printer installed on Windows or macOS, through PrintBridge. Android: MUNBYN RW411B or Born4Ship DB403. PrintBridge technology ensures seamless connectivity.",
    technicalDetails: [
      "PrintBridge software creates direct connection from web browser to USB printers",
      "Supports ESC/POS thermal printer protocol (industry standard)",
      "Android app: MUNBYN RW411B or Born4Ship DB403; Bluetooth 4.0+ thermal printers supported",
      "No special drivers required - works with existing printer installations",
      "Print queue management handles multiple label requests efficiently",
    ],
  },
  {
    icon: <Wifi className="h-7 w-7 text-cyan-600" />,
    title: "Offline Capability",
    description:
      "Works without internet, local data storage, automatic sync when online, and reliable operation in any environment.",
    technicalDetails: [
      "30-day local cache stores recent menu items and ingredients",
      "Offline label creation and printing when internet unavailable",
      "Automatic synchronization when connection restored",
      "Local data encryption ensures security during offline operation",
      "Graceful degradation maintains core functionality without connectivity",
    ],
  },
]

const SystemFeaturesGrid = () => (
  <section className="relative bg-gradient-to-br from-white via-white/30 to-white py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <div className="mb-3 inline-flex items-center rounded-full bg-mkt-canvas px-3 py-1 text-xs font-semibold text-mkt-ink ring-1 ring-mkt-steel1">
          <Zap className="mr-2 h-4 w-4 text-mkt-teal" />
          Comprehensive Software Solution
        </div>
        <h3 className="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
          Powerful Software Features
        </h3>
        <p className="mx-auto max-w-3xl text-lg text-gray-600">
          InstaLabel transforms your kitchen operations with intelligent labeling, compliance
          management, and seamless integrations.
        </p>
      </motion.div>

      {/* Features in Two Columns - Left: Core Features, Right: Advanced Features */}
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Core Features */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center lg:text-left">
            <h4 className="mb-4 text-xl font-semibold text-gray-900">Core Features</h4>
            <p className="text-gray-600">Essential functionality for every kitchen</p>
          </div>

          {softwareFeatures.slice(0, 5).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group border-l-4 border-mkt-steel1 pl-6 transition-colors duration-300 hover:border-mkt-steel1"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-mkt-canvas p-2 text-mkt-teal transition-colors duration-200 group-hover:bg-mkt-canvas">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-mkt-ink">
                    {item.title}
                  </h5>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.description}</p>

                  {/* Technical Details - Simplified */}
                  <div className="mt-3 space-y-1">
                    {item.technicalDetails.slice(0, 2).map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-500" />
                        <span className="text-xs text-gray-600">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Advanced Features */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="text-center lg:text-left">
            <h4 className="mb-4 text-xl font-semibold text-gray-900">Advanced Features</h4>
            <p className="text-gray-600">Professional capabilities for growing businesses</p>
          </div>

          {softwareFeatures.slice(5).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group border-l-4 border-blue-200 pl-6 transition-colors duration-300 hover:border-blue-400"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors duration-200 group-hover:bg-blue-100">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-700">
                    {item.title}
                  </h5>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.description}</p>

                  {/* Technical Details - Simplified */}
                  <div className="mt-3 space-y-1">
                    {item.technicalDetails.slice(0, 2).map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-500" />
                        <span className="text-xs text-gray-600">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
)

export default SystemFeaturesGrid
