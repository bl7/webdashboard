// components/UseCasesSection.tsx
import Image from "next/image"
import Natasha from "../../../../assets/images/natashalaw.png"
import PPDS from "../../../../assets/images/prepandfood.jpg"

export const FeatureIntro = () => {
  return (
    <section className="px-2 sm:px-6 -mt-8 sm:-mt-16 py-12 sm:py-16 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.05),transparent_50%)]" />
      
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
              <div className="inline-flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                <span className="text-2xl">📋</span>
                <span className="text-sm font-medium text-blue-700 uppercase tracking-wider">Compliance Made Simple</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                Natasha's Law Labels
              </h3>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Instantly print fully compliant allergen labels with key ingredients highlighted in{" "}
              <strong className="text-blue-600">bold</strong>, <em className="text-blue-600">italic</em> or{" "}
              <u className="text-blue-600">underline</u>. Perfect for pre-packed items, grab-and-go, and made-to-order food.
            </p>
            <div className="grid grid-cols-1 gap-3 pt-4">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Supports all 14 required allergens</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Editable templates stored in the cloud</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Mobile-friendly reprint from any device</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">No training needed — print in 3 taps</span>
              </div>
            </div>
          </div>

          {/* Text 2 – Prep Labels */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                <span className="text-2xl">🥡</span>
                <span className="text-sm font-medium text-orange-700 uppercase tracking-wider">Kitchen Control</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                Prep & Food Storage Labels
              </h3>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Stay in control of food safety with fast, customisable labels for every stage — prep,
              defrost, use-by, and more. Designed to last in fridges, freezers, and busy kitchens.
            </p>
            <div className="grid grid-cols-1 gap-3 pt-4">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Prebuilt formats: use-by, open, thawed</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Durable labels: water, heat & freezer-safe</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Smart reprint for daily use items</span>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100">
                <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 text-sm">Helps meet HACCP & FSA requirements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}