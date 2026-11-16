"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image"
import { liveHref } from "@/lib/marketing/liveHref"
import type { CoveragePage } from "@/lib/marketing/coveragePages"

const HERO_MEDIA: Record<string, { src: string; alt: string; fit?: "contain" } | null> = {
  "/for/restaurants": null,
  "/for/cafes": { src: "/marketing/ppds-wide.jpg", alt: "Wider PPDS label on a packed California roll" },
  "/for/takeaways": null,
  "/for/caterers": null,
  "/opening-closing-checks": null,
  "/cleaning-checklists": {
    src: "/marketing/cleaning-checklist.jpg",
    alt: "Cleaning checklist on the InstaLabel dashboard and the Android app",
  },
  "/temperature-records": {
    src: "/marketing/temperature-records.jpg",
    alt: "Temperature records on the InstaLabel dashboard and the Android app",
  },
  "/tools/restaurant-cleaning-checklist": {
    src: "/marketing/cleaning-checklist.jpg",
    alt: "Cleaning checklist on the InstaLabel dashboard and the Android app",
  },
  "/csv-import": { src: "/marketing/dashboard-items.png", alt: "Ingredient records in the InstaLabel dashboard" },
  "/label-sizes": {
    src: "/marketing/both-sizes.jpg",
    alt: "60 by 40 mm and 56 by 80 mm California roll labels side by side",
    fit: "contain",
  },
  "/guides/ppds-labelling-requirements": {
    src: "/marketing/ppds-wide.jpg",
    alt: "Wider PPDS label on a packed California roll",
  },
  "/guides/allergen-information-for-restaurants": {
    src: "/marketing/dashboard-matrix.png",
    alt: "Allergen matrix in InstaLabel",
  },
  "/guides/choosing-kitchen-labelling-software": {
    src: "/marketing/dashboard-print.png",
    alt: "The print screen in InstaLabel",
  },
}

function heroMedia(path: string) {
  if (path in HERO_MEDIA) return HERO_MEDIA[path]
  if (path.startsWith("/tools")) return { src: "/marketing/dashboard-matrix.png", alt: "Allergen matrix in InstaLabel" }
  return null
}

function pageKind(path: string) {
  if (path.startsWith("/guides") || path.startsWith("/tools")) return "article"
  if (path.startsWith("/for")) return "kitchen"
  return "record"
}

function TopicActions() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4">
      <Button size="lg" className="bg-mkt-ink px-6 py-3 text-white hover:bg-mkt-ink" asChild>
        <Link href="/register">
          Start free trial
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Link href="/bookdemo" className="text-sm font-semibold text-mkt-teal">
        Book a demo
      </Link>
    </div>
  )
}

export function TopicPage({
  page,
  children,
  examples,
}: {
  page: CoveragePage
  children?: React.ReactNode
  examples?: React.ReactNode
}) {
  const media = heroMedia(page.path)
  const kind = pageKind(page.path)
  const figure = media ? (
    <Image
      src={media.src}
      alt={media.alt}
      width={1200}
      height={800}
      className={media.fit === "contain" ? "h-auto w-full bg-mkt-canvas object-contain" : "h-auto w-full object-cover"}
      priority
    />
  ) : null

  return (
    <>
      {kind === "article" ? (
        <header className="mx-auto max-w-[44rem] px-4 pb-2 pt-28 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mkt-teal">{page.badge}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-mkt-ink sm:text-5xl">{page.h1}</h1>
          <p className="mt-4 text-lg leading-relaxed text-mkt-ink8">{page.lead}</p>
          <TopicActions />
          {figure ? <figure className="mt-10">{figure}</figure> : null}
        </header>
      ) : null}

      {kind === "kitchen" ? (
        <header className="bg-mkt-canvas">
          {figure ? <figure className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">{figure}</figure> : null}
          <div className={figure ? "mx-auto max-w-3xl px-4 pb-12 pt-8 sm:px-6" : "mx-auto max-w-3xl px-4 pb-4 pt-28 sm:px-6"}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mkt-teal">{page.badge}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-mkt-ink sm:text-5xl">{page.h1}</h1>
            <p className="mt-4 text-lg leading-relaxed text-mkt-ink8">{page.lead}</p>
            <TopicActions />
          </div>
        </header>
      ) : null}

      {kind === "record" ? (
        <header
          className={
            figure
              ? "mx-auto grid max-w-6xl items-end gap-10 px-4 pb-4 pt-28 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:px-8"
              : "mx-auto max-w-3xl px-4 pb-4 pt-28 sm:px-6"
          }
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mkt-teal">{page.badge}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-mkt-ink sm:text-5xl">{page.h1}</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-mkt-ink8">{page.lead}</p>
            <TopicActions />
          </div>
          {figure ? <figure>{figure}</figure> : null}
        </header>
      ) : null}

      {examples}

      {page.sections.map((section, index) => (
        <section
          key={section.heading}
          className={
            index % 2 === 0
              ? "bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16"
              : "bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16"
          }
        >
          <div className="container mx-auto max-w-3xl">
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-mkt-ink">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-4 text-base leading-relaxed text-mkt-ink8">
                {paragraph}
              </p>
            ))}
            {section.bullets?.length ? (
              <ul className="mb-4 space-y-3">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-base leading-relaxed text-mkt-ink8">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mkt-teal" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {section.table ? (
              <div className="mb-4 overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead className="border-b border-mkt-steel1">
                    <tr>
                      {section.table.headers.map((header) => (
                        <th key={header} className="py-3 pr-4 font-semibold text-mkt-ink">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row.join("|")} className="border-b border-mkt-steel1 align-top">
                        {row.map((cell) => (
                          <td key={cell} className="py-3 pr-4 text-mkt-ink8">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {section.links?.length ? (
              <p className="text-sm">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={liveHref(link.href)}
                    className="mr-4 font-semibold text-mkt-teal hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </p>
            ) : null}
          </div>
        </section>
      ))}

      {page.faqs?.length ? (
        <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
          <div className="container mx-auto max-w-3xl">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-mkt-ink">
              Questions about this page
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {page.faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`item-${index}`}
                  className="rounded-lg border border-mkt-steel1 bg-mkt-canvas px-4"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold text-mkt-ink hover:text-mkt-teal">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-mkt-ink8">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      ) : null}

      {page.sources?.length ? (
        <section className="bg-mkt-canvas px-4 py-12 sm:px-6 md:px-12 lg:px-16">
          <div className="container mx-auto max-w-3xl">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-mkt-teal">Sources</h2>
            <ul className="space-y-2 text-sm text-mkt-ink8">
              {page.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} className="font-semibold text-mkt-teal hover:underline" rel="noopener noreferrer">
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {children}

      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-mkt-teal">
            Related pages
          </h2>
          <ul className="border-t border-mkt-steel1">
            {page.related.map((link) => (
              <li key={link.href} className="border-b border-mkt-steel1">
                <Link
                  href={liveHref(link.href)}
                  className="flex items-center justify-between py-3 text-sm font-semibold text-mkt-ink hover:text-mkt-teal"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
