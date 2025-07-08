'use client'
import React from "react"
import { Printer, Wifi, Smartphone, Barcode, Flashlight, Shield, Cloud, CheckCircle, Settings, Repeat, Users, ShieldCheck, Zap } from "lucide-react"
import { motion } from "framer-motion"

const hardwareFeatures = [
  { icon: <Printer className="h-7 w-7 text-purple-600" />, title: "Integrated Printer", description: "Prints directly onto thermal labels—no ink or cartridges needed." },
  { icon: <Wifi className="h-7 w-7 text-blue-600" />, title: "Remote Connectivity", description: "WiFi and 4G SIM support for use anywhere—ideal for events and outdoor catering." },
  { icon: <Smartphone className="h-7 w-7 text-green-600" />, title: "Wipeclean Touchscreen", description: "5.99\" HD+ display, easy to clean and hygienic for kitchen use." },
  { icon: <Barcode className="h-7 w-7 text-pink-600" />, title: "2D Barcode Scanner", description: "Instantly reprint labels—scan barcodes even if damaged or stained." },
  { icon: <Flashlight className="h-7 w-7 text-yellow-500" />, title: "In-built Flashlight", description: "Find items in walk-in fridges or low light with a super-bright flashlight." },
  { icon: <Shield className="h-7 w-7 text-gray-600" />, title: "Rugged & Hygienic", description: "Protective rubber surround, drop-tested, built for hospitality environments." },
]

const softwareFeatures = [
  { icon: <CheckCircle className="h-7 w-7 text-green-600" />, title: "Label Printing Made Easy", description: "Print EHO and Natasha’s Law compliant labels in seconds—no handwriting needed." },
  { icon: <ShieldCheck className="h-7 w-7 text-purple-600" />, title: "Compliance Built In", description: "Stay inspection-ready with built-in compliance for food safety laws." },
  { icon: <Zap className="h-7 w-7 text-yellow-500" />, title: "Super-Fast Setup", description: "Works straight out of the box—get started in minutes." },
  { icon: <Cloud className="h-7 w-7 text-blue-600" />, title: "Cloud Storage", description: "Unlimited saved products, secure AWS cloud backup, instant reprints from any device." },
  { icon: <Repeat className="h-7 w-7 text-pink-600" />, title: "Easy Label Re-Order", description: "Re-order labels in-app with one click—free shipping, always." },
  { icon: <Settings className="h-7 w-7 text-gray-600" />, title: "No Training Needed", description: "Simple interface—anyone can use it after a 60-second briefing." },
  { icon: <Users className="h-7 w-7 text-indigo-600" />, title: "Easy Scalability", description: "Add devices and share product info across locations instantly." },
]

const SystemFeaturesGrid = () => (
  <section className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start px-4 lg:px-0">
      {/* Hardware Features */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="space-y-8 flex flex-col h-full bg-white/80 border border-purple-100 rounded-2xl shadow p-8"
      >
        <div className="flex flex-col items-center mb-2">
          <img src="/assets/images/plandevices.png" alt="Hardware device" className="rounded-xl shadow-lg max-w-xs w-full mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">The Hardware</h2>
        </div>
        <ul className="space-y-5">
          {hardwareFeatures.map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <span>{item.icon}</span>
              <div>
                <div className="font-semibold text-gray-900 text-base">{item.title}</div>
                <div className="text-gray-600 text-sm">{item.description}</div>
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
        className="space-y-8 flex flex-col h-full bg-white/80 border border-purple-100 rounded-2xl shadow p-8"
      >
        <div className="flex flex-col items-center mb-2">
          <img src="/assets/images/plandevices.png" alt="Software screenshot" className="rounded-xl shadow-lg max-w-xs w-full mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">The Software</h2>
        </div>
        <ul className="space-y-5">
          {softwareFeatures.map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <span>{item.icon}</span>
              <div>
                <div className="font-semibold text-gray-900 text-base">{item.title}</div>
                <div className="text-gray-600 text-sm">{item.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
    <div className="max-w-5xl mx-auto mt-8 px-4 text-center text-base text-gray-700">
      Print from any USB label printer, or use our portable Sunmi device which runs InstaLabel natively and prints directly from the device itself.
    </div>
  </section>
)

export default SystemFeaturesGrid; 