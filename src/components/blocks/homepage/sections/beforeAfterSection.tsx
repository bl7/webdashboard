"use client"

import React, { useState, useRef } from "react"
import beforeImage from "@/assets/images/before.png"
import afterImage from "@/assets/images/after.png"
import Image, { StaticImageData } from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui"

interface BeforeAfterSliderProps {
  beforeImage: StaticImageData
  afterImage: StaticImageData
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sliderPos, setSliderPos] = useState(50)
  const [hasSwiped, setHasSwiped] = useState(false)

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    if (!containerRef.current) return
    const bounds = containerRef.current.getBoundingClientRect()
    const pos = ((clientX - bounds.left) / bounds.width) * 100
    setSliderPos(Math.max(0, Math.min(100, pos)))
    if (!hasSwiped) setHasSwiped(true)
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border shadow-md"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      <Image src={beforeImage} alt="Before" fill className="object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
        <Image src={afterImage} alt="After" fill className="object-cover" draggable={false} />
      </div>
      <div className="absolute bottom-0 top-0" style={{ left: `${sliderPos}%` }}>
        <div className="relative mx-auto h-full w-1 bg-primary">
          <div className="absolute -left-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-primary ring-2 ring-white" />
        </div>
      </div>
      <div className="absolute left-4 top-4 rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground sm:text-sm">
        Before
      </div>
      <div className="absolute right-4 top-4 rounded bg-accent px-2 py-1 text-xs font-medium text-white sm:text-sm">
        After
      </div>

      {/* Mobile swipe hint */}
      {!hasSwiped && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center sm:hidden">
          <div className="animate-pulse rounded-full bg-primary/70 px-4 py-1 text-xs font-medium text-white shadow-md">
            Swipe to compare
          </div>
        </div>
      )}
    </div>
  )
}

const buttonVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.4 } },
}

export const BeforeAfterSection = () => {
  return (
    <section className="bg-background px-4 py-20 text-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
        {/* Text Content */}
        <div>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Label Smarter.
            <br />
            <span className="font-accent leading-tight tracking-tight text-primary">
              Track Better.
            </span>
            <br />
            Cook Safer.
          </h2>
          <p className="mb-4 leading-relaxed text-muted-foreground">
            Gone are the days of unreadable labels and forgotten prep dates. With InstaLabel, your
            kitchen runs cleaner, safer, and smoother—no more chaos in the cold room.
          </p>
          <p className="mb-6 leading-relaxed text-muted-foreground">
            Boost efficiency without the admin headaches. InstaLabel printers take the stress out of
            food labeling, so your staff can focus on what matters: delivering great food and
            service. Say goodbye to manual tracking and hello to smarter kitchens.
          </p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            variants={buttonVariant}
          >
            <Button
              className="w-full bg-primary px-6 py-3 text-base text-primary-foreground hover:bg-primary/90"
              onClick={() => {
                const el = document.getElementById("about")
                if (el) el.scrollIntoView({ behavior: "smooth" })
              }}
            >
              See How It Works
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Slider */}
        <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />
      </div>
    </section>
  )
}
