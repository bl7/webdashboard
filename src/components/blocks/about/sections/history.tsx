"use client"

import React from "react"

const priorities = [
  {
    title: "Clarity",
    body: "Product names, dates and allergen information should be easy to find and read.",
  },
  {
    title: "Consistency",
    body: "Reusable item information should support the same labelling process across shifts.",
  },
  {
    title: "Practical printing",
    body: "Kitchens should be able to choose an appropriate desktop or Android setup without proprietary InstaLabel hardware.",
  },
]

export const History = () => {
  return (
    <>
      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            Good information should be easy to use.
          </h2>
          <p className="text-base leading-relaxed text-mkt-ink8">
            A kitchen label needs to answer simple questions quickly: what is this, which date
            applies and what information does the next person need? InstaLabel brings saved item
            details and printing into one workflow so teams can spend less effort recreating the
            same label.
          </p>
        </div>
      </section>

      <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-10 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            What guides the product.
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {priorities.map((item) => (
              <div key={item.title}>
                <h3 className="mb-2 text-lg font-bold text-mkt-ink">{item.title}</h3>
                <p className="text-sm leading-relaxed text-mkt-ink8">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
