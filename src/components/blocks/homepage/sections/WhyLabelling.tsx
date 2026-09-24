import React from "react"

const questions = [
  "What was prepared?",
  "When was it prepared?",
  "When should it be used?",
  "What's inside?",
  "Which allergens are present?",
  "Does it need customer-facing information?",
]

export const WhyLabelling = () => (
  <section className="home-section">
    <div className="home-wrap">
      <div className="home-eyebrow">Why InstaLabel exists</div>
      <h2 className="home-h2 mt-4 max-w-3xl">Every kitchen has a labelling job to do.</h2>
      <p className="home-lead mt-4 max-w-2xl">
        A label looks like a small piece of paper. Behind it is information that needs to be right
        before the food moves on.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {questions.map((question) => (
          <li key={question} className="home-card px-4 py-3 text-sm font-semibold">
            {question}
          </li>
        ))}
      </ul>
      <p className="mt-8 max-w-2xl text-[1.05rem] leading-relaxed">
        InstaLabel brings that information together and turns it into the labels your kitchen
        needs.
      </p>
    </div>
  </section>
)
