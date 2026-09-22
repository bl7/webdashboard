import React from "react"

const items = ["Prep", "Cooked", "Defrost", "Ingredients", "Use first", "PPDS"]

export const LabelTypeStrip = () => (
  <section className="home-strip py-5">
    <div className="home-wrap flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p className="text-sm font-bold">One workflow. Everyday kitchen jobs.</p>
      <ul className="grid grid-cols-2 gap-2 text-sm font-semibold sm:grid-cols-3 md:flex md:flex-wrap md:gap-x-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  </section>
)
