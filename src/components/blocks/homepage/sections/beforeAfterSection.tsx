"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import beforeImage from "@/assets/images/after.png"
import afterImage from "@/assets/images/before.png"
import Image, { StaticImageData } from "next/image"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui"
import Link from "next/link"

interface BeforeAfterSliderProps {
  beforeImage: StaticImageData
  afterImage: StaticImageData
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sliderPos, setSliderPos] = useState(50)
  const [hasSwiped, setHasSwiped] = useState(false)
  const dragging = useRef(false)
  const animationFrame = useRef<number | null>(null)

  const updateSlider = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return
      const bounds = containerRef.current.getBoundingClientRect()
      const pos = ((clientX - bounds.left) / bounds.width) * 100
      const clampedPos = Math.max(0, Math.min(100, pos))
      setSliderPos(clampedPos)
      if (!hasSwiped) setHasSwiped(true)
    },
    [hasSwiped]
  )

  // Drag event handlers
  const onDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return
      e.preventDefault()
      let clientX
      if (e.type.startsWith("touch")) {
        clientX = (e as TouchEvent).touches[0]?.clientX
      } else {
        clientX = (e as MouseEvent).clientX
      }
      if (clientX !== undefined) {
        if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
        animationFrame.current = requestAnimationFrame(() => updateSlider(clientX))
      }
    },
    [updateSlider]
  )

  const onDragEnd = useCallback(() => {
    dragging.current = false
    document.body.style.userSelect = ""
    document.body.style.cursor = ""
    window.removeEventListener("mousemove", onDrag)
    window.removeEventListener("touchmove", onDrag)
    window.removeEventListener("mouseup", onDragEnd)
    window.removeEventListener("touchend", onDragEnd)
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
      animationFrame.current = null
    }
  }, [onDrag])

  const onDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      dragging.current = true
      document.body.style.userSelect = "none"
      document.body.style.cursor = "ew-resize"

      if (e.type === "touchstart") {
        updateSlider((e as React.TouchEvent).touches[0].clientX)
      } else {
        updateSlider((e as React.MouseEvent).clientX)
      }

      window.addEventListener("mousemove", onDrag, { passive: false })
      window.addEventListener("touchmove", onDrag, { passive: false })
      window.addEventListener("mouseup", onDragEnd)
      window.addEventListener("touchend", onDragEnd)
    },
    [updateSlider, onDrag, onDragEnd]
  )

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        setSliderPos((prev) => Math.max(0, prev - 2))
        if (!hasSwiped) setHasSwiped(true)
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        setSliderPos((prev) => Math.min(100, prev + 2))
        if (!hasSwiped) setHasSwiped(true)
      }
    },
    [hasSwiped]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-3xl border-2 border-mkt-steel1 shadow-2xl focus:outline-none focus:ring-2 focus:ring-mkt-ink focus:ring-offset-2"
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-valuenow={Math.round(sliderPos)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Before and after comparison slider"
      style={{ cursor: dragging.current ? "ew-resize" : "ew-resize" }}
    >
      {/* Before Image */}
      <div className="absolute inset-0">
        <Image
          src={beforeImage}
          alt="Before"
          fill
          className="object-cover"
          draggable={false}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>

      {/* After Image with clip-path */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
          willChange: "clip-path",
        }}
      >
        <Image
          src={afterImage}
          alt="After"
          fill
          className="object-cover"
          draggable={false}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>

      {/* Slider Line and Handle */}
      <div
        className="absolute bottom-0 top-0 w-1 bg-white shadow-2xl"
        style={{
          left: `${sliderPos}%`,
          transform: "translateX(-50%)",
          willChange: "transform",
        }}
      >
        {/* Slider Handle */}
        <div
          className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-mkt-ink bg-white shadow-2xl transition-transform hover:scale-110 active:scale-95"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        >
          <div className="h-5 w-1.5 rounded-full bg-mkt-ink"></div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute left-6 top-6 rounded-xl bg-black/70 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm">
        Before
      </div>
      <div className="absolute right-6 top-6 rounded-xl text-white px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm">
        After
      </div>

      {/* Mobile swipe hint */}
      {!hasSwiped && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center sm:hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="rounded-full text-white px-6 py-3 text-sm font-bold text-white shadow-xl backdrop-blur-sm">
            Swipe to compare
          </div>
        </motion.div>
      )}

      {/* Desktop hint */}
      {!hasSwiped && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 hidden items-center justify-center sm:flex"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="rounded-full text-white px-6 py-3 text-base font-bold text-white shadow-xl backdrop-blur-sm">
            Drag to compare
          </div>
        </motion.div>
      )}
    </div>
  )
}

export const BeforeAfterSection = () => {
  return (
    <section className="relative overflow-hidden bg-mkt-canvas px-4 py-16 text-foreground sm:px-6 md:px-12 lg:px-16">
      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-center text-3xl font-black leading-tight tracking-tight text-mkt-ink sm:text-4xl lg:text-left">
              Handwritten labels compared with printed labels.
            </h2>
            <p className="text-center text-base leading-relaxed text-mkt-ink8 lg:text-left">
              Drag to compare a handwritten example with a printed InstaLabel label. Check that
              names, dates and allergen information are readable before you apply a label.
            </p>
            <div className="flex justify-center lg:justify-start">
              <Button
                className="border-0 font-semibold text-white"
                style={{ backgroundColor: "#142124", backgroundImage: "none" }}
                asChild
              >
                <Link href="/bookdemo">
                  Book a demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
          {/* Right: Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full"
          >
            {/* Enhanced Slider */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-3xl bg-mkt-steel1/40 blur-2xl"></div>
              <div className="relative">
                <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
