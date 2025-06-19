import React from "react"
import care from "@/assets/images/kitchen.jpg"
import Image from "next/image"

export const History = () => {
  return (
    <section>
      <div className="container px-4 pb-24 sm:px-6 md:px-12 lg:px-16">
        <div className="h-96 w-full overflow-hidden rounded-lg">
          <Image src={care} alt="Chef in busy kitchen" className="h-full w-full object-cover" />
        </div>
        <h1 className="mt-12 text-3xl leading-tight tracking-tight sm:text-4xl">
          From Kitchen Chaos to Labeling Clarity
        </h1>
        <p className="mt-8 text-base leading-relaxed tracking-wide">
          InstaLabel wasn't born out of a startup incubator or a pitch deck — it started behind a
          prep counter, during a lunch rush. We were there when the labels smudged, the expiry dates
          faded, and nobody could remember if the sauce tub was opened today or yesterday. These
          weren't just annoyances — they were risks. For safety. For compliance. For trust.
        </p>
        <p className="mt-4 text-base leading-relaxed tracking-wide">
          We knew kitchens needed a better way to track what's fresh, what's safe, and what's
          compliant. So we built it — not with flashy tech jargon, but with real kitchen problems in
          mind. InstaLabel began as a tool for auto-calculating expiry dates and printing clear,
          wipe-safe labels. Then it grew into something more.
        </p>
        <p className="mt-4 text-base leading-relaxed tracking-wide">
          We added allergen tracking. Prep times. Use-by info. A manager dashboard. All the things
          that turn chaos into calm — without adding extra steps. No steep learning curves. No long
          onboarding. Just a tool that helps food teams get it right the first time.
        </p>
        <p className="mt-4 text-base leading-relaxed tracking-wide">
          Today, InstaLabel is trusted in hundreds of commercial kitchens across the UK — from
          independent cafés to growing chains — helping them reduce food waste, pass EHO
          inspections, and protect customers with confidence. It's simple, fast, and made to blend
          into the rhythm of your kitchen — not disrupt it.
        </p>
        <p className="mt-4 text-base leading-relaxed tracking-wide">
          And this is just the beginning. We're building the future of kitchen labeling — one clean,
          clear label at a time.
        </p>
      </div>
    </section>
  )
}
