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
      className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-2 border-purple-200 shadow-2xl select-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
        className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl"
        style={{ 
          left: `${sliderPos}%`,
          transform: 'translateX(-50%)',
          willChange: 'transform'
        }}
      >
        {/* Slider Handle */}
        <div
          className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-2xl border-2 border-purple-600 cursor-ew-resize flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        >
          <div className="w-1.5 h-5 bg-purple-600 rounded-full"></div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="absolute left-6 top-6 rounded-xl bg-black/70 backdrop-blur-sm px-4 py-2 text-sm font-bold text-white shadow-lg">
        Before
      </div>
      <div className="absolute right-6 top-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-sm px-4 py-2 text-sm font-bold text-white shadow-lg">
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
          <div className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-sm px-6 py-3 text-sm font-bold text-white shadow-xl">
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
          <div className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-sm px-6 py-3 text-base font-bold text-white shadow-xl">
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
      description: "Automatic date calculations prevent mistakes"
    },
   
    {
      icon: Shield,
      title: "Full Compliance",
      description: "Natasha's Law & EHO standards met automatically"
    }
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/40 to-white px-4 py-16 text-foreground">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-purple-200/20 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-pink-200/20 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
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
                className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 text-sm font-bold text-purple-800 ring-1 ring-purple-200 shadow-sm"
              >
                <Zap className="mr-2 h-4 w-4" />
                The Kitchen Transformation
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  From Chaos to
                </span>
                <br />
                <span className="text-gray-900">Kitchen Control</span>
              </motion.h2>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="text-xl leading-relaxed text-gray-600">
                See the difference: handwritten labels with crossed-out dates vs. professional, 
                compliant labels printed in seconds. No more illegible handwriting, no more 
                forgotten allergen warnings, no more compliance risks.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                InstaLabel transforms your kitchen from a labeling nightmare into a streamlined 
                operation where every label is perfect, every time.
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
              <Link href='/bookdemo'>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-5 text-lg font-bold text-white hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl transition-all duration-300 sm:w-auto">
                  Book Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
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