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
        {/* Advanced Customization Section */}
        <div className="flex flex-col items-start gap-8 sm:gap-12 md:flex-row md:items-center">
          <div className="space-y-6 md:w-1/2">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-full border border-purple-200">
                <span className="text-2xl">⚙️</span>
                <span className="text-sm font-medium text-purple-700 uppercase tracking-wider">Advanced Customization</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Smart allergen detection & customization</h3>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our intelligent system automatically detects and highlights all 14 required allergens, 
              while allowing complete customization for your unique menu items and dietary requirements.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700">AI-powered ingredient analysis and allergen detection</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700">Custom allergen database for regional requirements</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700">Flexible highlighting styles (bold, italic, underline, color)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700">Multi-language support for international kitchens</span>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-600 mb-3">Standard allergens automatically detected:</p>
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
              
              <p className="text-sm text-gray-600 mt-4">
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
        </div>

        {/* Technical Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Lightning Fast</h4>
            <p className="text-gray-600 text-sm">Print professional labels in under 3 seconds with our optimized system</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Secure & Reliable</h4>
            <p className="text-gray-600 text-sm">Enterprise-grade security with 99.9% uptime and automatic backups</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Smart Learning</h4>
            <p className="text-gray-600 text-sm">AI continuously improves allergen detection and label optimization</p>
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
