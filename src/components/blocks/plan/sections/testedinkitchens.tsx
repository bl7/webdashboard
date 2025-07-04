"use client"
import React from "react"

export const TestedInKitchens = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 py-12 sm:py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-purple-200/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-pink-200/20 blur-3xl" />
        <div className="absolute left-3/4 top-1/2 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl space-y-8 sm:space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
            <span className="mr-2">🧪</span>
            Kitchen Tested & Chef Approved
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
            Built in Kitchens, for Kitchens
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            InstaLabel was shaped on the ground — inside real prep stations, walk-ins, and catering
            fridges. Every feature was refined with real chef feedback to make label printing
            faster, simpler, and compliant.
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="relative z-10 grid gap-6 sm:gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg ring-1 ring-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl mb-4 shadow-lg">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Up and Running in Minutes
              </h3>
              <p className="text-gray-600 leading-relaxed">
                From laptop to labels in under 10 minutes. No installations. No training sessions. Just plug in and start printing.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg ring-1 ring-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white text-2xl mb-4 shadow-lg">
                👨‍🍳
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Built with Chef Feedback
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every workflow was stress-tested during real prep shifts. Fewer taps. Faster output. Designed by chefs who get it.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-lg ring-1 ring-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl mb-4 shadow-lg">
                🔒
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Compliant Out of the Box
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Labels meet Natasha's Law and EHO expectations — our testers even passed surprise inspections using InstaLabel.
              </p>
            </div>
          </div>
        </div>

        {/* Stats or Trust Indicators */}
        <div className="relative z-10 grid grid-cols-2 gap-8 sm:grid-cols-4 text-center">
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600">500+</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">UK Kitchens</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-pink-600">10min</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">Setup Time</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600">100%</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">EHO Compliant</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-green-600">24/7</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">Always Ready</div>
          </div>
        </div>
      </div>
    </section>
  )
}