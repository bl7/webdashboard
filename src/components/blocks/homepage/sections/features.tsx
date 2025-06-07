import React from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  "Automated expiry and allergen labeling",
  "Natasha’s Law & EHO compliant, always up-to-date",
  "Cloud-based management across all your locations",
  "Touchscreen device: rugged, hygienic, and easy to use",
]

export const Feature = () => (
  <section className="relative bg-gradient-to-b from-primary/10 to-white py-24">
    <div className="container flex flex-col-reverse items-center justify-between gap-16 px-4 md:px-8 lg:flex-row">
      {/* Text Block */}
      <div className="w-full lg:w-1/2">
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          All-In-One Food Labeling Solution
        </h2>
        <p className="mb-8 text-lg text-gray-600">
          Transform your kitchen with InstaLabel—trusted by 1,500+ UK businesses for effortless
          compliance, expiry tracking, and efficiency.
        </p>
        <ul className="mb-8 space-y-4">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-base font-medium text-gray-800 md:text-lg">{feature}</span>
            </li>
          ))}
        </ul>
        <Button size="lg" className="mt-2 bg-primary text-white hover:bg-primary/90">
          See InstaLabel in Action
        </Button>
      </div>

      {/* Video Block with fixed aspect ratio */}
      <div className="flex w-full justify-center lg:w-1/2">
        <div
          className="relative w-full max-w-md"
          style={{ paddingTop: "40%" }} // Controls height relative to width (e.g. 40% = 2.5:1 aspect ratio)
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 h-full w-full rounded-2xl object-cover"
          >
            <source src="/printing.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  </section>
)
