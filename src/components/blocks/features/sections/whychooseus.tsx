"use client"

import { Lightbulb, ShieldCheck, Zap, Layers3, SmilePlus } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Fast Setup",
    description:
      "Get started in minutes with our plug-and-play system. No technical skills required.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Reliable & Secure",
    description: "Built with reliability and security in mind, for uninterrupted label printing.",
  },
  {
    icon: <Layers3 className="h-6 w-6 text-primary" />,
    title: "Scalable Infrastructure",
    description: "Whether you're a small business or a large chain, our platform grows with you.",
  },
  {
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
    title: "Smart Dashboard",
    description: "Track usage, manage devices, and monitor performance with ease.",
  },
  {
    icon: <SmilePlus className="h-6 w-6 text-primary" />,
    title: "Friendly Support",
    description: "Need help? Our support team is here for you — quick, helpful, and human.",
  },
]

export const WhyChooseUs = () => {
  return (
    <section className="bg-white py-8 sm:py-24">
      <div className="container space-y-8 sm:space-y-12 px-2 sm:px-4 text-center sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-2 sm:space-y-4">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">Why Choose InstaLabel?</h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            We've built our platform with the needs of real businesses in mind — fast, scalable, and
            beautifully simple.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl border bg-muted/10 p-6 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex w-fit items-center justify-center rounded-full bg-muted p-3">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-8 sm:mt-12">
        <a href="/register">
          <button className="bg-primary px-8 py-4 text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold rounded-xl w-full sm:w-auto">
            Start Free Trial
          </button>
        </a>
      </div>
    </section>
  )
}
