"use client"
import React from "react"
import { motion } from "framer-motion"
import {
  Utensils,
  Coffee,
  Truck,
  Users,
  CheckCircle,
  Clock,
  Shield,
  TrendingUp,
  BarChart3,
} from "lucide-react"

export const IndustryUseCases = () => {
  const businessTypes = [
    {
      type: "Restaurants & Pubs",
      icon: <Utensils className="h-8 w-8 text-red-600" />,
      dailyUsage: "40-80 labels depending on covers and prep volume",
      color: "red",
      applications: [
        "Morning prep labeling for fresh ingredients and batch cooking",
        "Service period cook labels for grill, fryer, and oven items",
        "Allergen management for customer dietary requirements",
        "Stock rotation and leftover management",
      ],
      keyBenefit: "Complete traceability and reduced food waste",
      stats: "High Volume",
    },
    {
      type: "Cafes & Coffee Shops",
      icon: <Coffee className="h-8 w-8 text-amber-600" />,
      dailyUsage: "20-50 labels for food items and bakery products",
      color: "amber",
      applications: [
        "Fresh bakery item labeling for display cases",
        "Sandwich and salad prep with allergen information",
        "PPDS compliance for grab-and-go items",
        "Milk and dairy alternative tracking for coffee service",
      ],
      keyBenefit: "Customer confidence and regulatory compliance",
      stats: "Medium Volume",
    },
    {
      type: "Takeaways & Fast Food",
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      dailyUsage: "30-100 labels for high-volume operations",
      color: "blue",
      applications: [
        "PPDS labeling for all packaged food items",
        "Allergen communication for delivery and collection orders",
        "Prep labeling for batch-cooked items like sauces and proteins",
        "Hot food hold time management during peak periods",
      ],
      keyBenefit: "Consistent quality and customer safety",
      stats: "Very High Volume",
    },
    {
      type: "Catering & Food Trucks",
      icon: <Users className="h-8 w-8 text-green-600" />,
      dailyUsage: "15-60 labels depending on event size",
      color: "green",
      applications: [
        "Mobile printing via Android app and Bluetooth printer",
        "Event-specific allergen management for varied menus",
        "Transport labeling with time and temperature requirements",
        "Client communication through clear allergen information",
      ],
      keyBenefit: "Professional presentation and liability protection",
      stats: "Variable Volume",
    },
  ]

  return (
    <section className="relative bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Applications by Business Type
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
            InstaLabel adapts to your specific business needs, whether you're running a busy
            restaurant, a cozy cafe, or a mobile food truck.
          </p>
        </motion.div>

        {/* Business Types - Different Layout for Each */}
        <div className="space-y-8">
          {businessTypes.map((business, index) => (
            <motion.div
              key={business.type}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Business Header & Stats */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-xl bg-${business.color}-100 p-3`}>{business.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{business.type}</h3>
                      <p className="text-sm text-gray-600">Daily usage: {business.dailyUsage}</p>
                    </div>
                  </div>

                  {/* Stats Badge */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                    <BarChart3 className="h-4 w-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">{business.stats}</span>
                  </div>

                  {/* Key Benefit */}
                  <div className="rounded-lg border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">Key Benefit</span>
                    </div>
                    <p className="text-sm text-gray-700">{business.keyBenefit}</p>
                  </div>
                </div>

                {/* Primary Applications */}
                <div className="lg:col-span-2">
                  <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Shield className="h-5 w-5 text-purple-600" />
                    Primary Applications
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {business.applications.map((app, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 rounded-lg p-3 transition-colors duration-200 hover:bg-gray-50"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span className="text-sm text-gray-700">{app}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-8">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Ready to See InstaLabel in Your Kitchen?
            </h3>
            <p className="mb-6 text-gray-600">
              Join hundreds of food businesses already using InstaLabel to streamline operations and
              ensure compliance.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-purple-700">
                Start Free Trial
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-6 py-3 font-semibold text-purple-700 transition-colors duration-200 hover:bg-purple-50">
                Book Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
