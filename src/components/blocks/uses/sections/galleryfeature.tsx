// components/RealWorldGallery.tsx
import Image from "next/image"
import A1 from "../../../../assets/images/athome.jpg"
import A2 from "../../../../assets/images/kitchen.jpg"
import A3 from "../../../../assets/images/value.jpeg"
import A4 from "../../../../assets/images/before.png"
import A5 from "../../../../assets/images/after.png"
import A6 from "../../../../assets/images/alltime.jpeg"

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
    <section className="bg-white px-6">
      <div className="mx-auto max-w-6xl space-y-24">
        {/* Allergen Highlighting Section */}
        <div className="flex flex-col items-start gap-12 md:flex-row md:items-center">
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

        {/* Auto Styling Section */}
        <div className="flex flex-col items-start gap-12 md:flex-row md:items-center">
          <div className="order-2 md:order-1 md:w-1/2">
            <h3 className="text-3xl font-bold">Styled automatically</h3>
            <p className="text-lg text-gray-700">
              Bold. Italic. Underlined. InstaLabel does it all — instantly — for effortless
              Natasha's Law compliance.
            </p>
          </div>
          <div className="order-1 overflow-hidden rounded-xl shadow-lg md:order-2 md:w-1/2">
            <Image
              src={A1}
              alt="Styled allergens in ingredient list"
              width={500}
              height={350}
              className="object-cover"
            />
          </div>
        </div>

        {/* Real Kitchens Section */}
        <div className="text-center">
          <h3 className="mb-10 text-3xl font-bold">Designed for real kitchens</h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
              <Image src={A2} alt="Kitchen 1" width={400} height={320} className="object-cover" />
              <div className="bg-gray-100 p-4 text-sm font-semibold text-gray-800">
                Crisp, clear allergen labels — every time.
              </div>
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
              <Image src={A3} alt="Kitchen 2" width={400} height={320} className="object-cover" />
              <div className="bg-gray-100 p-4 text-sm font-semibold text-gray-800">
                Labels that survive fridge, freezer & steam.
              </div>
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
              <Image src={A4} alt="Kitchen 3" width={400} height={320} className="object-cover" />
              <div className="bg-gray-100 p-4 text-sm font-semibold text-gray-800">
                Print labels in 3 taps — phone, tablet, or laptop.
              </div>
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
              <Image src={A5} alt="Kitchen 4" width={400} height={320} className="object-cover" />
              <div className="bg-gray-100 p-4 text-sm font-semibold text-gray-800">
                Crisp, clear allergen labels — every time.
              </div>
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
              <Image src={A6} alt="Kitchen 5" width={400} height={320} className="object-cover" />
              <div className="bg-gray-100 p-4 text-sm font-semibold text-gray-800">
                Labels that survive fridge, freezer & steam.
              </div>
            </div>
            <div className="overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
              <Image src={A1} alt="Kitchen 6" width={400} height={320} className="object-cover" />
              <div className="bg-gray-100 p-4 text-sm font-semibold text-gray-800">
                Print labels in 3 taps — phone, tablet, or laptop.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-12">
        <a href="/bookdemo" className="btn-primary px-8 py-4 rounded-xl text-lg font-bold shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition">
          Book a Free Demo
        </a>
      </div>
    </section>
  )
}
