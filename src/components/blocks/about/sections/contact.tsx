"use client"

import React from "react"
import Link from "next/link"
import { ContactForm } from "./form"
import { CONTACT } from "@/lib/marketing/site"

export const Contact = () => {
  return (
    <section id="contact" className="scroll-mt-24 bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
              Talk to the InstaLabel team.
            </h2>
            <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
              Tell us about your kitchen, your printer setup or the question you need help with.
            </p>
            <dl className="space-y-4 text-sm text-mkt-ink8">
              <div>
                <dt className="font-semibold text-mkt-ink">Location</dt>
                <dd>{CONTACT.location}</dd>
              </div>
              <div>
                <dt className="font-semibold text-mkt-ink">Email</dt>
                <dd>
                  <Link href={`mailto:${CONTACT.email}`} className="text-mkt-teal hover:underline">
                    {CONTACT.email}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-mkt-ink">Phone</dt>
                <dd>
                  <Link href={CONTACT.phoneHref} className="text-mkt-teal hover:underline">
                    {CONTACT.phoneDisplay}
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
