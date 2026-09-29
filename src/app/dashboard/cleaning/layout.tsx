"use client"

import type { ReactNode } from "react"
import CleaningNav from "@/components/dashboard/cleaning/CleaningNav"

export default function CleaningLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <CleaningNav />
      {children}
    </div>
  )
}
