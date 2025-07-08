"use client"
import React from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Stethoscope, Truck, Factory } from "lucide-react"

const useCases = [
  {
    icon: <ShoppingCart className="h-7 w-7 text-purple-600" />,
    title: "Retail",
    desc: "Price tags, shelf labels, receipt printing—reliable USB printing for any retail environment."
  },
  {
    icon: <Stethoscope className="h-7 w-7 text-blue-600" />,
    title: "Healthcare",
    desc: "Patient labels, specimen tracking, prescription labels—secure, accurate, and fast."
  },
  {
    icon: <Truck className="h-7 w-7 text-green-600" />,
    title: "Logistics",
    desc: "Shipping labels, inventory tags, warehouse management—no cloud dependency, always on."
  },
  {
    icon: <Factory className="h-7 w-7 text-pink-600" />,
    title: "Manufacturing",
    desc: "Product labels, quality control, compliance tracking—works with any USB printer."
  }
]

export const PrintBridgeUseCases = () => (
  <section className="relative w-full py-16 px-4 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-br from-purple-50 via-white to-pink-50">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 text-xs font-semibold text-purple-800 ring-1 ring-purple-200 mb-2">
          Beyond Kitchen Labels: Where Zentra Excels
        </div>
        <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-gray-900">
          Use Cases
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-2">
          Any web app that needs reliable USB printing—Zentra PrintBridge is ready.
        </p>
      </div>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((uc, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
              <div className="bg-white rounded-xl border border-gray-200 shadow p-6 flex flex-col items-center text-center">
                <div className="mb-3">{uc.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{uc.title}</h3>
                <div className="text-sm text-gray-600 mb-3">{uc.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
) 