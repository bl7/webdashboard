// components/UseCasesSection.tsx
import Image from "next/image"
import Natasha from "../../../../assets/images/athome.jpg"
import PPDS from "../../../../assets/images/deliver.jpg"
export const FeatureIntro = () => {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-32">
        {/* Section Title */}

        {/* Block 1 – Natasha's Law */}
        <div className="flex flex-col items-center gap-12 md:flex-row">
          <div className="w-full md:w-1/2">
            <Image
              src={Natasha}
              alt="Natasha's Law Label"
              width={600}
              height={400}
              className="rounded-2xl border shadow-xl"
            />
          </div>
          <div className="w-full space-y-4 md:w-1/2">
            <h3 className="flex items-center gap-2 text-2xl font-semibold text-blue-700">
              <span>📋</span> Natasha’s Law Labels
            </h3>
            <p className="text-gray-700">
              Instantly print fully compliant allergen labels with key ingredients highlighted in{" "}
              <strong>bold</strong>, <em>italic</em> or <u>underline</u>. Perfect for pre-packed
              items, grab-and-go, and made-to-order food.
            </p>
            <ul className="list-inside list-disc space-y-1 pt-2 text-gray-800">
              <li>Supports all 14 required allergens</li>
              <li>Editable templates stored in the cloud</li>
              <li>Mobile-friendly reprint from any device</li>
              <li>No training needed — print in 3 taps</li>
            </ul>
          </div>
        </div>

        {/* Block 2 – Prep Labels */}
        <div className="flex flex-col items-center gap-12 md:flex-row-reverse">
          <div className="w-full md:w-1/2">
            <Image
              src={PPDS}
              alt="Prep Label Example"
              width={600}
              height={400}
              className="rounded-2xl border shadow-xl"
            />
          </div>
          <div className="w-full space-y-4 md:w-1/2">
            <h3 className="flex items-center gap-2 text-2xl font-semibold text-orange-600">
              <span>🥡</span> Prep & Food Storage Labels
            </h3>
            <p className="text-gray-700">
              Stay in control of food safety with fast, customisable labels for every stage — prep,
              defrost, use-by, and more. Designed to last in fridges, freezers, and busy kitchens.
            </p>
            <ul className="list-inside list-disc space-y-1 pt-2 text-gray-800">
              <li>Prebuilt formats: use-by, open, thawed</li>
              <li>Durable labels: water, heat & freezer-safe</li>
              <li>Smart reprint for daily use items</li>
              <li>Helps meet HACCP & FSA requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
