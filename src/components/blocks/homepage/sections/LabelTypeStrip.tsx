import React from "react"

const items = ["Prep", "Opened", "Cooked", "Defrost", "Use first", "PPDS"]

export const LabelTypeStrip = () => (
  <section className="home-band py-5">
    <div className="home-wrap flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p className="text-sm font-bold">From first prep to final pack.</p>
      <ul className="grid grid-cols-2 gap-2 text-sm font-semibold sm:grid-cols-3 md:flex md:flex-wrap md:gap-x-6">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  </section>
)
