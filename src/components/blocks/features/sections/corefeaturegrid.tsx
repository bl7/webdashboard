"use client"

import { motion } from "framer-motion"
import {
  FaCalendarCheck,
  FaAllergies,
  FaMobileAlt,
  FaBluetooth,
  FaBolt,
  FaUserCheck,
} from "react-icons/fa"

const features = [
  {
    icon: <FaCalendarCheck className="h-6 w-6 text-red-500" />,
    title: "Expiry Confusion? Gone.",
    solution: "Auto-calculate expiry based on type (frozen, fresh, canned).",
    outcome: "No more guesswork. No more handwritten mistakes.",
  },
  {
    icon: <FaAllergies className="h-6 w-6 text-yellow-500" />,
    title: "Allergen & Compliance? Built-in.",
    solution: "Labels print with allergen icons, prep time, use-by info.",
    outcome: "Fully aligned with Natasha's Law & EHO standards.",
  },
  {
    icon: <FaUserCheck className="h-6 w-6 text-green-500" />,
    title: "Zero Training Needed.",
    solution: "Touchscreen-simple interface anyone can use.",
    outcome: "Built for chefs, not tech people.",
  },
  {
    icon: <FaMobileAlt className="h-6 w-6 text-blue-500" />,
    title: "Manage Anywhere.",
    solution: "Update labels & ingredients from your phone or dashboard.",
    outcome: "Stay in control, even when off-site.",
  },
  {
    icon: <FaBluetooth className="h-6 w-6 text-indigo-500" />,
    title: "Sunmi & Bluetooth Ready.",
    solution: "Plug-and-play with the printers you already have.",
    outcome: "No new hardware required.",
  },
  {
    icon: <FaBolt className="h-6 w-6 text-orange-500" />,
    title: "Speed Built In.",
    solution: "Print in the middle of service without delay.",
    outcome: "Labels don't slow down the line.",
  },
  
]

const roles = [
  {
    emoji: "👨‍🍳",
    role: "For Head Chefs",
    line: "Print labels in the middle of rush hour.",
  },
  {
    emoji: "📦",
    role: "For Porters",
    line: "Know what to use first — every time.",
  },
  {
    emoji: "🧾",
    role: "For Managers",
    line: "No compliance gaps. Full audit trail.",
  },
]

export const CoreFeaturesGrid = () => {
  return (
    <section className="-mt-8 sm:-mt-16 py-8 sm:py-16">
      <div className="container px-2 sm:px-4 md:px-12 lg:px-16">
        <h2 className="mb-6 sm:mb-10 text-center text-2xl sm:text-3xl font-bold text-gray-900">
          Built for the Chaos of a Real Kitchen
        </h2>
        <div className="grid gap-6 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="rounded-2xl border bg-gray-50 p-6 shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-3 flex items-center gap-3">
                {feature.icon}
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="mb-1 text-sm font-medium text-gray-800">{feature.solution}</p>
              <p className="text-sm text-gray-500">{feature.outcome}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 sm:mt-20">
          <h3 className="mb-4 sm:mb-6 text-center text-lg sm:text-xl font-semibold">Use Case Snapshots</h3>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {roles.map((r, i) => (
              <div key={i} className="rounded-xl bg-gray-100 p-5 text-center shadow-sm">
                <div className="mb-2 text-3xl">{r.emoji}</div>
                <h4 className="text-md font-bold">{r.role}</h4>
                <p className="mt-1 text-sm italic text-gray-600">{r.line}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
