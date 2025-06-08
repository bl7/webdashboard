"use client"

// import { Printer, Monitor, Zap, ShieldCheck, Globe, Wrench } from "lucide-react"

// import { motion } from "framer-motion"
// import React from "react"

// const coreFeatures = [
//   {
//     title: "Fast Printing",
//     icon: <Printer className="h-6 w-6 text-primary" />,
//     description: "Lightning-fast label printing with zero setup delays.",
//   },
//   {
//     title: "Cloud Dashboard",
//     icon: <Monitor className="h-6 w-6 text-primary" />,
//     description: "Manage devices, usage, and print activity from any browser.",
//   },
//   {
//     title: "One-Click Setup",
//     icon: <Zap className="h-6 w-6 text-primary" />,
//     description: "Install and start printing within minutes — no tech support needed.",
//   },
//   {
//     title: "Secure & Reliable",
//     icon: <ShieldCheck className="h-6 w-6 text-primary" />,
//     description: "Built-in protections and updates to keep your data and prints secure.",
//   },
//   {
//     title: "Works Anywhere",
//     icon: <Globe className="h-6 w-6 text-primary" />,
//     description: "Cross-platform support for Sunmi, Epson, and web-connected devices.",
//   },
//   {
//     title: "Always Supported",
//     icon: <Wrench className="h-6 w-6 text-primary" />,
//     description: "Need help? Our support is here for Sunmi, Epson, and beyond.",
//   },
// ]

// export const CoreFeaturesGrid = () => {
//   return (
//     <section className="bg-muted/20 py-24">
//       <div className="container space-y-12 text-center">
//         <div className="mx-auto max-w-2xl space-y-4">
//           <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
//             Everything You Need to Label Smarter
//           </h2>
//           <p className="text-muted-foreground">
//             InstaLabel is packed with powerful features that simplify your workflow — whether you're
//             running a retail shop or scaling operations across locations.
//           </p>
//         </div>

//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//           {coreFeatures.map((feature, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.05 }}
//               className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm hover:shadow-md"
//             >
//               <div className="mb-4">{feature.icon}</div>
//               <h3 className="text-lg font-semibold">{feature.title}</h3>
//               <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

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
    outcome: "Fully aligned with Natasha’s Law & EHO standards.",
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
    outcome: "Labels don’t slow down the line.",
  },
]

const roles = [
  {
    emoji: "👨‍🍳",
    role: "For Head Chefs",
    line: "“Print labels in the middle of rush hour.”",
  },
  {
    emoji: "📦",
    role: "For Porters",
    line: "“Know what to use first — every time.”",
  },
  {
    emoji: "🧾",
    role: "For Managers",
    line: "“No compliance gaps. Full audit trail.”",
  },
]

export const CoreFeaturesGrid = () => {
  return (
    <section className="-mt-16 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          Built for the Chaos of a Real Kitchen
        </h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
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

        <div className="mt-20">
          <h3 className="mb-6 text-center text-xl font-semibold">Use Case Snapshots</h3>
          <div className="grid gap-6 md:grid-cols-3">
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
