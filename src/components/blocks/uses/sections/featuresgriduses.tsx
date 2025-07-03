// components/RealWorldSection.tsx
import Image from "next/image"

export const FeaturesGridUses = () => {
  return (
    <section className="bg-white px-2 sm:px-6 py-12 sm:py-24">
      <div className="mx-auto max-w-6xl space-y-16 sm:space-y-24">
        {/* Part 2: How It Works */}
        <div className="space-y-8 sm:space-y-10 text-center">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">How it works</h3>
          <div className="flex flex-col items-center justify-center gap-6 sm:gap-10 md:flex-row">
            <div className="flex max-w-[180px] flex-col items-center space-y-2">
              <div className="text-4xl">🖱️</div>
              <p className="font-medium text-gray-800">1. Tap the label</p>
              <p className="text-sm text-gray-600">Choose from Natasha's, prep, use-by and more</p>
            </div>
            <div className="flex max-w-[180px] flex-col items-center space-y-2">
              <div className="text-4xl">✏️</div>
              <p className="font-medium text-gray-800">2. Edit if needed</p>
              <p className="text-sm text-gray-600">Adjust allergens, ingredients, or shelf life</p>
            </div>
            <div className="flex max-w-[180px] flex-col items-center space-y-2">
              <div className="text-4xl">🖨️</div>
              <p className="font-medium text-gray-800">3. Print instantly</p>
              <p className="text-sm text-gray-600">
                One-tap printing from any phone, tablet, or laptop
              </p>
            </div>
          </div>
        </div>

        {/* Part 3: Outcomes / Benefits */}
        <div className="rounded-2xl bg-gray-50 p-6 sm:p-10">
          <h3 className="mb-4 sm:mb-6 text-center text-xl sm:text-2xl font-semibold text-gray-800">
            Why kitchens love it
          </h3>
          <div className="grid gap-4 sm:gap-6 text-base sm:text-lg text-gray-800 sm:grid-cols-2">
            <div>✅ No more handwriting labels</div>
            <div>✅ Full Natasha's Law compliance</div>
            <div>✅ Prints in under 3 seconds</div>
            <div>✅ Saves hours of prep every week</div>
            <div>✅ Runs in any browser — no app needed</div>
            <div>✅ Staff adoption in under 10 minutes</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8 sm:mt-12">
        <a href="/bookdemo" className="btn-primary w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition">
          Book a Free Demo
        </a>
      </div>
    </section>
  )
}
