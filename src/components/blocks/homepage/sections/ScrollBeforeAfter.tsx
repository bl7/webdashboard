"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Eye, Tag, Users } from "lucide-react"
import handwritten from "@/assets/images/before.png"
import printed from "@/assets/images/after.png"

const points = [
  { icon: Tag, label: "Standardised labels for every prep" },
  { icon: Eye, label: "Allergen information clearly displayed" },
  { icon: Users, label: "Easy for every shift to follow" },
]

export const ScrollBeforeAfter = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const update = () => {
      const section = sectionRef.current
      if (!section) return
      if (reduce) {
        setProgress(1)
        return
      }
      const rect = section.getBoundingClientRect()
      const distance = rect.height - window.innerHeight
      const next = distance <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / distance))
      setProgress(next)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const shown = Math.round(progress * 100)

  return (
    <section
      ref={sectionRef}
      className="home-life"
      style={{ height: "220vh", overflow: "visible" }}
      aria-label="Handwritten label compared with a printed label"
    >
      <div
        className="sticky flex h-[calc(100vh-5rem)] items-center px-4 sm:px-6 md:px-12 lg:px-16"
        style={{ top: "5rem" }}
      >
        <div className="home-wrap grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div>
            <div className="home-eyebrow">Why not handwritten labels</div>
            <h2 className="home-h2 mt-4 max-w-xl">Make every label clear and consistent.</h2>
            <p className="home-lead mt-4 max-w-xl">
              Give your team the information they need at a glance. From prep dates and use-by
              times to allergen information.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {points.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-[var(--home-border)]">
            <Image
              src={handwritten}
              alt="Handwritten tape on a tub of mixed vegetables, with the date crossed out."
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 480px"
              priority={false}
            />
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - shown}% 0 0)` }}
            >
              <Image
                src={printed}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 w-0.5 bg-white"
              style={{ left: `${shown}%` }}
              aria-hidden
            />
            <p className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
              Handwritten
            </p>
            <p
              className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white"
              style={{ opacity: shown > 55 ? 1 : 0.35 }}
            >
              Printed
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
