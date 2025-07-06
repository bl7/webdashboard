// components/RealWorldGallery.tsx
import Image from "next/image"
import A2 from "../../../../assets/images/kitchen.jpg"
import A3 from "../../../../assets/images/value.jpeg"
import A4 from "../../../../assets/images/before.png"

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
    <section className="bg-white px-2 sm:px-6 py-12 sm:py-24">
      <div className="mx-auto max-w-6xl space-y-16 sm:space-y-24">
        {/* Allergen Highlighting Section */}
        <div className="flex flex-col items-start gap-8 sm:gap-12 md:flex-row md:items-center">
          <div className="space-y-6 md:w-1/2">
            <h3 className="text-3xl font-bold">Allergens. Auto-highlighted.</h3>
            <p className="text-lg text-gray-700">
              We cover all <strong>14 required allergens</strong> — no hunting, no forgetting.
              InstaLabel highlights them clearly, every time.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {allergens.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800 shadow-sm"
                >
                  {a}
                </span>
              ))}
            </div>

            <p className="text-md pt-4 text-gray-700">
              Want more? Add your own allergens like{" "}
              {customAllergens.map((item, i) => (
                <span
                  key={item}
                  className="mx-1 inline-block rounded-full bg-pink-100 px-2 py-0.5 font-medium text-pink-700"
                >
                  {item}
                </span>
              ))}
              — we support it all.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl shadow-lg md:w-1/2">
            <Image
              src={A4}
              alt="Allergen highlighting example"
              width={500}
              height={350}
              className="object-cover"
            />
          </div>
        </div>

      </div>
      <div className="flex justify-center mt-8 sm:mt-12">
        <a href="/register">
          <button className="bg-primary px-8 py-4 text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-semibold rounded-xl w-full sm:w-auto">
            Start Free Trial
          </button>
        </a>
      </div>
    </section>
  )
}
