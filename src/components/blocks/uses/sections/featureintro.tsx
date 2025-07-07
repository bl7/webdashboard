// components/UseCasesSection.tsx
import Image from "next/image"
import Natasha from "../../../../assets/images/natashalaw.png"
import PPDS from "../../../../assets/images/prepandfood.jpg"
import LabelRender from "@/app/dashboard/print/LabelRender"

const defrostSampleItem = {
  uid: "demo-defrost-1",
  id: "2",
  type: "menu" as const,
  name: "Frozen Cod Fillet",
  quantity: 1,
  labelType: "prep" as const, // Use a valid labelType
  ingredients: ["Cod Fillet", "Water", "Salt"],
  printedOn: "2024-06-01",
  expiryDate: "2024-06-03"
}
const defrostAllIngredients = [
  { uuid: "b1", ingredientName: "Cod Fillet", allergens: [ { allergenName: "Fish" } ] },
  { uuid: "b2", ingredientName: "Water", allergens: [] },
  { uuid: "b3", ingredientName: "Salt", allergens: [] },
]
const defrostAllergens = ["Fish"]

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

        {/* See Your Labels in Action grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Ingredient Label */}
          <div className="flex flex-col items-center">
            <LabelRender
              item={defrostSampleItem}
              expiry={defrostSampleItem.expiryDate}
              useInitials={false}
              selectedInitial={""}
              allergens={defrostAllergens}
              labelHeight="80mm"
              allIngredients={defrostAllIngredients}
            />
            <span className="mt-2 text-xs text-gray-500">Defrost Label</span>
          </div>
          {/* Prep Label */}
          <div className="flex flex-col items-center">
            <LabelRender
              item={defrostSampleItem}
              expiry={defrostSampleItem.expiryDate}
              useInitials={false}
              selectedInitial={""}
              allergens={defrostAllergens}
              labelHeight="80mm"
              allIngredients={defrostAllIngredients}
            />
            <span className="mt-2 text-xs text-gray-500">Defrost Label</span>
          </div>
          {/* Cook Label */}
          <div className="flex flex-col items-center">
            <LabelRender
              item={defrostSampleItem}
              expiry={defrostSampleItem.expiryDate}
              useInitials={false}
              selectedInitial={""}
              allergens={defrostAllergens}
              labelHeight="80mm"
              allIngredients={defrostAllIngredients}
            />
            <span className="mt-2 text-xs text-gray-500">Defrost Label</span>
          </div>
          {/* Defrost Label (replaces PPDS) */}
          <div className="flex flex-col items-center">
            <LabelRender
              item={defrostSampleItem}
              expiry={defrostSampleItem.expiryDate}
              useInitials={false}
              selectedInitial={""}
              allergens={defrostAllergens}
              labelHeight="80mm"
              allIngredients={defrostAllIngredients}
            />
            <span className="mt-2 text-xs text-gray-500">Defrost Label</span>
          </div>
        </div>
        {/* Label descriptions on the right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ...other label descriptions... */}
          <div className="flex items-start gap-4 rounded-xl bg-white/60 p-4 shadow-sm ring-1 ring-purple-100 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-blue-400 text-white shadow-sm">
              {/* Icon for Defrost */}
              <span className="text-lg">❄️</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Defrost Labels</h4>
              <p className="text-gray-600 text-sm">Track defrost dates, times, and staff for frozen foods. Ensure food safety and compliance with clear, automated defrost labeling.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}