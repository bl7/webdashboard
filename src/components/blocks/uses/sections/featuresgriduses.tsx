// components/RealWorldSection.tsx
import Image from "next/image"

export const FeaturesGridUses = () => {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-24">
        {/* Part 2: How It Works */}
        <div className="space-y-10 text-center">
          <h3 className="text-2xl font-semibold text-gray-800">How it works</h3>
          <div className="flex flex-col items-center justify-center gap-10 md:flex-row">
            <div className="flex max-w-[180px] flex-col items-center space-y-2">
              <div className="text-4xl">🖱️</div>
              <p className="font-medium text-gray-800">1. Tap the label</p>
              <p className="text-sm text-gray-600">Choose from Natasha’s, prep, use-by and more</p>
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
        <div className="rounded-2xl bg-gray-50 p-10">
          <h3 className="mb-6 text-center text-2xl font-semibold text-gray-800">
            Why kitchens love it
          </h3>
          <div className="grid gap-6 text-lg text-gray-800 sm:grid-cols-2">
            <div>✅ No more handwriting labels</div>
            <div>✅ Full Natasha’s Law compliance</div>
            <div>✅ Prints in under 3 seconds</div>
            <div>✅ Saves hours of prep every week</div>
            <div>✅ Runs in any browser — no app needed</div>
            <div>✅ Staff adoption in under 10 minutes</div>
          </div>
        </div>
      </div>
    </section>
  )
}
