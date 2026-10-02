"use client"

import type { ReactNode } from "react"
import ComplianceNav from "@/components/dashboard/compliance/ComplianceNav"

export default function ComplianceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <ComplianceNav />
      {children}
    </div>
  )
}
