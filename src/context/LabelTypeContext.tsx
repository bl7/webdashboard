"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

export type LabelType = "standard" | "round-sticker"

interface LabelTypeContextType {
  labelType: LabelType
  setLabelType: (type: LabelType) => void
}

const LabelTypeContext = createContext<LabelTypeContextType | undefined>(undefined)

export const LabelTypeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [labelType, setLabelType] = useState<LabelType>("standard") // Default: standard labels

  return (
    <LabelTypeContext.Provider
      value={{
        labelType,
        setLabelType,
      }}
    >
      {children}
    </LabelTypeContext.Provider>
  )
}

export const useLabelType = () => {
  const context = useContext(LabelTypeContext)
  if (context === undefined) {
    throw new Error("useLabelType must be used within a LabelTypeProvider")
  }
  return context
}

