"use client"
import React from "react"

export const TestedInKitchens = () => {
  return (
    <section className="relative bg-white px-4 sm:px-6 py-12 sm:py-16">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative mx-auto max-w-7xl space-y-16 sm:space-y-20">
        {/* Heading */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
            <span className="mr-2">🧪</span>
            Kitchen Tested & Chef Approved
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Built in Kitchens, for Kitchens
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            InstaLabel was shaped on the ground — inside real prep stations, walk-ins, and catering
            fridges. Every feature was refined with real chef feedback to make label printing
            faster, simpler, and compliant.
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="group">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full hover:border-purple-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Up and Running in Minutes
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    From laptop to labels in under 10 minutes. No installations. No training sessions. Just plug in and start printing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full hover:border-purple-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                  <span className="text-2xl">👨‍🍳</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Built with Chef Feedback
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Every workflow was stress-tested during real prep shifts. Fewer taps. Faster output. Designed by chefs who get it.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full hover:border-purple-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-200">
                  <span className="text-2xl">🔒</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Compliant Out of the Box
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Labels meet Natasha's Law and EHO expectations — our testers even passed surprise inspections using InstaLabel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats or Trust Indicators */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-center max-w-4xl mx-auto">
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600">500+</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">UK Kitchens</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600">10min</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">Setup Time</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600">100%</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">EHO Compliant</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl sm:text-4xl font-bold text-purple-600">24/7</div>
            <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">Always Ready</div>
          </div>
        </div>
      </div>
    </section>
  )
}