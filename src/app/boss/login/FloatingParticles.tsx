"use client"
import { useEffect, useState } from "react"

interface Dot {
  left: number
  top: number
  delay: number
  duration: number
}

export default function FloatingParticles() {
  const [dots, setDots] = useState<Dot[]>([])

  useEffect(() => {
    const newDots = [...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }))
    setDots(newDots)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute h-2 w-2 animate-pulse rounded-full bg-white/20"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            animationDelay: `${dot.delay}s`,
            animationDuration: `${dot.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
