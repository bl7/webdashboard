import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { HomeSpecimen } from "../home-labels"

export const ProductCapabilities = () => (
  <section id="features" className="home-section" style={{ scrollMarginTop: "7rem" }}>
    <div className="home-wrap">
      <div className="home-eyebrow">Behind every label</div>
      <h2 className="home-h2 mt-4">The label is only the final step.</h2>
      <p className="home-lead mt-4 max-w-2xl">
        InstaLabel stores the information your kitchen already works from, then uses it to generate
        the finished label.
      </p>

      <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {["Ingredients", "Menu item", "Allergen information", "Date rules", "Finished label"].map(
          (step, index) => (
            <li key={step} className="home-card px-4 py-3 text-sm font-semibold">
              <span className="mr-2 text-[var(--home-forest)]">{index + 1}</span>
              {step}
            </li>
          )
        )}
      </ol>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--home-muted)]">
        Your business sets the ingredients, allergens and date rules. InstaLabel applies those
        settings when it prints. It does not decide whether a label is legally compliant.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <article className="home-card p-6 shadow-sm lg:col-span-2 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8">
          <div>
            <h3 className="text-2xl font-extrabold">Choose the item. Check the details.</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
              Menu items and ingredients stay in one place. Staff pick the job, review what is
              already saved, and print.
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
          <h3 className="text-2xl font-extrabold">Allergens travel with the item.</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
            Saved allergen information can be carried onto the label, with the ingredients that
            contain them emphasised.
          </p>
          <p className="mt-3 text-sm font-semibold">
            Always check the current recipe and supplier information.
          </p>
          <div className="mt-5 flex justify-center rounded-xl bg-[var(--home-sage)] p-4">
            <HomeSpecimen kind="ppds" />
          </div>
          <p className="mt-2 text-xs text-[var(--home-muted)]">
            Illustrative PPDS layout from the InstaLabel label renderer, using bread, cheddar and
            butter with allergen emphasis. Not a production-ready label.
          </p>
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
            <h3 className="text-xl font-extrabold">Your kitchen’s date rules.</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
              Your business sets the date rules. InstaLabel applies those settings when generating
              labels, so the team sees a consistent format to check before printing.
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
