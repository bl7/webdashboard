import React from "react"
import { Clock, ClipboardList, ShieldCheck } from "lucide-react"

export const WhyInstaLabel = () => {
  return (
    <section className="bg-white px-2 sm:px-6 py-10 sm:py-20">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 sm:text-5xl">Why InstaLabel?</h2>
        <p className="mx-auto mt-3 sm:mt-4 max-w-2xl sm:max-w-3xl text-base sm:text-lg text-gray-600">
          Born from real kitchen challenges, designed to simplify and secure your food operations.
        </p>

        <div className="mt-8 sm:mt-16 grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col items-center text-center">
            <Clock size={48} className="mb-6 text-primary" />
            <h3 className="text-xl font-semibold text-gray-900">Save Time & Reduce Waste</h3>
            <p className="mt-3 max-w-xs text-gray-600">
              Automate ingredient labeling and expiry tracking, streamlining kitchen workflows and
              cutting down waste.
            </p>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col items-center text-center">
            <ClipboardList size={48} className="mb-6 text-primary" />
            <h3 className="text-xl font-semibold text-gray-900">Simplify Compliance</h3>
            <p className="mt-3 max-w-xs text-gray-600">
              Ensure accurate allergen and ingredient information with easy-to-use smart labels that
              meet safety standards.
            </p>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center text-center">
            <ShieldCheck size={48} className="mb-6 text-primary" />
            <h3 className="text-xl font-semibold text-gray-900">Boost Food Safety</h3>
            <p className="mt-3 max-w-xs text-gray-600">
              Minimize risks in your kitchen with reliable tracking that protects your customers and
              your reputation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
