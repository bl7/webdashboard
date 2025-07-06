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
    <section className="relative bg-white px-4 sm:px-6 py-12 sm:py-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative mx-auto max-w-7xl space-y-16 sm:space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Why Choose InstaLabel?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We've built our platform with the needs of real businesses in mind — fast, scalable, and
            beautifully simple.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-lg p-6 h-full hover:border-purple-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                    {feature.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
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