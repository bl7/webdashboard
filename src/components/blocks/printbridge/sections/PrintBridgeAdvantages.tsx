"use client"
import React from "react"
import { CheckCircle, XCircle, Cloud, MousePointerClick, Settings, Shield, Wifi, Printer } from "lucide-react"
import { motion } from "framer-motion"

const advantages = [
  {
    icon: <XCircle className="h-7 w-7 text-red-500" />, title: "Browser Printing", points: [
      "Popups, confusion, wrong settings",
      "Users select the wrong printer",
      "Blocked by browser security",
      "23% error rate, 6+ clicks"
    ], outcome: "Frustration, wasted time, support tickets"
  },
  {
    icon: <Cloud className="h-7 w-7 text-blue-500" />, title: "Cloud Printing", points: [
      "Requires internet connection",
      "Monthly fees, data transmission",
      "Complex setup, privacy concerns",
      "Not truly local or instant"
    ], outcome: "Dependency, cost, privacy risk"
  },
  {
    icon: <Settings className="h-7 w-7 text-gray-500" />, title: "Manual Solutions", points: [
      "Training needed, user error",
      "Manual file downloads",
      "No automation, slow process",
      "Ongoing maintenance"
    ], outcome: "Inefficiency, mistakes, lost productivity"
  },
  {
    icon: <Shield className="h-7 w-7 text-purple-600" />, title: "Zentra PrintBridge", points: [
      "No popups, no confusion",
      "Silent, local, secure printing",
      "Works offline, no cloud required",
      "Instant, error-free label printing"
    ], outcome: "Speed, reliability, happy users"
  }
]

export const PrintBridgeAdvantages = () => (
  <section className="relative w-full py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-purple-50 via-white to-pink-50">
    <div className="max-w-6xl mx-auto">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200 mb-2">
          Why Zentra Beats Every Alternative
        </div>
        <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-gray-900">
          Competitive Advantages
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-2">
          Zentra PrintBridge outperforms browser, cloud, and manual printing solutions—delivering speed, reliability, and peace of mind for your business.
        </p>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {advantages.map((adv, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl border border-gray-200 shadow p-6 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="mb-3">{adv.icon}</div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">{adv.title}</h3>
            <ul className="text-sm text-gray-600 mb-3 space-y-1 list-disc list-inside">
              {adv.points.map((pt, j) => <li key={j}>{pt}</li>)}
            </ul>
            <div className="mt-auto text-xs font-semibold text-purple-700">{adv.outcome}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
) 