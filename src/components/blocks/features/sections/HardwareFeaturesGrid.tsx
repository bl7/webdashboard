import React from "react"
import { Printer, Wifi, Smartphone, Barcode, Flashlight, Shield } from "lucide-react"
import Image from "next/image"

const hardwareFeatures = [
  { icon: <Printer className="h-7 w-7 text-purple-600" />, title: "Integrated Printer", description: "Prints directly onto thermal labels—no ink or cartridges needed." },
  { icon: <Wifi className="h-7 w-7 text-blue-600" />, title: "Remote Connectivity", description: "WiFi and 4G SIM support for use anywhere—ideal for events and outdoor catering." },
  { icon: <Smartphone className="h-7 w-7 text-green-600" />, title: "Wipeclean Touchscreen", description: "5.99\" HD+ display, easy to clean and hygienic for kitchen use." },
  { icon: <Barcode className="h-7 w-7 text-pink-600" />, title: "2D Barcode Scanner", description: "Instantly reprint labels—scan barcodes even if damaged or stained." },
  { icon: <Flashlight className="h-7 w-7 text-yellow-500" />, title: "In-built Flashlight", description: "Find items in walk-in fridges or low light with a super-bright flashlight." },
  { icon: <Shield className="h-7 w-7 text-gray-600" />, title: "Rugged & Hygienic", description: "Protective rubber surround, drop-tested, built for hospitality environments." },
]

export const HardwareFeaturesGrid = () => (
  <section className="py-20 bg-white">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center px-4 lg:px-0">
      {/* Features List */}
      <div className="flex-1 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Hardware Built for Real Kitchens
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The InstaLabel device is designed by kitchen staff for commercial kitchens—rugged, hygienic, and ready for anything.
        </p>
        <ul className="space-y-5">
          {hardwareFeatures.map((item, i) => (
            <li key={i} className="flex items-start gap-4">
              <span>{item.icon}</span>
              <div>
                <div className="font-semibold text-gray-900 text-base">{item.title}</div>
                <div className="text-gray-600 text-sm">{item.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Image */}
      <div className="flex-1 flex justify-center">
        <Image 
          src="/assets/images/deviceinhand.png" 
          alt="Device in hand" 
          width={800}
          height={800}
          className="rounded-xl shadow-lg max-w-xs w-full" 
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  </section>
)

export default HardwareFeaturesGrid; 