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
    body: "One checklist per day, a PDF of that day, and one diary email at the time the kitchen chooses.",
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
      <img
        src="/marketing/cleaning-checklist.jpg"
        alt="Cleaning checklist on the InstaLabel dashboard and the Android app"
        className="mt-8 w-full rounded-lg"
      />
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {points.map((point) => (
          <li key={point.title} className="home-card p-6">
            <h3 className="text-lg font-extrabold">{point.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--home-muted)]">{point.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--home-muted)]">
        It records the cleaning checks you set. It does not certify the kitchen.
      </p>
      <Link href="/features#cleaning" className="home-link mt-4 inline-flex items-center gap-2">
        See how it fits
        <ArrowRight className="h-4 w-4" />
      </Link>
      <h3 className="mt-16 max-w-3xl text-3xl font-extrabold tracking-tight">Temperature records in the diary.</h3>
      <p className="home-lead mt-4 max-w-2xl">
        Staff enter equipment, food and delivery temperatures on the phone. The dashboard shows
        today’s record and what is still to enter. Those checks stay separate from the cleaning list
        and are included in the diary.
      </p>
      <img
        src="/marketing/temperature-records.jpg"
        alt="Temperature records on the InstaLabel dashboard and the Android app"
        className="mt-8 w-full rounded-lg"
      />
    </div>
  </section>
)
