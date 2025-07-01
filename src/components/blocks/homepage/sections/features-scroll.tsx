import Marquee from "@/lib/marqee"
import React from "react"
import { Button } from "@/components/ui"

const foodBusinesses = [
  { name: "Restaurant A", logo: "/noodle.png" },
  { name: "Cafe B", logo: "/noodle.png" },
  { name: "Catering C", logo: "/noodle.png" },
  { name: "Food Truck D", logo: "/noodle.png" },
  { name: "Bakery E", logo: "/noodle.png" },
  // add your logos here
]

export const TrustedBySection = () => {
  return (
    <section className="bg-gray-50 px-4 py-12 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto text-center">
        <h3 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Who We Serve</h3>
        <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground sm:text-lg md:text-xl">
          From cloud kitchens to national brands, InstaLabel makes food safety easy.
        </p>

        <Marquee speed={30} pauseOnHover>
          <div className="flex items-center gap-20 overflow-hidden px-10">
            {foodBusinesses.map(({ name, logo }) => (
              <img
                key={name}
                src={logo}
                alt={`${name} logo`}
                className="h-28 max-h-28 w-auto cursor-pointer object-contain grayscale transition duration-300 ease-in-out hover:scale-110 hover:grayscale-0"
              />
            ))}
          </div>
        </Marquee>

       
      </div>
    </section>
  )
}
