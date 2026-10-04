"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const SECTIONS = [
  { href: "/dashboard/compliance", label: "Temperatures", id: "temperatures" },
  { href: "/dashboard/compliance/checks", label: "Checklist", id: "checks" },
  { href: "/dashboard/cleaning", label: "Cleaning", id: "cleaning" },
  { href: "/dashboard/compliance/diary", label: "Diary", id: "diary" },
]

export default function ComplianceSections() {
  const pathname = usePathname()
  return (
    <div className="flex flex-wrap gap-2">
      {SECTIONS.map((section) => {
        const active =
          section.id === "checks"
            ? pathname.startsWith("/dashboard/compliance/checks")
            : section.id === "cleaning"
              ? pathname.startsWith("/dashboard/cleaning")
              : section.id === "diary"
                ? pathname.startsWith("/dashboard/compliance/diary")
                : pathname.startsWith("/dashboard/compliance") &&
                  !pathname.startsWith("/dashboard/compliance/checks") &&
                  !pathname.startsWith("/dashboard/compliance/diary")
        return (
          <Link
            key={section.id}
            href={section.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-semibold",
              active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {section.label}
          </Link>
        )
      })}
    </div>
  )
}
