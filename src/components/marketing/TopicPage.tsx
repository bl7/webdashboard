"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
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

const HERO_MEDIA: Record<string, { src: string; alt: string; fit?: "contain" }> = {
  "/for/restaurants": { src: "/marketing/cooked-on-container.jpg", alt: "Cooked food label on a container" },
  "/for/cafes": { src: "/marketing/ppds-wide.jpg", alt: "Wider PPDS label on a packed California roll" },
  "/for/takeaways": { src: "/marketing/defrost-on-container.png", alt: "Label on food leaving the freezer" },
  "/for/caterers": { src: "/marketing/prep-on-container.png", alt: "Prep label on a kitchen container" },
  "/opened-food-labels": { src: "/marketing/ingredient-on-container.png", alt: "Ingredient label on a container" },
  "/cleaning-checklists": {
    src: "/marketing/cleaning-checklist.jpg",
    alt: "Cleaning checklist on the InstaLabel dashboard and the Android app",
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
}

function heroMedia(path: string) {
  if (HERO_MEDIA[path]) return HERO_MEDIA[path]
  if (path.startsWith("/tools")) return { src: "/marketing/dashboard-matrix.png", alt: "Allergen matrix in InstaLabel" }
  if (path.startsWith("/guides")) return { src: "/marketing/printed-beside.png", alt: "A printed kitchen label beside a handwritten label" }
  return { src: "/marketing/kitchen-portrait.jpg", alt: "Work in a commercial kitchen" }
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
  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden bg-mkt-canvas px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-mkt-steel1 opacity-60 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-mkt-ink opacity-10 blur-3xl" />
        <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-mkt-canvas opacity-80 blur-3xl" />
        <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl space-y-6 text-center md:text-left"
          >
            <div className="inline-flex items-center rounded-full bg-mkt-canvas px-4 py-2 text-sm font-medium text-mkt-ink ring-1 ring-mkt-steel1">
              {page.badge}
            </div>
            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-mkt-ink sm:text-5xl lg:text-6xl">
              {page.h1}
            </h1>
            <p className="max-w-xl text-base text-mkt-ink8 sm:text-lg md:text-xl">{page.lead}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button size="lg" className="bg-mkt-ink px-8 py-3 text-white hover:bg-mkt-ink" asChild>
                <Link href="/register">
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/bookdemo">Book a demo</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full max-w-[500px]"
          >
            <div className="overflow-hidden rounded-lg border border-mkt-steel1 bg-white shadow-lg">
              <Image
                src={heroMedia(page.path).src}
                alt={heroMedia(page.path).alt}
                width={1000}
                height={750}
                className={
                  heroMedia(page.path).fit === "contain"
                    ? "h-auto w-full bg-mkt-canvas object-contain"
                    : "h-auto w-full object-cover"
                }
                priority
              />
            </div>
          </motion.div>
        </div>
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)" }}
        />
      </section>

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
            <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
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
            <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
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
            <h2 className="mb-4 text-xl font-black tracking-tight text-mkt-ink">Sources</h2>
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
          <h2 className="mb-6 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            Related pages
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {page.related.map((link) => (
              <li key={link.href}>
                <Link
                  href={liveHref(link.href)}
                  className="block rounded-lg border border-mkt-steel1 bg-mkt-canvas px-4 py-3 text-sm font-semibold text-mkt-ink hover:text-mkt-teal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
