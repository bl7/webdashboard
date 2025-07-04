import React from "react"
import { Clock, ClipboardList, ShieldCheck } from "lucide-react"

export const WhyInstaLabel = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-purple-50/20 px-2 sm:px-6 py-12 sm:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-20">
         
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Why InstaLabel?
          </h2>
          <p className="mx-auto max-w-3xl text-lg sm:text-xl text-gray-600 leading-relaxed">
            Born from real kitchen challenges, designed to simplify and secure your food operations.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-3">
          {/* Card 1 - Save Time */}
          <div className="group relative">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-500 hover:bg-white/80 hover:backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-2">
              {/* Icon with gradient background */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl scale-150"></div>
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-2xl transform group-hover:rotate-3 transition-all duration-300">
                  <Clock size={40} />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                Save Time & Reduce Waste
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Automate ingredient labeling and expiry tracking, streamlining kitchen workflows and
                cutting down waste.
              </p>
              
              {/* Floating stat */}
              <div className="mt-6 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 ring-1 ring-blue-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                50+ labels saved daily
              </div>
            </div>
          </div>

          {/* Card 2 - Compliance */}
          <div className="group relative">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-500 hover:bg-white/80 hover:backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-2">
              {/* Icon with gradient background */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl scale-150"></div>
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl transform group-hover:rotate-3 transition-all duration-300">
                  <ClipboardList size={40} />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                Simplify Compliance
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Ensure accurate allergen and ingredient information with easy-to-use smart labels that
                meet safety standards.
              </p>
              
              {/* Floating stat */}
              <div className="mt-6 inline-flex items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 ring-1 ring-purple-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                HACCP & EHO Compliant
              </div>
            </div>
          </div>

          {/* Card 3 - Food Safety */}
          <div className="group relative">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-500 hover:bg-white/80 hover:backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-2">
              {/* Icon with gradient background */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-xl scale-150"></div>
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-2xl transform group-hover:rotate-3 transition-all duration-300">
                  <ShieldCheck size={40} />
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                Boost Food Safety
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                Minimize risks in your kitchen with reliable tracking that protects your customers and
                your reputation.
              </p>
              
              {/* Floating stat */}
              <div className="mt-6 inline-flex items-center rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 ring-1 ring-green-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                500+ Kitchens Trust Us
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA/Trust Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-white shadow-lg">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Trusted by 500+ restaurants</span> • 
              <span className="ml-1">HACCP Compliant</span> • 
              <span className="ml-1">No training required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}