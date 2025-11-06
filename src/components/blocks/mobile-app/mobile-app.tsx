"use client"
import React from "react"
import { Button } from "@/components/ui"
import {
  ArrowRight,
  Smartphone,
  Shield,
  Zap,
  CheckCircle,
  Download,
  Wifi,
  Printer,
  Calendar,
  Users,
  Star,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import instalabelImage from "@/assets/images/instaLabel2.png"

export const MobileAppPage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-white px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
        {/* Background elements */}
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-5 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-5 blur-3xl" />

        <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl space-y-6 text-center md:text-left"
          >
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
              <Smartphone className="mr-2 h-4 w-4" />
              #1 Kitchen Labelling Mobile App
            </div>

            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="text-purple-600">Label Your Kitchen</span>
              <br className="hidden md:block" />
              <span>Effortlessly with the App</span>
            </h1>

            <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
              Manage allergens, print compliance labels, and track prep/cook items—all from your
              smartphone. Stay Natasha's Law compliant on the go.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Natasha's Law Compliant</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <Zap className="h-4 w-4 text-purple-600" />
                <span>Print from Anywhere</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 md:justify-start">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span>Offline Mode</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Link
                href="https://play.google.com/store/apps/details?id=com.instalabel.co.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download on Android
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-gray-500 md:justify-start">
              <span>✓ Growing community of UK restaurants</span>
              <span>✓ Works with any thermal printer</span>
              <span>✓ 14-day free trial, no credit card</span>
            </div>
          </motion.div>

          {/* Right Visual - InstaLabel Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-[320px]"
          >
            <div className="relative mx-auto">
              <Image
                src={instalabelImage}
                alt="InstaLabel Mobile App - Kitchen Labelling Made Simple"
                width={320}
                height={384}
                className="rounded-lg"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative w-full bg-gray-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Features You'll Love
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Everything you need to keep your kitchen compliant and organized, all from your mobile
              device.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Allergen Compliance Made Easy
              </h3>
              <p className="text-gray-600">
                Stay fully Natasha's Law compliant. Add allergens to ingredients and let the app
                generate accurate labels instantly.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Printer className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Print From Anywhere</h3>
              <p className="text-gray-600">
                Send labels directly to your USB or Sunmi printer straight from your mobile—no
                desktop needed.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Prep & Cook Labels</h3>
              <p className="text-gray-600">
                Track expiry dates for ingredients and prepared meals. The app automatically
                suggests the right label template for each item.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Quick Ingredient Management</h3>
              <p className="text-gray-600">
                Add, edit, and monitor ingredients on the move. Perfect for busy kitchens with
                constant updates.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Wifi className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Offline Mode</h3>
              <p className="text-gray-600">
                Work without internet—your data syncs automatically when back online.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Label History</h3>
              <p className="text-gray-600">
                Keep track of all labels printed with timestamps and details for compliance
                purposes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative w-full bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Get started with InstaLabel mobile app in just a few simple steps.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600">
                1
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Select an Item</h3>
              <p className="text-gray-600">Choose your ingredient or menu item from the app.</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600">
                2
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Check Allergens & Details</h3>
              <p className="text-gray-600">View allergens, prep/cook info, and expiry data.</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600">
                3
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Print Labels Instantly</h3>
              <p className="text-gray-600">
                Send labels to your compatible printer right from your phone.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600">
                4
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Track & Manage</h3>
              <p className="text-gray-600">
                Keep your kitchen organized and compliant in real-time.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Screenshots Section */}
      <section className="relative w-full bg-gray-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              App Screenshots
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              See how the InstaLabel mobile app makes kitchen labelling simple and compliant.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mx-auto mb-4 h-64 w-48 rounded-2xl border-2 border-gray-200 bg-gray-100 p-4 shadow-lg">
                <div className="h-full w-full rounded-xl bg-white p-3">
                  <div className="mb-2 h-3 w-16 rounded bg-purple-600"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Label Preview Screen</h3>
              <p className="text-sm text-gray-600">
                See exactly how your labels will look before printing
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mx-auto mb-4 h-64 w-48 rounded-2xl border-2 border-gray-200 bg-gray-100 p-4 shadow-lg">
                <div className="h-full w-full rounded-xl bg-white p-3">
                  <div className="mb-2 h-3 w-20 rounded bg-green-600"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Ingredient Management</h3>
              <p className="text-sm text-gray-600">Add, edit, and monitor ingredients on the go</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="mx-auto mb-4 h-64 w-48 rounded-2xl border-2 border-gray-200 bg-gray-100 p-4 shadow-lg">
                <div className="h-full w-full rounded-xl bg-white p-3">
                  <div className="mb-2 h-3 w-16 rounded bg-blue-600"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Print Workflow</h3>
              <p className="text-sm text-gray-600">
                Simple printing process with any thermal printer
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative w-full bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              What Our Users Say
            </h2>
          </motion.div>

          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="rounded-2xl border border-purple-200 bg-purple-50 p-8 shadow-lg">
              <div className="mb-4 flex justify-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-current" />
                  ))}
                </div>
              </div>
              <blockquote className="mb-6 text-xl italic text-gray-700">
                "The InstaLabel app saves us hours every week and keeps our kitchen fully compliant.
                No training needed, and printing is instant!"
              </blockquote>
              <div className="font-semibold text-gray-900">— Head Chef, UK Restaurant</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Download Section */}
      <section className="relative w-full bg-gray-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Start Labeling Smarter Today
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Available on Android. Print compliance labels directly from your mobile device.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="https://play.google.com/store/apps/details?id=com.instalabel.co.app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-purple-600 px-8 py-4 text-lg font-semibold text-white hover:bg-purple-700"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download on Android
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <span>✓ Free 14-day trial</span>
              <span>✓ No credit card required</span>
              <span>✓ Works with any thermal printer</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative w-full bg-gray-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="mb-16 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Which printers work with the mobile app?
              </h3>
              <p className="text-gray-600">
                The InstaLabel mobile app supports all USB label printers and Sunmi devices for
                instant label printing.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-3 text-xl font-bold text-gray-900">Does it require internet?</h3>
              <p className="text-gray-600">
                No, the app works offline. Your data syncs automatically when you're back online.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Is it suitable for large kitchens?
              </h3>
              <p className="text-gray-600">
                Yes, the InstaLabel mobile app is perfect for kitchens of any size, from small cafes
                to large restaurant chains.
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg bg-white p-6 shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                Can I print labels directly from my phone?
              </h3>
              <p className="text-gray-600">
                Yes, you can send labels directly to your USB or Sunmi printer straight from your
                mobile device—no desktop needed.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
