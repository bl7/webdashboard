import Marquee from "@/lib/marqee"
import React from "react"

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
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h3 className="mb-2 text-3xl font-semibold text-gray-800">Who We Serve</h3>
        <p className="mx-auto mb-8 max-w-xl text-gray-600">
          Any type of food business — from restaurants and cafes to food trucks and caterers.
          InstaLabel helps kitchens stay safe, efficient, and compliant.
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

        <button
          // onClick={() => (window.location.href = "/signup")}
          className="hover:bg-primary-dark mt-10 inline-block rounded bg-primary px-6 py-3 font-semibold text-white transition"
        >
          Get Started Today
        </button>
      </div>
    </section>
  )
}
