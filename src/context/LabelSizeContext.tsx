"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export type LabelSize = {
  width: number // in mm
  height: number // in mm
  label: string // Display label like "60x40"
  heightKey: "40mm" | "80mm" // For backward compatibility
}

// Supported label sizes (rectangular labels only)
// 60x40: Standard labels (prep, cook, default, ingredients, defrost, use-first) at 40mm height
// 56x80: PPDS labels only (Prepacked for Direct Sale)
export const LABEL_SIZES: LabelSize[] = [
  {
    width: 60,
    height: 40,
    label: "60x40",
    heightKey: "40mm",
  },
  {
    width: 56,
    height: 80,
    label: "56x80",
    heightKey: "80mm",
  },
]

interface LabelSizeContextType {
  selectedSize: LabelSize
  setSelectedSize: (size: LabelSize) => void
  labelSizes: LabelSize[]
}

const LabelSizeContext = createContext<LabelSizeContextType | undefined>(undefined)

const FALLBACK_LABEL_SIZE_CONTEXT: LabelSizeContextType = {
  selectedSize: LABEL_SIZES[0],
  setSelectedSize: () => {
    // No-op fallback for pages rendered outside LabelSizeProvider.
  },
  labelSizes: LABEL_SIZES,
}

export const LabelSizeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedSize, setSelectedSize] = useState<LabelSize>(LABEL_SIZES[0]) // Default: 60x40

  return (
    <LabelSizeContext.Provider
      value={{
        selectedSize,
        setSelectedSize,
        labelSizes: LABEL_SIZES,
      }}
    >
      {children}
    </LabelSizeContext.Provider>
  )
}

export const useLabelSize = () => {
  const context = useContext(LabelSizeContext)
  return context ?? FALLBACK_LABEL_SIZE_CONTEXT
}

