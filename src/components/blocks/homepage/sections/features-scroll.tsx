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
    <section className="bg-gray-20 px-4 py-12 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto text-center">
      
        <p className="mx-auto mb-8 max-w-xl text-base text-muted-foreground sm:text-lg md:text-xl">
          From cloud kitchens to national brands, InstaLabel makes food safety easy.
        </p>

        <div className="relative">
          <div className="absolute left-0 top-0 w-8 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 w-8 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
          
          <Marquee speed={30} pauseOnHover>
            <div className="flex items-center gap-16 overflow-hidden px-10">
              {foodBusinesses.map(({ name, logo }) => (
                <div key={name} className="group">
                  <img
                    src={logo}
                    alt={`${name} logo`}
                    className="h-20 max-h-20 w-auto cursor-pointer object-contain grayscale transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </section>
  )
}