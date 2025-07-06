'use client'
import { FaFileImport, FaCheckCircle,  FaArrowRight } from "react-icons/fa"
import {LuZap} from "react-icons/lu"
import { Button } from "@/components/ui"
import { motion } from "framer-motion"
import Link from "next/link"

export const BulkImportFeatureSection = () => {
  return (
    <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-24 px-4 sm:px-6 md:px-12 lg:px-16">
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
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200">
              <LuZap className="mr-2 h-4 w-4" />
              Fast Setup
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl">
                <FaFileImport className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 sm:text-4xl">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Bulk Import
                </span>
                <br />
                <span className="text-gray-900">Gets You Started Fast</span>
              </h3>
            </div>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Upload your menu, ingredients, and allergens in one go. Our import tool checks for duplicates 
              and gives you a clear summary before you save—so you can get up and running in minutes.
            </p>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FaCheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Import from Excel or CSV</h4>
              </div>
              <p className="text-gray-600">Upload your existing data in any format and we'll handle the rest.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FaCheckCircle className="h-5 w-5 text-purple-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Smart Duplicate Detection</h4>
              </div>
              <p className="text-gray-600">Instantly see new, existing, and skipped items with clear summaries.</p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="pt-6"
          >
            <Link href="/features">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300">
                Learn More About Features
                <FaArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 