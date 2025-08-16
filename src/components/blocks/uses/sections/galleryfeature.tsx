"use client"
// components/RealWorldGallery.tsx
import Image from "next/image"
import A2 from "../../../../assets/images/kitchen.jpg"
import A3 from "../../../../assets/images/value.jpeg"
import A4 from "../../../../assets/images/after.png"
import { motion } from "framer-motion"

const allergens = [
  "Celery",
  "Gluten",
  "Crustaceans",
  "Eggs",
  "Fish",
  "Milk",
  "Lupin",
  "Molluscs",
  "Mustard",
  "Sesame",
  "Peanuts",
  "Soybeans",
  "Sulphites",
  "Nuts",
]

const customAllergens = ["Ginger", "Strawberry"]

export const GalleryFeature = () => {
  return (
    <section className="bg-white px-2 py-12 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl space-y-16 sm:space-y-24">
        {/* Advanced Customization Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-start gap-8 sm:gap-12 md:flex-row md:items-center"
        >
          <div className="space-y-6 md:w-1/2">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full border border-purple-200 bg-purple-50 px-4 py-2">
                <span className="text-2xl">⚙️</span>
                <span className="text-sm font-medium uppercase tracking-wider text-purple-700">
                  Advanced Customization
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">
                Smart allergen detection & customization
              </h3>
            </div>
            <p className="text-lg leading-relaxed text-gray-600">
              Our intelligent system automatically detects and highlights all 14 required allergens,
              while allowing complete customization for your unique menu items and dietary
              requirements.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                <span className="text-gray-700">
                  AI-powered ingredient analysis and allergen detection
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                <span className="text-gray-700">
                  Custom allergen database for regional requirements
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                <span className="text-gray-700">
                  Flexible highlighting styles (bold, italic, underline, color)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" />
                <span className="text-gray-700">
                  Multi-language support for international kitchens
                </span>
              </div>
            </div>

            <div className="pt-4">
              <p className="mb-3 text-sm text-gray-600">
                Standard allergens automatically detected:
              </p>
              <div className="flex flex-wrap gap-2">
                {allergens.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800 shadow-sm"
                  >
                    {a}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm text-gray-600">
                Plus custom allergens like{" "}
                {customAllergens.map((item, i) => (
                  <span
                    key={item}
                    className="mx-1 inline-block rounded-full bg-pink-100 px-2 py-0.5 font-medium text-pink-700"
                  >
                    {item}
                  </span>
                ))}
                — fully customizable for your needs.
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl shadow-lg md:w-1/2">
            <Image
              src={A4}
              alt="Advanced allergen customization example"
              width={500}
              height={350}
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
