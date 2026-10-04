"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import ComplianceSections from "@/components/dashboard/compliance/ComplianceSections"

const LINKS = [
  { href: "/dashboard/cleaning", label: "Overview", exact: true },
  { href: "/dashboard/cleaning/tasks", label: "Tasks" },
  { href: "/dashboard/cleaning/templates", label: "Templates" },
  { href: "/dashboard/cleaning/history", label: "History" },
  { href: "/dashboard/cleaning/settings", label: "Settings" },
]

export default function CleaningNav() {
  const pathname = usePathname()
  return (
    <div className="space-y-4">
      <ComplianceSections />
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cleaning</h1>
        <p className="text-sm text-slate-500">Schedules, today’s tasks and cleaning records.</p>
      </div>
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
    </div>
  )
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    overdue: "bg-red-100 text-red-800",
  }
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : ""
  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", styles[status] || "bg-slate-100")}>
      {label}
    </span>
  )
}

export function CleaningMessage({
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
