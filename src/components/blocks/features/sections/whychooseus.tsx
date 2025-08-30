"use client"

import { Lightbulb, ShieldCheck, Zap, Layers3, SmilePlus } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: <Zap className="h-6 w-6 text-purple-600" />,
    title: "Fast Setup",
    description:
      "Get started in minutes with our plug-and-play system. No technical skills required.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-purple-600" />,
    title: "Reliable & Secure",
    description: "Built with reliability and security in mind, for uninterrupted label printing.",
  },
  {
    icon: <Layers3 className="h-6 w-6 text-purple-600" />,
    title: "Scalable Infrastructure",
    description: "Whether you're a small business or a large chain, our platform grows with you.",
  },
  {
    icon: <Lightbulb className="h-6 w-6 text-purple-600" />,
    title: "Smart Dashboard",
    description: "Track usage, manage devices, and monitor performance with ease.",
  },
  {
    icon: <SmilePlus className="h-6 w-6 text-purple-600" />,
    title: "Friendly Support",
    description: "Need help? Our support team is here for you — quick, helpful, and human.",
  },
]

export const WhyChooseUs = () => {
  return (
    <section className="relative bg-white px-4 py-12 sm:px-6 sm:py-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative mx-auto max-w-7xl space-y-16 sm:space-y-20">
        <div className="space-y-4 text-center">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose InstaLabel?
          </h3>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
            We've built our platform with the needs of real businesses in mind — fast, scalable, and
            beautifully simple.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-purple-200 hover:shadow-md">
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition-colors duration-200 group-hover:bg-purple-100">
                    {feature.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
