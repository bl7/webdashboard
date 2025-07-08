// components/UseCasesSection.tsx
import Image from "next/image"
import Natasha from "../../../../assets/images/natashalaw.png"
import PPDS from "../../../../assets/images/prepandfood.jpg"

export const FeatureIntro = () => {
  return (
    <section className="px-2 sm:px-6 -mt-8 sm:-mt-16 py-12 sm:py-16  relative overflow-hidden">
    <div className="pointer-events-none absolute top-0 left-0 w-full h-48 z-0" style={{background: 'linear-gradient(to bottom, #fff 0%, #fff 50%, rgba(255,255,255,0) 100%)'}} />
    <div className="mx-auto max-w-6xl space-y-12 relative">
        {/* Images Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image 1 – Natasha's Law */}
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 group-hover:shadow-2xl transition-all duration-500">
              <div className="relative w-full aspect-[3/2] h-64 sm:h-80 lg:h-96">
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
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 group-hover:shadow-2xl transition-all duration-500">
              <div className="relative w-full aspect-[3/2] h-64 sm:h-80 lg:h-96">
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
        </div>

        {/* Text Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Text 1 – Natasha's Law */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
                <span className="text-2xl">📋</span>
                <span className="text-sm font-medium text-purple-700 uppercase tracking-wider">Regulatory Compliance</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                Natasha's Law Compliance
              </h3>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Stay ahead of food safety regulations with automated allergen tracking and compliant labeling. 
              InstaLabel ensures your kitchen meets all Natasha's Law requirements without the complexity.
            </p>
            <div className="grid grid-cols-1 gap-3 pt-4">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Automatic allergen detection from ingredient database</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Real-time compliance monitoring and reporting</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Audit-ready documentation for EHO inspections</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Future-proof against evolving food safety regulations</span>
              </div>
            </div>
          </div>

          {/* Text 2 – HACCP & Food Safety */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                <span className="text-2xl">🛡️</span>
                <span className="text-sm font-medium text-orange-700 uppercase tracking-wider">Food Safety</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                HACCP & Food Safety Management
              </h3>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Transform your kitchen's food safety practices with intelligent labeling that tracks every stage 
              of food preparation, from receiving to service, ensuring complete traceability.
            </p>
            <div className="grid grid-cols-1 gap-3 pt-4">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Complete food traceability from prep to plate</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Automated expiry date management and alerts</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Digital HACCP records for compliance audits</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Reduce food waste with smart expiry tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}