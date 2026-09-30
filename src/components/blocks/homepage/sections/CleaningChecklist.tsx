import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const points = [
  {
    title: "Schedule",
    body: "Daily, weekly or monthly tasks, grouped by area.",
  },
  {
    title: "Complete",
    body: "Staff choose their name in the app and mark the task done.",
  },
  {
    title: "Record",
    body: "One checklist per day, a PDF of that day, and one email if a task is overdue.",
  },
]

export const CleaningChecklist = () => (
  <section id="cleaning" className="home-section">
    <div className="home-wrap">
      <div className="home-eyebrow">Also in the dashboard</div>
      <h2 className="home-h2 mt-4 max-w-3xl">A cleaning checklist beside the labels.</h2>
      <p className="home-lead mt-4">
        Schedule the cleaning tasks your kitchen already runs. Staff mark them done, and you can
        open that day’s checklist or print it.
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {points.map((point) => (
          <li key={point.title} className="home-card p-6">
            <h3 className="text-lg font-extrabold">{point.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--home-muted)]">{point.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--home-muted)]">
        It records the checks you set. It does not log temperatures or certify the kitchen.
      </p>
      <Link href="/features#cleaning" className="home-link mt-4 inline-flex items-center gap-2">
        See how it fits
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </section>
)
