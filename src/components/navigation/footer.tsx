"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { SiWhatsapp } from "react-icons/si"
import {
  CONTACT,
  FOOTER_COMPANY,
  FOOTER_PRODUCT,
  FOOTER_RESOURCES,
  LEGAL_NAV,
  PLAY_STORE_URL,
  WORKFLOW_NAV,
} from "@/lib/marketing/site"

const linkClass =
  "transition-all duration-300 hover:translate-x-1 hover:text-[#E4F1EE]"

export const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="pt-10 text-sm text-white" style={{ backgroundColor: "#142124" }}>
      <div className="container grid grid-cols-1 gap-8 px-4 pb-8 md:grid-cols-6">
        <div className="space-y-3">
          <Image
            src="/long_longwhite.png"
            width={140}
            height={30}
            alt="InstaLabel"
            className="drop-shadow-lg"
          />
          <p className="max-w-xs text-xs font-medium leading-snug text-white">
            Clear labels for everyday kitchen work.
          </p>
          <p className="max-w-xs text-xs leading-snug text-white/70">
            Create and print kitchen labels from your saved ingredient information, with
            desktop and Android printing options.
          </p>
          <div className="pt-2">
            <Link
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transition-all duration-300 hover:scale-105"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-8 w-auto"
              />
            </Link>
          </div>
        </div>

        <FooterColumn title="Product" links={FOOTER_PRODUCT} />
        <FooterColumn title="Kitchen workflows" links={WORKFLOW_NAV} />
        <FooterColumn title="Resources" links={FOOTER_RESOURCES} />
        <FooterColumn title="Company" links={FOOTER_COMPANY} />

        <div className="space-y-2">
          <h3 className="border-b border-white/15 pb-1 text-base font-semibold text-white">
            Contact
          </h3>
          <div className="space-y-1 text-xs text-white/80">
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#17675F]"></span>
              {CONTACT.location}
            </p>
            <Link href={`mailto:${CONTACT.email}`} className={`block ${linkClass}`}>
              {CONTACT.email}
            </Link>
            <Link href={CONTACT.phoneHref} className={`block ${linkClass}`}>
              {CONTACT.phoneDisplay}
            </Link>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:bg-white/20"
              aria-label="Message InstaLabel on WhatsApp"
            >
              <SiWhatsapp
                className="h-[22px] w-[22px] text-[#25D366] transition-colors duration-300 group-hover:text-[#20bd5a]"
                aria-hidden
              />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/15 py-3">
        <div className="container flex flex-col items-center justify-between gap-3 px-4 text-xs text-white/50 sm:flex-row">
          <p>
            © {year} InstaLabel. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center gap-4">
            {LEGAL_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white/80">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: readonly { label: string; href: string }[]
}) {
  return (
    <div className="space-y-3">
      <h3 className="border-b border-white/15 pb-1 text-base font-semibold text-white">
        {title}
      </h3>
      <nav className="flex flex-col gap-2 text-xs text-white/80">
        {links.map((item) => (
          <Link key={`${item.href}-${item.label}`} href={item.href} className={linkClass}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
