"use client"

import { useEffect, useState } from "react"

type Founder = {
  vanity: string
  name: string
  headline: string
  detail: string
  href: string
  image: string
  pinnedImage?: boolean
}

const fallbacks: Founder[] = [
  {
    vanity: "biswash-lamichhane-61386115b",
    name: "Biswash Lamichhane",
    headline: "Co-founder at Instalabel",
    detail: "Softwarica College of IT and E-commerce | University of Brighton",
    href: "https://www.linkedin.com/in/biswash-lamichhane-61386115b",
    image: "/marketing/founders/biswash-lamichhane.jpg",
  },
  {
    vanity: "nishantghimirenp",
    name: "Nishant G.",
    headline: "instalabel.co, MSc Cyber Security and Human Factors",
    detail: "Bournemouth and Poole College | Bournemouth University",
    href: "https://www.linkedin.com/in/nishantghimirenp",
    image: "/marketing/founders/nishant-ghimire.png",
    pinnedImage: true,
  },
  {
    vanity: "bibekrzl",
    name: "Bibek R.",
    headline: "Co-Founder, InstaLabel",
    detail: "Aux IT Solutions LTD | Bournemouth University",
    href: "https://www.linkedin.com/in/bibekrzl",
    image: "",
  },
]

declare global {
  interface Window {
    LIBadgeCallback?: (html: string, uid: number) => void
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.replace(/\./g, ""))
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("")
}

function tidy(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function parseBadge(html: string) {
  const doc = new DOMParser().parseFromString(html, "text/html")
  const name = tidy(doc.querySelector(".profile-badge__content-profile-name")?.textContent || "")
  const headline = tidy(doc.querySelector(".profile-badge__content-profile-headline")?.textContent || "")
  const detail = tidy(doc.querySelector(".profile-badge__content-profile-company-school-info")?.textContent || "")
  const photo = doc.querySelector(".profile-badge__content-profile-image")
  const ghost = (photo?.getAttribute("class") || "").includes("ghost")
  const img = photo?.tagName === "IMG" ? photo : photo?.querySelector("img")
  const src = img?.getAttribute("src") || ""
  const image = !ghost && src && !src.includes("/sc/h/") ? src : ""
  if (!name) return null
  return { name, headline, detail, image }
}

function loadLiveProfiles(onProfile: (vanity: string, profile: NonNullable<ReturnType<typeof parseBadge>>) => void) {
  const pending = new Map<number, string>()
  window.LIBadgeCallback = (html, uid) => {
    const vanity = pending.get(uid)
    if (!vanity) return
    const profile = parseBadge(String(html))
    if (profile) onProfile(vanity, profile)
  }
  fallbacks.forEach((founder, index) => {
    const uid = 700000 + index
    pending.set(uid, founder.vanity)
    const script = document.createElement("script")
    script.src =
      "https://badges.linkedin.com/profile?locale=en_US&badgetype=VERTICAL&badgetheme=light&uid=" +
      uid +
      "&version=v1&maxsize=medium&trk=profile-badge&vanityname=" +
      encodeURIComponent(founder.vanity)
    script.async = true
    document.body.appendChild(script)
  })
}

export function FounderProfiles() {
  const [founders, setFounders] = useState(fallbacks)

  useEffect(() => {
    loadLiveProfiles((vanity, profile) => {
      setFounders((current) =>
        current.map((founder) =>
          founder.vanity === vanity
            ? {
                ...founder,
                ...profile,
                image: founder.pinnedImage ? founder.image : profile.image || founder.image,
              }
            : founder
        )
      )
    })
  }, [])

  return (
    <div id="founders" className="mt-20 md:mt-28">
      <h2 className="text-2xl font-bold tracking-tight text-neutral-950">Founders</h2>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {founders.map((founder) => (
          <li key={founder.href} className="flex flex-col rounded-lg border border-neutral-200 p-5">
            {founder.image ? (
              <img
                src={founder.image}
                alt=""
                width={72}
                height={72}
                className="h-[72px] w-[72px] rounded-full object-cover"
              />
            ) : (
              <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700">
                {initials(founder.name)}
              </span>
            )}
            <p className="mt-4 font-semibold text-neutral-950">{founder.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-800">{founder.headline}</p>
            <p className="mt-1 text-sm leading-relaxed text-neutral-500">{founder.detail}</p>
            <a
              href={founder.href}
              className="mt-4 text-sm font-medium text-neutral-950 underline"
              rel="noopener noreferrer"
            >
              View LinkedIn profile
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
