"use client"

import { Button } from "@/components/ui"
import {
  ArrowRight,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  Zap,
  Database,
  Smartphone,
  FileText,
  Wifi,
  WifiOff,
  Printer,
  Square,
  Brain,
  Layers,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import instaLabel2 from "@/assets/images/instaLabel2.png"
import kitchenInstalabel from "@/assets/images/kitchenInstalabel.png"
import labelPrunterInKitchen from "@/assets/images/labelPrunterInKitchen.png"

export const SquareIntegrationHomepage = () => {
  const features = [
    {
      icon: FileText,
      title: "Print Logs",
      description: "Full history for traceability and compliance.",
    },
    {
      icon: Zap,
      title: "Easy Install",
      description: "Connect PrintBridge or Bluetooth printers in seconds.",
    },
    {
      icon: Download,
      title: "Label Supply",
      description: "Order labels right from your dashboard.",
    },
    {
      icon: Upload,
      title: "Excel Upload",
      description: "Bulk import menus with smart allergen detection.",
    },
    {
      icon: Printer,
      title: "Custom Labels",
      description: "Make labels for notes or special needs on the fly.",
    },
    {
      icon: WifiOff,
      title: "Offline Printing",
      description: "Keep printing even when offline, auto-sync later.",
    },
    {
      icon: Layers,
      title: "Bulk Printing",
      description: "Create and print multiple labels at once for efficiency.",
    },
  ]

  return (
    <section className="relative bg-gradient-to-br from-white via-purple-50/30 to-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div>
              <div className="mb-2 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200">
                <Zap className="mr-2 h-4 w-4" />
                Smart Kitchen Features
              </div>

              <h3 className="mb-4 text-center text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-left lg:text-5xl">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Everything kitchens
                </span>
                <br />
                <span className="text-gray-900">need, in one place</span>
              </h3>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="flex items-start space-x-3 rounded-lg p-2 transition-colors hover:bg-white/50"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-purple-100 to-pink-100">
                    <feature.icon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold text-gray-900">{feature.title}</h4>
                    <p className="text-xs leading-relaxed text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-1"
            >
              <Link href="/features">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
                >
                  See the Full List of Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-2xl">
              <Image
                src={kitchenInstalabel}
                alt="Kitchen staff using InstaLabel mobile app for food labeling"
                className="h-full w-full object-cover transition duration-300 hover:scale-105"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={85}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Simple Pricing Section Component
export const SimplePricing = () => {
  return (
    <section className="relative bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-center text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-left lg:text-5xl">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Simple pricing, built
              </span>
              <br />
              <span className="text-gray-900">for kitchens.</span>
            </h3>

            <div className="space-y-4 text-sm leading-relaxed text-gray-600">
              <p>No contracts, no hidden extras — just clear plans.</p>
              <p>Choose monthly or annual billing.</p>
              <p>One account works on web or mobile — print from anywhere.</p>
              <p>Labels and subscription all managed in one place.</p>
            </div>

            <div className="pt-4">
              <Link href="/plan">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
                >
                  FIND A PLAN THAT SUITS YOU
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Side - Product Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-2xl">
              <Image
                src={labelPrunterInKitchen}
                alt="Label printer in kitchen - Professional food safety labeling system"
                className="h-full w-full object-cover transition duration-300 hover:scale-105"
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={85}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Allergen Quiz Section Component
export const AllergenQuizSection = () => {
  return (
    <section className="relative px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="mb-3 text-lg font-bold text-gray-900">Test Your Allergen Knowledge</h3>
            <p className="mx-auto mb-6 max-w-2xl text-sm text-gray-600">
              Think you know your allergens? Take our quick 10-question UK compliance quiz and see
              how well you understand food safety regulations.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-purple-600 px-8 py-3 text-white hover:bg-purple-700"
                asChild
              >
                <Link href="/allergen-guide">
                  Take the Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm font-medium text-purple-600">
                Free • 5 minutes • Instant results
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
