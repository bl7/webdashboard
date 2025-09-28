"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import beforeImage from "@/assets/images/after.png"
import afterImage from "@/assets/images/before.png"
import Image, { StaticImageData } from "next/image"
import { ArrowRight, Zap, CheckCircle2, Clock, Shield } from "lucide-react"
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
      className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-3xl border-2 border-purple-200 shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
          className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-purple-600 bg-white shadow-2xl transition-transform hover:scale-110 active:scale-95"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        >
          <div className="h-5 w-1.5 rounded-full bg-purple-600"></div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute left-6 top-6 rounded-xl bg-black/70 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm">
        Before
      </div>
      <div className="absolute right-6 top-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-sm">
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
          <div className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-xl backdrop-blur-sm">
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
          <div className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-base font-bold text-white shadow-xl backdrop-blur-sm">
            Drag to compare
          </div>
        </motion.div>
      )}
    </div>
  )
}

const buttonVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.6, duration: 0.4 } },
}

const featureVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export const BeforeAfterSection = () => {
  const features = [
    {
      icon: CheckCircle2,
      title: "Zero Manual Errors",
      description: "Automatic date calculations prevent mistakes",
    },

    {
      icon: Shield,
      title: "Full Compliance",
      description: "Natasha's Law & EHO standards met automatically",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/40 to-white px-4 py-16 text-foreground">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-purple-200/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-pink-200/20 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            {/* Enhanced Text Content */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="mx-auto inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 text-sm font-bold text-purple-800 shadow-sm ring-1 ring-purple-200 lg:mx-0"
              >
                <Zap className="mr-2 h-4 w-4" />
                The Kitchen Transformation
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-left lg:text-5xl"
              >
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  From Chaos to
                </span>
                <br />
                <span className="text-gray-900">Kitchen Control</span>
              </motion.h3>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-center text-xl leading-relaxed text-gray-600 lg:text-left">
                Say goodbye to crossed-out dates, illegible handwriting, and forgotten allergens.
                With InstaLabel, every label is professional, compliant, and printed in seconds.
              </p>
              <p className="text-center text-lg leading-relaxed text-gray-600 lg:text-left">
                Transform your kitchen into a streamlined, efficient operation where mistakes are
                eliminated and compliance is automatic. Faster prep. Safer food. Smarter kitchen.
              </p>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={featureVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 rounded-xl bg-white/60 p-4 shadow-sm ring-1 ring-purple-100 backdrop-blur-sm"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={buttonVariant}
            >
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-5 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl sm:w-auto"
                asChild
              >
                <Link href="/bookdemo">
                  Book Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
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
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-2xl"></div>
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
