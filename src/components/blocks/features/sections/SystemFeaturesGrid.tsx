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
      "AI-powered ingredient analysis, automatic allergen detection, and FDA/EHO compliant templates. Generate professional labels in seconds.",
    technicalDetails: [
      "Text analysis processes menu descriptions to identify ingredients automatically",
      "Pattern recognition scans for all 14 UK required allergens in ingredient lists",
      "Pre-built templates ensure FSA compliance formatting",
      "Label preview shows exact layout before printing",
      "Bulk label generation for multiple items simultaneously",
    ],
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-purple-600" />,
    title: "Compliance & Safety",
    description:
      "Built-in Natasha's Law compliance, automatic FSA updates, comprehensive audit trails, and food safety regulation adherence.",
    technicalDetails: [
      "Templates automatically update when UK food safety regulations change",
      "Complete audit trail logs every label printed with timestamp and staff ID",
      "PPDS label formatting meets FSA requirements without manual formatting",
      "Allergen highlighting uses color coding and bold text for visibility",
      "Inspection-ready reports export in PDF format for EHO visits",
    ],
  },
  {
    icon: <Zap className="h-7 w-7 text-yellow-500" />,
    title: "Lightning Fast Setup",
    description:
      "Get started in minutes with automatic printer detection, one-click Square POS integration, and intuitive guided onboarding.",
    technicalDetails: [
      "PrintBridge software automatically detects USB thermal printers on Windows/Mac",
      "Android app pairs with Bluetooth printers in under 30 seconds",
      "Square connection uses OAuth authentication for secure one-click linking",
      "Menu import wizard guides you through ingredient and allergen mapping",
      "Test print feature verifies printer compatibility before going live",
    ],
  },
  {
    icon: <Cloud className="h-7 w-7 text-blue-600" />,
    title: "Cloud-First Architecture",
    description:
      "Unlimited product storage, real-time sync across devices, secure AWS backup with high availability, and instant access anywhere.",
    technicalDetails: [
      "Menu database stores unlimited items with ingredient and allergen information",
      "Real-time synchronization across web dashboard and Android app",
      "AWS cloud infrastructure provides automatic backups every 15 minutes",
      "Access from multiple devices simultaneously without data conflicts",
      "Offline mode allows label creation when internet is temporarily unavailable",
    ],
  },
  {
    icon: <FileText className="h-7 w-7 text-indigo-600" />,
    title: "Bulk Operations",
    description:
      "Mass label printing, batch ingredient updates, bulk allergen management, and automated workflow optimization for busy kitchens.",
    technicalDetails: [
      "Process 100+ labels in under 30 seconds with batch operations",
      "Excel/CSV import with duplicate detection and validation",
      "Bulk allergen updates across multiple menu items simultaneously",
      "Automated workflow templates for common kitchen procedures",
      "Queue management for high-volume printing periods",
    ],
  },
  {
    icon: <Smartphone className="h-7 w-7 text-pink-600" />,
    title: "Mobile-First Design",
    description:
      "Responsive web app optimized for mobile devices, Android app for thermal printing, and seamless cross-device experience.",
    technicalDetails: [
      "Native Android app for mobile kitchen operations",
      "Android app connects to any Bluetooth 4.0+ thermal printer",
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
      "End-to-end encryption, GDPR compliance, role-based access controls, and secure authentication for team management.",
    technicalDetails: [
      "256-bit AES encryption for all data in transit and at rest",
      "GDPR compliance with automatic data retention policies",
      "Role-based access controls with granular permission management",
      "Multi-factor authentication support for enhanced security",
      "Regular security audits and penetration testing",
    ],
  },

  {
    icon: <Printer className="h-7 w-7 text-gray-600" />,
    title: "Universal Printer Support",
    description:
      "Works with any thermal printer via USB, Bluetooth, or network. PrintBridge technology ensures seamless connectivity.",
    technicalDetails: [
      "PrintBridge software creates direct connection from web browser to USB printers",
      "Supports ESC/POS thermal printer protocol (industry standard)",
      "Android app connects to any Bluetooth 4.0+ thermal printer",
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
  <section className="relative bg-gradient-to-br from-white via-purple-50/30 to-white py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <div className="mb-3 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200">
          <Zap className="mr-2 h-4 w-4 text-purple-600" />
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
              className="group border-l-4 border-purple-200 pl-6 transition-colors duration-300 hover:border-purple-400"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-purple-50 p-2 text-purple-600 transition-colors duration-200 group-hover:bg-purple-100">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-purple-700">
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
