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

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const bounds = containerRef.current.getBoundingClientRect()
    const pos = ((clientX - bounds.left) / bounds.width) * 100
    const clampedPos = Math.max(0, Math.min(100, pos))
    setSliderPos(clampedPos)
    if (!hasSwiped) setHasSwiped(true)
  }, [hasSwiped])

  // Drag event handlers
  const onDrag = useCallback((e: MouseEvent | TouchEvent) => {
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
  }, [updateSlider])

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

  const onDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
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
  }, [updateSlider, onDrag, onDragEnd])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      setSliderPos(prev => Math.max(0, prev - 2))
      if (!hasSwiped) setHasSwiped(true)
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      setSliderPos(prev => Math.min(100, prev + 2))
      if (!hasSwiped) setHasSwiped(true)
    }
  }, [hasSwiped])

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
      className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border shadow-md select-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
          priority
        />
      </div>
      
      {/* After Image with clip-path */}
      <div
        className="absolute inset-0"
        style={{ 
          clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
          willChange: 'clip-path'
        }}
      >
        <Image 
          src={afterImage} 
          alt="After" 
          fill 
          className="object-cover" 
          draggable={false}
          priority
        />
      </div>
      
      {/* Slider Line and Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ 
          left: `${sliderPos}%`,
          transform: 'translateX(-50%)',
          willChange: 'transform'
        }}
      >
        {/* Slider Handle */}
        <div
          className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg border-2 border-primary cursor-ew-resize flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        >
          <div className="w-1 h-4 bg-primary rounded-full"></div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute left-4 top-4 rounded-md bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white sm:text-sm">
        Before
      </div>
      <div className="absolute right-4 top-4 rounded-md bg-primary/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white sm:text-sm">
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
          <div className="rounded-full bg-primary/90 backdrop-blur-sm px-4 py-2 text-xs font-medium text-white shadow-lg">
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
          <div className="rounded-full bg-primary/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white shadow-lg">
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
            <Link href='/uses'>
              <Button
                className="w-full bg-primary px-6 py-3 text-base text-primary-foreground hover:bg-primary/90"
              >
                Explore Labels
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Slider */}
        <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />
      </div>
    </section>
  )
}