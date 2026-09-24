import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const MenuImport = () => (
  <section className="home-section">
    <div className="home-wrap">
      <div className="home-eyebrow">Easy setup</div>
      <h2 className="home-h2 mt-4 max-w-3xl">Already have your menu? Bring it with you.</h2>
      <p className="home-lead mt-4 max-w-2xl">
        You don&apos;t need to build everything from scratch. Import your existing information,
        review it, configure your labels and start printing.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--home-muted)]">
        Importing does not check that ingredients or allergens are correct. Review recipes and
        supplier information before you print.
      </p>
      <Link href="/features#csv-import" className="home-link mt-6 inline-flex items-center gap-2">
        See how importing works
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </section>
)
