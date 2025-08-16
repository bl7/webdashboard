"use client"
// components/UseCasesSection.tsx
import Image from "next/image"
import Natasha from "../../../../assets/images/natashalaw.png"
import PPDS from "../../../../assets/images/after.png"
import { motion } from "framer-motion"

export const FeatureIntro = () => {
  return (
    <section className="relative -mt-8 overflow-hidden px-2 py-12 sm:-mt-16 sm:px-6 sm:py-16">
      <div
        className="pointer-events-none absolute left-0 top-0 z-0 h-48 w-full"
        style={{
          background: "linear-gradient(to bottom, #fff 0%, #fff 50%, rgba(255,255,255,0) 100%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl space-y-12">
        {/* Images Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12"
        >
          {/* Image 1 – Natasha's Law */}
          <div className="group relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 blur-xl transition-all duration-700 group-hover:opacity-100" />
            <div className="relative rounded-2xl border border-white/20 bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:shadow-2xl">
              <div className="relative aspect-[3/2] h-64 w-full sm:h-80 lg:h-96">
                <Image
                  src={Natasha}
                  alt="Natasha's Law Label"
                  fill
                  className="rounded-xl object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
              </div>
            </div>
          </div>

          {/* Image 2 – Prep Labels */}
          <div className="group relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-orange-600/20 to-red-600/20 opacity-0 blur-xl transition-all duration-700 group-hover:opacity-100" />
            <div className="relative rounded-2xl border border-white/20 bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all duration-500 group-hover:shadow-2xl">
              <div className="relative aspect-[3/2] h-64 w-full sm:h-80 lg:h-96">
                <Image
                  src={PPDS}
                  alt="Prep Label Example"
                  fill
                  className="rounded-xl object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Text Content Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12"
        >
          {/* Text 1 – Natasha's Law */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full border border-purple-200 bg-purple-50 px-4 py-2">
                <span className="text-2xl">📋</span>
                <span className="text-sm font-medium uppercase tracking-wider text-purple-700">
                  Regulatory Compliance
                </span>
              </div>
              <h3 className="text-3xl font-bold leading-tight text-gray-900">
                Natasha's Law Compliance
              </h3>
            </div>
            <p className="text-lg leading-relaxed text-gray-600">
              Stay ahead of food safety regulations with automated allergen tracking and compliant
              labeling. InstaLabel ensures your kitchen meets all Natasha's Law requirements without
              the complexity.
            </p>
            <div className="grid grid-cols-1 gap-3 pt-4">
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white/60 p-3 backdrop-blur-sm">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-700">
                  Automatic allergen detection from ingredient database
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white/60 p-3 backdrop-blur-sm">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-700">
                  Real-time compliance monitoring and reporting
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white/60 p-3 backdrop-blur-sm">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-700">
                  Audit-ready documentation for EHO inspections
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white/60 p-3 backdrop-blur-sm">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                <span className="text-sm text-gray-700">
                  Future-proof against evolving food safety regulations
                </span>
              </div>
            </div>
          </div>

          {/* Text 2 – HACCP & Food Safety */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full border border-orange-200 bg-orange-50 px-4 py-2">
                <span className="text-2xl">🛡️</span>
                <span className="text-sm font-medium uppercase tracking-wider text-orange-700">
                  Food Safety
                </span>
              </div>
              <h3 className="text-3xl font-bold leading-tight text-gray-900">
                HACCP & Food Safety Management
              </h3>
            </div>
            <p className="text-lg leading-relaxed text-gray-600">
              Transform your kitchen's food safety practices with intelligent labeling that tracks
              every stage of food preparation, from receiving to service, ensuring complete
              traceability.
            </p>
            <div className="grid grid-cols-1 gap-3 pt-4">
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white/60 p-3 backdrop-blur-sm">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-700">
                  Complete food traceability from prep to plate
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white/60 p-3 backdrop-blur-sm">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-700">
                  Automated expiry date management and alerts
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white/60 p-3 backdrop-blur-sm">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-700">
                  Digital HACCP records for compliance audits
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white/60 p-3 backdrop-blur-sm">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-700">
                  Reduce food waste with smart expiry tracking
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
