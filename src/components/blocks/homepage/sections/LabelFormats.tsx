import React from "react"

export const LabelFormats = () => (
  <section id="label-formats" className="home-section" style={{ scrollMarginTop: "7rem" }}>
    <div className="home-wrap">
      <div className="home-eyebrow">Two physical formats</div>
      <h2 className="home-h2 mt-4">Two label sizes: 60 × 40 mm and 56 × 80 mm.</h2>
      <p className="home-lead mt-4 max-w-2xl">
        InstaLabel supports two label formats. Choose the size that fits your printer, workflow and
        the amount of information you need to display.
      </p>

      <img
        src="/marketing/both-sizes.jpg"
        alt="60 by 40 mm and 56 by 80 mm California roll labels side by side"
        className="mt-10 w-full rounded-lg border border-[var(--home-line)]"
      />

      <dl className="mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
        <div className="border-t border-[var(--home-line)] pt-4">
          <dt className="text-sm font-semibold">60 × 40 mm</dt>
          <dd className="mt-2 text-sm leading-relaxed text-[var(--home-muted)]">
            A smaller footprint for everyday kitchen labelling.
          </dd>
        </div>
        <div className="border-t border-[var(--home-line)] pt-4">
          <dt className="text-sm font-semibold">56 × 80 mm</dt>
          <dd className="mt-2 text-sm leading-relaxed text-[var(--home-muted)]">
            More room when a label needs a longer ingredient list or extra detail, including PPDS.
          </dd>
        </div>
      </dl>

      <p className="mt-8 max-w-3xl text-[1.02rem] leading-relaxed">
        Two formats. The same InstaLabel workflows. Different layouts. Both sizes support default,
        prep, cooked, defrost, use-first and PPDS labels. InstaLabel formats the information to
        suit the selected size.
      </p>
    </div>
  </section>
)
