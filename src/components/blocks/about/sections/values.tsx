import React from "react"
import { ShieldCheck, TrendingUp, Leaf, Users } from "lucide-react"

const missionText =
  "Empowering kitchens worldwide with smart, easy-to-use labeling solutions that prioritize food safety, streamline operations, and drive sustainable growth."

const visionPoints = [
  {
    icon: <ShieldCheck className="h-7 w-7 text-primary" />,
    title: "Prioritize Food Safety",
    description:
      "Deliver innovative labeling that safeguards health and ensures compliance across all kitchens.",
  },
  {
    icon: <TrendingUp className="h-7 w-7 text-primary" />,
    title: "Drive Operational Efficiency",
    description:
      "Equip kitchens with tools that simplify processes, reduce waste, and boost productivity.",
  },
  {
    icon: <Leaf className="h-7 w-7 text-primary" />,
    title: "Champion Sustainability",
    description: "Promote eco-friendly practices through smarter inventory and expiry management.",
  },
  {
    icon: <Users className="h-7 w-7 text-primary" />,
    title: "Ensure Accessibility",
    description:
      "Make high-quality labeling technology available to kitchens of all sizes and locations.",
  },
]

const valuesPoints = [
  {
    icon: <ShieldCheck className="h-7 w-7 text-primary" />,
    title: "Integrity",
    description:
      "We act with transparency and reliability, earning trust through every interaction.",
  },
  {
    icon: <TrendingUp className="h-7 w-7 text-primary" />,
    title: "Innovation",
    description: "We relentlessly improve our solutions to meet evolving kitchen needs.",
  },
  {
    icon: <Leaf className="h-7 w-7 text-primary" />,
    title: "Sustainability",
    description: "We commit to reducing waste and protecting the environment in all we do.",
  },
  {
    icon: <Users className="h-7 w-7 text-primary" />,
    title: "Inclusivity",
    description:
      "We believe every kitchen deserves access to the best tools, regardless of size or budget.",
  },
]

export const Values = () => {
  return (
    <section className="bg-gradient-to-b from-primary/10 to-white py-24">
      <div className="container mx-auto max-w-6xl px-6">
        {/* Mission */}
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900">Our Mission</h1>
          <p className="text-xl leading-relaxed text-gray-700">{missionText}</p>
        </div>

        {/* Vision & Values */}
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          {/* Vision */}
          <div>
            <h2 className="mb-12 border-l-4 border-primary pl-5 text-3xl font-bold text-gray-900">
              Our Vision
            </h2>
            <ul className="space-y-12">
              {visionPoints.map(({ icon, title, description }, idx) => (
                <li key={idx} className="flex space-x-6">
                  <div className="flex-shrink-0">{icon}</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
                    <p className="mt-2 text-lg leading-relaxed text-gray-600">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Values */}
          <div>
            <h2 className="mb-12 border-l-4 border-primary pl-5 text-3xl font-bold text-gray-900">
              Our Values
            </h2>
            <ul className="space-y-12">
              {valuesPoints.map(({ icon, title, description }, idx) => (
                <li key={idx} className="flex space-x-6">
                  <div className="flex-shrink-0">{icon}</div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
                    <p className="mt-2 text-lg leading-relaxed text-gray-600">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
