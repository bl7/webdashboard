import React from "react"
import { HomeSpecimen } from "../home-labels"

export const LabelFormats = () => (
  <section id="label-formats" className="home-section" style={{ scrollMarginTop: "7rem" }}>
    <div className="home-wrap">
      <div className="home-eyebrow">Two physical formats</div>
      <h2 className="home-h2 mt-4">Labels that fit the job.</h2>
      <p className="home-lead mt-4 max-w-2xl">
        InstaLabel supports two label formats. Choose the size that fits your printer, workflow and
        the amount of information you need to display.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <article className="home-card p-6">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--home-forest)]">
            60 × 40 mm
          </p>
          <h3 className="mt-2 text-2xl font-extrabold">Compact format</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
            A smaller footprint for everyday kitchen labelling.
          </p>
          <div className="home-size-stage mt-6">
            <HomeSpecimen kind="prep" labelHeight="40mm" />
          </div>
        </article>

        <article className="home-card p-6">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--home-forest)]">
            56 × 80 mm
          </p>
          <h3 className="mt-2 text-2xl font-extrabold">Extended format</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
            More room when a label needs a longer ingredient list or extra detail, including PPDS.
          </p>
          <div className="home-size-stage mt-6">
            <HomeSpecimen kind="ppds" />
          </div>
        </article>
      </div>

      <p className="mt-8 max-w-3xl text-[1.02rem] leading-relaxed">
        Two formats. The same InstaLabel workflows. Different layouts. Both sizes support prep,
        opened, cooked, defrost, use-first and PPDS labels. InstaLabel formats the information to
        suit the selected size.
      </p>
      <p className="mt-3 text-xs text-[var(--home-muted)]">
        Illustrative layouts from the InstaLabel label renderer. The compact example is a prep
        label. The extended example is a PPDS label. Neither size is limited to one label type.
      </p>
    </div>
  </section>
)
