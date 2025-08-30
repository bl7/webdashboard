"use client"
import React from "react"
import {
  Printer,
  Wifi,
  Smartphone,
  Barcode,
  Flashlight,
  Shield,
  Cloud,
  CheckCircle,
  Settings,
  Repeat,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import HardwareImage from "@/assets/images/plandevices.png"
const hardwareFeatures = [
  {
    icon: <Printer className="h-7 w-7 text-purple-600" />,
    title: "Integrated Printer",
    description: "Prints directly onto thermal labels—no ink or cartridges needed.",
  },
  {
    icon: <Wifi className="h-7 w-7 text-blue-600" />,
    title: "Remote Connectivity",
    description: "WiFi and 4G SIM support for use anywhere—ideal for events and outdoor catering.",
  },
  {
    icon: <Smartphone className="h-7 w-7 text-green-600" />,
    title: "Wipeclean Touchscreen",
    description: '5.99" HD+ display, easy to clean and hygienic for kitchen use.',
  },
  {
    icon: <Barcode className="h-7 w-7 text-pink-600" />,
    title: "2D Barcode Scanner",
    description: "Instantly reprint labels—scan barcodes even if damaged or stained.",
  },
  {
    icon: <Flashlight className="h-7 w-7 text-yellow-500" />,
    title: "In-built Flashlight",
    description: "Find items in walk-in fridges or low light with a super-bright flashlight.",
  },
  {
    icon: <Shield className="h-7 w-7 text-gray-600" />,
    title: "Rugged & Hygienic",
    description: "Protective rubber surround, drop-tested, built for hospitality environments.",
  },
]

const softwareFeatures = [
  {
    icon: <CheckCircle className="h-7 w-7 text-green-600" />,
    title: "Label Printing Made Easy",
    description: "Print EHO and Natasha’s Law compliant labels in seconds—no handwriting needed.",
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-purple-600" />,
    title: "Compliance Built In",
    description: "Stay inspection-ready with built-in compliance for food safety laws.",
  },
  {
    icon: <Zap className="h-7 w-7 text-yellow-500" />,
    title: "Super-Fast Setup",
    description: "Works straight out of the box—get started in minutes.",
  },
  {
    icon: <Cloud className="h-7 w-7 text-blue-600" />,
    title: "Cloud Storage",
    description:
      "Unlimited saved products, secure AWS cloud backup, instant reprints from any device.",
  },
  {
    icon: <Repeat className="h-7 w-7 text-pink-600" />,
    title: "Easy Label Re-Order",
    description: "Re-order labels in-app with one click—free shipping, always.",
  },
  {
    icon: <Settings className="h-7 w-7 text-gray-600" />,
    title: "No Training Needed",
    description: "Simple interface—anyone can use it after a 60-second briefing.",
  },
  {
    icon: <Users className="h-7 w-7 text-indigo-600" />,
    title: "Easy Scalability",
    description: "Add devices and share product info across locations instantly.",
  },
]

const SystemFeaturesGrid = () => (
  <section className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20">
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
    <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-12 px-4 md:grid-cols-2 lg:px-0">
      {/* Hardware Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex h-full flex-col space-y-8 rounded-2xl border border-purple-100 bg-white/80 p-8 shadow"
      >
        <div className="mb-2 flex flex-col items-center">
          <h3 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            The Hardware
          </h3>
          <Image
            src={HardwareImage}
            width={100}
            height={100}
            alt="Hardware device"
            className="mb-4 w-full max-w-xs rounded-xl shadow-lg"
          />
        </div>
        <ul className="space-y-5">
          {hardwareFeatures.map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <span>{item.icon}</span>
              <div>
                <div className="text-base font-semibold text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
      {/* Software Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex h-full flex-col space-y-8 rounded-2xl border border-purple-100 bg-white/80 p-8 shadow"
      >
        <div className="mb-2 flex flex-col items-center">
          <h3 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            The Software
          </h3>
          <Image
            src="/webdashboard/print.png"
            alt="Software Screenshot"
            width={2880}
            height={1800}
            className="w-full max-w-xs rounded-xl shadow-lg"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <ul className="space-y-5">
          {softwareFeatures.map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <span>{item.icon}</span>
              <div>
                <div className="text-base font-semibold text-gray-900">{item.title}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  </section>
)

export default SystemFeaturesGrid
