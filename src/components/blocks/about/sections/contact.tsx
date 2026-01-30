"use client"
import React from "react"
import { ContactForm } from "./form"
import { MapPin, Phone, Mail, Clock, Users, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export const Contact = () => {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50/30 py-12 sm:py-16"
    >
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 animate-pulse rounded-full bg-purple-200/20 blur-3xl" />
        <div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-200/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute left-3/4 top-1/2 h-64 w-64 animate-pulse rounded-full bg-purple-200/20 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute left-1/2 top-10 h-32 w-32 rounded-full bg-green-200/30 blur-2xl" />
        <div className="absolute right-10 top-3/4 h-48 w-48 rounded-full bg-yellow-200/20 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Get in Touch
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Tell us a little bit about who you are, and we'll tell you a whole lot more about who we
            are.
          </p>
        </motion.div>

        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          {/* Left Side: Info - Floating elements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-12 lg:w-1/2"
          >
            <div className="relative">
              <div className="ml-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="group flex transform items-start gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-xl hover:backdrop-blur-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg transition-all duration-300 group-hover:scale-110">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <dt className="mb-1 text-base font-semibold text-gray-900">Address</dt>
                    <dd className="text-base text-gray-600">Bournemouth, UK</dd>
                  </div>
                </div>

                <div className="group flex transform items-start gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-xl hover:backdrop-blur-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg transition-all duration-300 group-hover:scale-110">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <dt className="mb-1 text-lg font-bold text-gray-900">Phone</dt>
                    <dd className="text-gray-600">+44 7585 644204</dd>
                  </div>
                </div>

                <div className="group flex transform items-start gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-xl hover:backdrop-blur-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transition-all duration-300 group-hover:scale-110">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <dt className="mb-1 text-lg font-bold text-gray-900">Email</dt>
                    <dd className="text-gray-600">contact@instalabel.co</dd>
                  </div>
                </div>

                <div className="group flex transform items-start gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white/60 hover:shadow-xl hover:backdrop-blur-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg transition-all duration-300 group-hover:scale-110">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <dt className="mb-1 text-lg font-bold text-gray-900">Response Time</dt>
                    <dd className="text-gray-600">Within 24 hours</dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators - Floating badges */}
            <div className="flex flex-wrap justify-center gap-6 lg:justify-start">
              {/* <div className="group flex transform items-center gap-4 rounded-2xl bg-gradient-to-r from-green-50 to-green-100 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CheckCircle className="h-8 w-8 text-green-500 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <div className="text-lg font-semibold text-gray-900">500+ Kitchens</div>
                  <div className="text-sm text-gray-600">Trust InstaLabel</div>
                </div>
              </div> */}
              {/* <div className="group flex transform items-center gap-4 rounded-2xl bg-gradient-to-r from-purple-50 to-purple-100 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CheckCircle className="h-8 w-8 text-purple-500 transition-transform duration-300 group-hover:scale-110" />
                <div>
                  <div className="text-lg font-semibold text-gray-900">EHO Compliant</div>
                  <div className="text-sm text-gray-600">Certified Solution</div>
                </div>
              </div> */}
            </div>
          </motion.div>

          {/* Right Side: Form - Floating design */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="relative">
              {/* Floating form header */}
              <div className="group mb-8 flex items-center"></div>

              {/* Form with minimal styling */}
              <div className="transform pl-4 transition-all duration-500 hover:scale-[1.02]">
                <ContactForm />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
