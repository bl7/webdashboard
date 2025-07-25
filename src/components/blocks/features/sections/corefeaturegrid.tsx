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
    icon: <FaMobileAlt className="h-6 w-6 text-purple-500" />,
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



export const CoreFeaturesGrid = () => {
  return (
    <section className="-mt-8 sm:-mt-16 py-8 sm:py-12">
      <div className="container px-2 sm:px-4 md:px-12 lg:px-16">
        <h2 className="mb-6 sm:mb-8 text-center text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
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
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="mb-1 text-sm text-gray-600 font-medium">{feature.solution}</p>
              <p className="text-sm text-gray-500">{feature.outcome}</p>
            </motion.div>
          ))}
        </div>

       
      </div>
    </section>
  )
}
