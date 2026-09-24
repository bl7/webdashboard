'use client'
import { FaFileImport, FaCheckCircle,  FaArrowRight, FaClock, FaUsers, FaShieldAlt } from "react-icons/fa"
import {LuZap} from "react-icons/lu"
import { Button } from "@/components/ui"
import { motion } from "framer-motion"
import Link from "next/link"

export const BulkImportFeatureSection = () => {
  return (
    <section className="bg-mkt-canvas py-24 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-8"
        >
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full bg-mkt-canvas px-4 py-2 text-sm font-semibold text-mkt-ink ring-1 ring-mkt-steel1">
              <LuZap className="mr-2 h-4 w-4" />
              Setup in 5 Minutes
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-mkt-canvas p-4 rounded-xl">
                <LuZap className="h-8 w-8 text-mkt-teal" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 sm:text-4xl">
                <span className="text-mkt-ink">
                  From Setup to
                </span>
                <br />
                <span className="text-gray-900">Printing in Minutes</span>
              </h3>
            </div>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              No complex setup required. Upload your existing menu data, connect your printer, and start 
              printing professional labels immediately. Most kitchens are up and running in under 5 minutes.
            </p>
          </div>

          {/* Setup Process */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-xl p-6 border border-mkt-steel1 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <LuZap className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">1. Upload Your Data</h4>
              </div>
              <p className="text-gray-600">Import your menu, ingredients, and allergens from Excel, CSV, or enter manually.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-mkt-steel1 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FaCheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">2. Connect Printer</h4>
              </div>
              <p className="text-gray-600">Plug in your USB label printer or connect via Bluetooth. Computer: a label printer installed on Windows or macOS, through PrintBridge. Android: MUNBYN RW411B or Born4Ship DB403.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-mkt-steel1 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-mkt-canvas p-2 rounded-lg">
                  <LuZap className="h-5 w-5 text-mkt-teal" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">3. Start Printing</h4>
              </div>
              <p className="text-gray-600">Select items, tap print, and get professional labels instantly.</p>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-mkt-steel1">
              <FaClock className="h-6 w-6 text-mkt-teal" />
              <div className="text-left">
                <div className="font-bold text-gray-900">5-Minute Setup</div>
                <div className="text-sm text-gray-600">From upload to printing</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-mkt-steel1">
              <FaUsers className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <div className="font-bold text-gray-900">Zero Training</div>
                <div className="text-sm text-gray-600">Intuitive interface</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-mkt-steel1">
              <FaShieldAlt className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <div className="font-bold text-gray-900">Instant Compliance</div>
                <div className="text-sm text-gray-600">All labels meet standards</div>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="pt-6 space-y-4"
          >
            <Link href="/bookdemo">
              <Button className="border-0 px-8 py-4 text-lg font-semibold text-white shadow-lg" style={{ backgroundColor: "#142124", backgroundImage: "none" }}>
                See Setup Demo
                <FaArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="/features">
              <Button variant="outline" className="border-2 border-mkt-steel1 text-mkt-ink hover:bg-mkt-canvas hover:text-mkt-ink px-6 py-3 text-lg font-semibold transition-all duration-300">
                View All Features
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 