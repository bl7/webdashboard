"use client"

import React, { useState } from "react"
import { ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui"

const questions = [
  {
    question: "A customer asks about sesame and you are unsure. What should you do?",
    options: [
      "Guess from appearance.",
      "Check the current records and resolve uncertainty before advising.",
      "Assume a small amount does not matter.",
    ],
    correct: 1,
    explanation:
      "Appearance does not establish the ingredients. Check the source information and your kitchen's process.",
  },
  {
    question: "A supplier replaces a sauce with a different brand. What comes next?",
    options: [
      "Reuse the old record.",
      "Check the new specification and update affected information.",
      "Change only the price.",
    ],
    correct: 1,
    explanation: "A similar product name can conceal a different recipe.",
  },
  {
    question: "Which is a complete source for a bought-in dressing's ingredients?",
    options: [
      "Its name.",
      "A photo.",
      "Its current supplier specification or ingredient declaration.",
    ],
    correct: 2,
    explanation: "Use source information for compound ingredients.",
  },
  {
    question: "Does a printed label establish that cross-contact has been prevented?",
    options: ["Yes.", "Only if it is coloured.", "No."],
    correct: 2,
    explanation: "Food handling needs its own controls.",
  },
  {
    question: "Is every food put in a takeaway container automatically PPDS?",
    options: ["Yes.", "No, the packing and sales context matters.", "Only hot food."],
    correct: 1,
    explanation: "Check when it was packed and how it was ordered and sold.",
  },
  {
    question: "Which emphasis must remain readable on a monochrome label?",
    options: [
      "A colour difference alone.",
      "The relevant allergen text, using a visible treatment such as bold.",
      "An app-only icon.",
    ],
    correct: 1,
    explanation:
      "Check the actual printed result rather than relying on the screen's colour.",
  },
  {
    question: "Does a dish name prove a full ingredient list?",
    options: ["Yes.", "No.", "Only if the dish is familiar."],
    correct: 1,
    explanation: "Ingredients vary between recipes and suppliers.",
  },
  {
    question: "Is a print timestamp necessarily the cooking time?",
    options: ["Yes.", "Only on a large label.", "No."],
    correct: 2,
    explanation:
      "Printing and cooking are separate events unless the actual workflow records otherwise.",
  },
  {
    question: "What should happen after changing an item record?",
    options: [
      "Assume old paper labels have changed.",
      "Review future labels and follow the kitchen's procedure for already labelled items.",
      "Nothing.",
    ],
    correct: 1,
    explanation: "Updating a record cannot change an existing printed label.",
  },
  {
    question: "What does this quiz result demonstrate?",
    options: [
      "Legal certification.",
      "Inspection approval.",
      "Completion of a practice exercise.",
    ],
    correct: 2,
    explanation: "Training and compliance require more than this quiz.",
  },
]

const letters = ["A", "B", "C"]

export const AllergenGuideQuiz = () => {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<number[]>(() => questions.map(() => -1))
  const [view, setView] = useState<"quiz" | "result" | "review">("quiz")

  const selected = answers[current]
  const correctCount = answers.reduce(
    (total, answer, index) => total + (answer === questions[index].correct ? 1 : 0),
    0
  )

  const choose = (index: number) => {
    const next = [...answers]
    next[current] = index
    setAnswers(next)
  }

  const reset = () => {
    setAnswers(questions.map(() => -1))
    setCurrent(0)
    setView("quiz")
  }

  return (
    <section
      id="quiz"
      className="scroll-mt-24 bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16"
      style={{ scrollMarginTop: "7rem" }}
    >
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Practise everyday allergen decisions.
        </h2>
        <p className="mb-10 text-base leading-relaxed text-mkt-ink8">
          Ten short questions to discuss with your team. This is a practice exercise, not a
          qualification or compliance assessment.
        </p>

        {view === "quiz" ? (
          <div className="rounded-xl border border-mkt-steel1 bg-white p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between text-sm text-mkt-steel">
              <span>
                Question {current + 1} of {questions.length}
              </span>
            </div>
            <h3 className="mb-6 text-lg font-bold text-mkt-ink">{questions[current].question}</h3>
            <div className="space-y-3">
              {questions[current].options.map((option, index) => {
                const isSelected = selected === index
                const isCorrect = index === questions[current].correct
                const revealed = selected !== -1
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => choose(index)}
                    className={`w-full rounded-lg border-2 p-4 text-left text-sm transition-colors ${
                      revealed && isCorrect
                        ? "border-[#17675f] bg-[#e4f1ee]"
                        : revealed && isSelected
                          ? "border-[#a93a35] bg-[#f8eceb]"
                          : isSelected
                            ? "border-mkt-ink bg-mkt-canvas"
                            : "border-mkt-steel1 hover:border-mkt-ink"
                    }`}
                  >
                    <span className="mr-2 font-semibold text-mkt-ink">{letters[index]}:</span>
                    <span className="text-mkt-ink8">{option}</span>
                  </button>
                )
              })}
            </div>
            {selected !== -1 ? (
              <p className="mt-6 text-sm leading-relaxed text-mkt-ink8">
                <strong className="text-mkt-ink">
                  {letters[questions[current].correct]}.{" "}
                </strong>
                {questions[current].explanation}
              </p>
            ) : null}
            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={() => setCurrent((value) => Math.max(0, value - 1))}
                disabled={current === 0}
              >
                Previous
              </Button>
              {current < questions.length - 1 ? (
                <Button
                  className="bg-mkt-ink text-white hover:bg-mkt-ink"
                  onClick={() => setCurrent((value) => value + 1)}
                  disabled={selected === -1}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="bg-mkt-ink text-white hover:bg-mkt-ink"
                  onClick={() => setView("result")}
                  disabled={selected === -1}
                >
                  See result
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-mkt-steel1 bg-white p-6 sm:p-8">
            <h3 className="mb-3 text-2xl font-black tracking-tight text-mkt-ink">
              Your practice result: {correctCount} of 10
            </h3>
            <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
              Review any explanations you missed and discuss how your kitchen handles those
              situations.
            </p>
            <div className="mb-8 flex flex-wrap gap-3">
              <Button
                className="bg-mkt-ink text-white hover:bg-mkt-ink"
                onClick={() => setView("review")}
              >
                Review answers
              </Button>
              <Button variant="outline" onClick={reset}>
                Try again
              </Button>
            </div>
            {view === "review" ? (
              <div className="space-y-6">
                {questions.map((item, index) => {
                  const chosen = answers[index]
                  const gotRight = chosen === item.correct
                  return (
                    <div key={item.question} className="rounded-lg border border-mkt-steel1 p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-mkt-ink">
                          {index + 1}. {item.question}
                        </p>
                        {gotRight ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-mkt-teal" />
                        ) : (
                          <XCircle className="h-5 w-5 shrink-0 text-[#a93a35]" />
                        )}
                      </div>
                      <p className="mb-2 text-sm text-mkt-ink8">
                        Your answer: {chosen === -1 ? "Not answered" : `${letters[chosen]}: ${item.options[chosen]}`}
                      </p>
                      <p className="mb-2 text-sm text-mkt-ink8">
                        Correct: {letters[item.correct]}: {item.options[item.correct]}
                      </p>
                      <p className="text-sm leading-relaxed text-mkt-steel">{item.explanation}</p>
                    </div>
                  )
                })}
                <Button variant="outline" onClick={reset}>
                  Try again
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
