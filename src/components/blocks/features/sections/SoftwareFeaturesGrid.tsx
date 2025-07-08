import React from "react"
import { Cloud, CheckCircle, Settings, Repeat, Users, ShieldCheck, Zap } from "lucide-react"

const softwareFeatures = [
  { icon: <CheckCircle className="h-7 w-7 text-green-600" />, title: "Label Printing Made Easy", description: "Print EHO and Natasha’s Law compliant labels in seconds—no handwriting needed." },
  { icon: <ShieldCheck className="h-7 w-7 text-purple-600" />, title: "Compliance Built In", description: "Stay inspection-ready with built-in compliance for food safety laws." },
  { icon: <Zap className="h-7 w-7 text-yellow-500" />, title: "Super-Fast Setup", description: "Works straight out of the box—get started in minutes." },
  { icon: <Cloud className="h-7 w-7 text-blue-600" />, title: "Cloud Storage", description: "Unlimited saved products, secure AWS cloud backup, instant reprints from any device." },
  { icon: <Repeat className="h-7 w-7 text-pink-600" />, title: "Easy Label Re-Order", description: "Re-order labels in-app with one click—free shipping, always." },
  { icon: <Settings className="h-7 w-7 text-gray-600" />, title: "No Training Needed", description: "Simple interface—anyone can use it after a 60-second briefing." },
  { icon: <Users className="h-7 w-7 text-indigo-600" />, title: "Easy Scalability", description: "Add devices and share product info across locations instantly." },
]

export const SoftwareFeaturesGrid = () => (
  <section className="py-20 bg-white">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center px-4 lg:px-0">
      {/* Features List */}
      <div className="flex-1 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Software That Makes Labeling Effortless
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Our software is built for hospitality—compliant, fast, and easy for any staff member to use.
        </p>
        <ul className="space-y-5">
          {softwareFeatures.map((item, i) => (
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
        <img src="/assets/images/feature.png" alt="Software screenshot" className="rounded-xl shadow-lg max-w-xs w-full" />
      </div>
    </div>
  </section>
)

export default SoftwareFeaturesGrid; 