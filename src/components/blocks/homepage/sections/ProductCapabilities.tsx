import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const ProductCapabilities = () => (
  <section id="features" className="home-section" style={{ scrollMarginTop: "7rem" }}>
    <div className="home-wrap">
      <div className="home-eyebrow">Small labels. Big difference.</div>
      <h2 className="home-h2 mt-4">
        Less label admin.
        <br />
        More kitchen momentum.
      </h2>
      <p className="home-lead mt-4">
        Keep the information behind your labels together, so every shift has a clearer starting
        point.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <article className="home-card p-6 shadow-sm lg:col-span-2 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
          <div>
            <h3 className="text-2xl font-extrabold">Your menu. Ready to label.</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
              Keep your products and ingredients in one place. Choose an item, review its details
              and prepare the right label for the job.
            </p>
            <Link href="/features" className="home-link mt-4 inline-flex items-center gap-2">
              Explore the software
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Image
            src="/webdashboard/print.png"
            alt="InstaLabel printing interface, with an item selected and a label preview"
            width={1200}
            height={800}
            className="mt-6 h-auto w-full rounded-xl lg:mt-0"
          />
        </article>

        <article className="home-card p-6">
          <h3 className="text-2xl font-extrabold">Make the important details stand out.</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
            Carry checked ingredient information into your labels, with clear allergen emphasis.
          </p>
          <p className="mt-3 text-sm font-semibold">
            Always check the current recipe and supplier information.
          </p>
          <div className="mt-5 rounded-xl bg-[var(--home-sage)] p-4 font-mono text-sm leading-relaxed">
            <p className="font-bold">Cheddar sandwich</p>
            <p>
              Ingredients: <strong>WHEAT</strong> bread, cheddar (<strong>MILK</strong>), butter (
              <strong>MILK</strong>)
            </p>
            <p className="mt-2 text-xs text-[var(--home-muted)]">
              Illustrative ingredient extract, not a production-ready label.
            </p>
          </div>
          <Link
            href="/allergen-compliance"
            className="home-link mt-4 inline-flex items-center gap-2"
          >
            Explore allergen labelling
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>

        <div className="grid gap-6">
          <article className="home-card p-6">
            <h3 className="text-xl font-extrabold">Your items deserve a head start.</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
              Bring existing item information in with CSV import. Review the ingredients, allergens
              and settings, then put those details to work.
            </p>
            <Link
              href="/features#csv-import"
              className="home-link mt-4 inline-flex items-center gap-2"
            >
              See how importing works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
          <article className="home-card p-6">
            <h3 className="text-xl font-extrabold">Your kitchen’s rules. Clearly on the label.</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
              Apply the date settings your business has chosen. Give the team a consistent format to
              check before each label is printed.
            </p>
            <Link
              href="/expiry-date-labels"
              className="home-link mt-4 inline-flex items-center gap-2"
            >
              Explore date labelling
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </div>
      </div>
    </div>
  </section>
)
