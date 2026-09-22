import React from "react"

const steps = [
  {
    n: "01",
    title: "Click it.",
    body: "Choose your saved item and the label type for the task.",
  },
  {
    n: "02",
    title: "Print it.",
    body: "Check the details and preview, then send the label to your configured printer.",
  },
  {
    n: "03",
    title: "Label it.",
    body: "Apply the label to the correct item, ready for the next person who needs it.",
  },
]

export const EverydaySteps = () => (
  <section className="home-section">
    <div className="home-wrap">
      <div className="home-eyebrow">Keep the good work moving</div>
      <h2 className="home-h2 mt-4">From your item to your next label.</h2>
      <p className="home-lead mt-4">
        With your items and printer set up, the everyday workflow is simple.
      </p>
      <ol className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <li key={step.n}>
            <p className="font-mono text-sm font-bold text-[var(--home-forest)]">{step.n}</p>
            <h3 className="mt-2 text-2xl font-extrabold">{step.title}</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--home-muted)]">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  </section>
)
