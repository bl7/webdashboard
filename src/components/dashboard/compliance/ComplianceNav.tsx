"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import ComplianceSections from "@/components/dashboard/compliance/ComplianceSections"

const LINKS = [
  { href: "/dashboard/compliance", label: "Today", exact: true },
  { href: "/dashboard/compliance/equipment", label: "Equipment" },
  { href: "/dashboard/compliance/methods", label: "Safe methods" },
  { href: "/dashboard/compliance/probes", label: "Probes" },
  { href: "/dashboard/compliance/history", label: "History" },
]

const BLURBS: Array<{ match: string; exact?: boolean; text: string }> = [
  { match: "/dashboard/compliance/equipment", text: "The fridges and freezers, and the food kept on a display or sandwich unit." },
  { match: "/dashboard/compliance/methods", text: "The temperatures this kitchen works to. Staff do not change these on the phone." },
  { match: "/dashboard/compliance/probes", text: "The thermometers, and when each one was last checked." },
  { match: "/dashboard/compliance/history", text: "Past temperature records. This download is the temperature diary only." },
  { match: "/dashboard/compliance", exact: true, text: "Today’s record. Staff enter the temperatures on the phone." },
]

export default function ComplianceNav() {
  const pathname = usePathname()
  const checks = pathname.startsWith("/dashboard/compliance/checks")
  const diary = pathname.startsWith("/dashboard/compliance/diary")
  const blurb = BLURBS.find((item) => (item.exact ? pathname === item.match : pathname.startsWith(item.match)))
  const title = diary ? "Diary" : checks ? "Checklist" : "Temperature records"
  const text = diary
    ? "The full diary: temperatures, checklist, cleaning, corrective actions, and the sign-off."
    : checks
      ? pathname.startsWith("/dashboard/compliance/checks/history")
        ? "Past days. This download is the checklist diary only."
        : "The lines staff tick on the phone. Add or retire a line here."
      : blurb?.text
  return (
    <div className="space-y-4">
      <ComplianceSections />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">{text}</p>
      </div>
      {diary ? null : checks ? (
      <div className="flex flex-wrap gap-2">
        {[
          { href: "/dashboard/compliance/checks", label: "List", exact: true },
          { href: "/dashboard/compliance/checks/history", label: "History" },
        ].map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold",
                active ? "bg-purple-600 text-white" : "bg-white text-slate-600 shadow-sm"
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
      ) : (
      <div className="flex flex-wrap gap-2">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold",
                active ? "bg-purple-600 text-white" : "bg-white text-slate-600 shadow-sm"
              )}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
      )}
    </div>
  )
}

export function ComplianceMessage({
  title,
  body,
  action,
}: {
  title: string
  body?: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-lg font-semibold text-slate-800">{title}</p>
      {body ? <p className="mt-2 text-sm text-slate-500">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
