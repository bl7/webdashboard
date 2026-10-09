"use client"

import React, { useRef, useState } from "react"
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
  const frameRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const [shown, setShown] = useState(50)

  const setFromClientX = (clientX: number) => {
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    if (rect.width <= 0) return
    const next = ((clientX - rect.left) / rect.width) * 100
    setShown(Math.min(100, Math.max(0, next)))
  }

  return (
    <section
      className="home-life home-section"
      style={{ marginBottom: "4.5rem" }}
      aria-label="Handwritten label compared with a printed label"
    >
      <div className="home-wrap grid w-full items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          <div className="home-eyebrow">Why not handwritten labels</div>
          <h2 className="home-h2 mt-4 max-w-xl">Make every label clear and consistent.</h2>
          <p className="home-lead mt-4 max-w-xl">
            Give your team the information they need at a glance. From prep dates and use-by times
            to allergen information.
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
        <div
          ref={frameRef}
          className="relative mx-auto aspect-[4/5] w-full max-w-md cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-[var(--home-border)]"
          role="slider"
          aria-label="Drag to compare the handwritten and printed labels"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(shown)}
          tabIndex={0}
          onPointerDown={(event) => {
            dragging.current = true
            setFromClientX(event.clientX)
            try {
              event.currentTarget.setPointerCapture(event.pointerId)
            } catch {
              /* Synthetic or already-released pointers still update from the event. */
            }
          }}
          onPointerMove={(event) => {
            if (!dragging.current) return
            setFromClientX(event.clientX)
          }}
          onPointerUp={(event) => {
            dragging.current = false
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId)
            }
          }}
          onPointerCancel={() => {
            dragging.current = false
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") setShown((value) => Math.max(0, value - 5))
            if (event.key === "ArrowRight") setShown((value) => Math.min(100, value + 5))
          }}
        >
          <Image
            src={handwritten}
            alt="Handwritten tape on a tub of mixed vegetables, with the date crossed out."
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 480px"
            draggable={false}
          />
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - shown}% 0 0)` }}>
            <Image
              src={printed}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 480px"
              draggable={false}
            />
          </div>
          <div
            className="pointer-events-none absolute inset-y-0 w-0.5 bg-white"
            style={{ left: `${shown}%` }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-black/70"
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
    </section>
  )
}
