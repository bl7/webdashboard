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

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="home-card p-6">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--home-forest)]">
            60 × 40 mm
          </p>
          <h3 className="mt-2 text-2xl font-extrabold">Compact format</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
            A smaller footprint for everyday kitchen labelling.
          </p>
        </article>

        <article className="home-card p-6">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--home-forest)]">
            56 × 80 mm
          </p>
          <h3 className="mt-2 text-2xl font-extrabold">Extended format</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
            More room when a label needs a longer ingredient list or extra detail, including PPDS.
          </p>
        </article>
      </div>

      <p className="mt-8 max-w-3xl text-[1.02rem] leading-relaxed">
        Two formats. The same InstaLabel workflows. Different layouts. Both sizes support default,
        prep, cooked, defrost, use-first and PPDS labels. InstaLabel formats the information to
        suit the selected size.
      </p>
    </div>
  </section>
)
