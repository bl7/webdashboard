"use client"

import { Brain, CheckCircle2, XCircle, Download, ArrowRight, Trophy } from "lucide-react"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui"
import jsPDF from "jspdf"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const questions: Question[] = [
  {
    id: 1,
    question:
      "A customer asks whether a dish contains sesame. You're not 100% sure. What is the correct response?",
    options: [
      'Say "no" if you don\'t see sesame in the dish',
      "Check your allergen records or recipe sheets",
      "Ask another staff member who cooked it",
      "Tell the customer it's probably safe",
    ],
    correctAnswer: 1,
    explanation:
      "Always check your allergen records or recipe sheets when unsure. Never guess or assume - this could put customers at risk. If you're not certain, it's better to say you need to check than to give incorrect information.",
  },
  {
    id: 2,
    question: "Which of the following foods must be labelled as containing gluten?",
    options: ["Bread made with wheat", "Rice noodles", "Corn tortillas", "Fresh apples"],
    correctAnswer: 0,
    explanation:
      "Bread made with wheat contains gluten and must be clearly labelled. Rice noodles, corn tortillas, and fresh apples are naturally gluten-free and don't require gluten labelling.",
  },
  {
    id: 3,
    question:
      "Under Natasha's Law, which food businesses must provide full ingredient and allergen labelling?",
    options: [
      "Only large supermarkets",
      "All food businesses selling prepacked for direct sale (PPDS)",
      "Restaurants that only serve food on plates",
      "Takeaways that sell hot meals only",
    ],
    correctAnswer: 1,
    explanation:
      "Natasha's Law applies to all food businesses selling prepacked for direct sale (PPDS) foods, regardless of size. This includes cafes, restaurants, takeaways, and any business that packages food for immediate sale.",
  },
  {
    id: 4,
    question: "At which point in HACCP is allergen cross-contamination most likely to occur?",
    options: [
      "Taking payment",
      "During food preparation and cooking",
      "When serving food to tables",
      "When washing dishes",
    ],
    correctAnswer: 1,
    explanation:
      "Cross-contamination is most likely during food preparation and cooking when ingredients are being handled, mixed, and cooked. This is why proper cleaning procedures and separate equipment are crucial during this stage.",
  },
  {
    id: 5,
    question:
      "You've prepared chicken curry in the kitchen, and then you need to prepare a vegan curry in the same pan. What should you do first?",
    options: [
      "Rinse the pan with water",
      "Wipe it with a cloth",
      "Wash, rinse, and sanitise the pan thoroughly",
      "Cook the vegan curry quickly so contamination is unlikely",
    ],
    correctAnswer: 2,
    explanation:
      "You must wash, rinse, and sanitise the pan thoroughly to prevent cross-contamination. Simply rinsing or wiping is not sufficient to remove all traces of allergens that could affect customers with allergies.",
  },
  {
    id: 6,
    question: "A sauce contains milk, but the menu doesn't list it. What is the correct action?",
    options: [
      "Serve it anyway",
      "Update the ingredient/allergen info on the menu",
      "Only tell the customer if they ask",
      "Remove milk from the recipe silently",
    ],
    correctAnswer: 1,
    explanation:
      "You must immediately update the ingredient/allergen information on the menu. It's illegal to serve food with undeclared allergens, and this could put customers with milk allergies at serious risk.",
  },
  {
    id: 7,
    question: "Which of these is considered a major allergen under UK law?",
    options: ["Rice", "Peanuts", "Potatoes", "Sugar"],
    correctAnswer: 1,
    explanation:
      "Peanuts are one of the 14 major allergens that must be declared under UK law. Rice, potatoes, and sugar are not on the list of major allergens.",
  },
  {
    id: 8,
    question: "Which practice helps prevent allergen cross-contamination?",
    options: [
      "Using separate utensils and chopping boards for allergen-free dishes",
      "Rinsing utensils quickly under running water",
      "Cooking allergen and non-allergen dishes at the same time",
      "Wiping surfaces with a dry cloth",
    ],
    correctAnswer: 0,
    explanation:
      "Using separate utensils and chopping boards for allergen-free dishes is the best practice to prevent cross-contamination. This ensures no traces of allergens are transferred to allergen-free food.",
  },
  {
    id: 9,
    question: "If a customer with a peanut allergy is dining in, what is the safest approach?",
    options: [
      'Tell them "We don\'t use peanuts" without checking',
      "Confirm ingredients with staff and ensure separate preparation",
      "Advise them to avoid all dishes just in case",
      "Suggest they eat something cooked well so peanuts won't matter",
    ],
    correctAnswer: 1,
    explanation:
      "Always confirm ingredients with staff and ensure separate preparation for customers with allergies. Never make assumptions about ingredients, and always take extra precautions to prevent cross-contamination.",
  },
  {
    id: 10,
    question: "When updating recipes or introducing new dishes, what is a key compliance step?",
    options: [
      "Test taste only",
      "Update your allergen records and menu",
      "Ask the chef if it seems safe",
      "Serve a sample to staff",
    ],
    correctAnswer: 1,
    explanation:
      "You must update your allergen records and menu whenever recipes change or new dishes are introduced. This ensures all allergen information is current and accurate for customers.",
  },
]

export const AllergenGuideQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(questions.length).fill(-1)
  )
  const [showResults, setShowResults] = useState(false)
  const [showExplanation, setShowExplanation] = useState<number | null>(null)

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[questionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (answer === questions[index].correctAnswer ? 1 : 0)
    }, 0)
  }

  const score = calculateScore()
  const percentage = Math.round((score / questions.length) * 100)

  const getScoreMessage = () => {
    if (percentage >= 80)
      return "Excellent! You have a strong understanding of allergen compliance."
    if (percentage >= 60)
      return "Good! You understand the basics but could benefit from more training."
    return "You need more training on allergen compliance. Consider reviewing the guide above."
  }

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const generatePDF = () => {
    const doc = new jsPDF()

    // Set up fonts and styling
    doc.setFont("helvetica")
    doc.setFontSize(16)

    // Title
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("UK Food Safety & Allergen Quiz", 20, 20)
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("(10 Questions)", 20, 30)

    let yPosition = 50

    // Questions
    questions.forEach((question, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      // Question number and text with text wrapping
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      const questionText = `${index + 1}. ${question.question}`
      const questionLines = doc.splitTextToSize(questionText, 170)
      questionLines.forEach((line: string) => {
        doc.text(line, 20, yPosition)
        yPosition += 6
      })
      yPosition += 4

      // Options
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      question.options.forEach((option, optionIndex) => {
        const letter = String.fromCharCode(97 + optionIndex)
        const optionText = `${letter}) ${option}`
        const optionLines = doc.splitTextToSize(optionText, 165)
        optionLines.forEach((line: string) => {
          doc.text(line, 25, yPosition)
          yPosition += 5
        })
      })

      yPosition += 10
    })

    // Answer key on new page
    doc.addPage()
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Answer Key", 20, 20)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    let answerY = 40
    questions.forEach((question, index) => {
      // Answer
      doc.setFont("helvetica", "bold")
      doc.text(`${index + 1}. ${String.fromCharCode(97 + question.correctAnswer)}`, 20, answerY)
      answerY += 6

      // Explanation
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      const explanationLines = doc.splitTextToSize(question.explanation, 170)
      explanationLines.forEach((line: string) => {
        doc.text(line, 25, answerY)
        answerY += 4
      })

      answerY += 8
    })

    // Footer
    doc.setFontSize(10)
    doc.text("Generated by InstaLabel - UK Allergen Compliance Solutions", 20, 280)
    doc.text("www.instalabel.co", 20, 285)

    // Save the PDF
    doc.save("UK-Food-Safety-Allergen-Quiz.pdf")
  }

  return (
    <section id="quiz" className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Interactive Quiz</span>
          </div>
          <h3 className="mb-4 font-accent text-3xl font-bold text-gray-900 sm:text-4xl">
            🍽️ UK Food Safety & Allergen Quiz (10 Questions)
          </h3>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Answer 10 questions to test your understanding of allergen compliance and UK food safety
            regulations
          </p>
        </motion.div>

        {!showResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            {/* Progress bar */}
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                {questions[currentQuestion].question}
              </h3>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                      selectedAnswers[currentQuestion] === index
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                          selectedAnswers[currentQuestion] === index
                            ? "border-purple-500 bg-purple-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAnswers[currentQuestion] === index && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>

                {currentQuestion < questions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    disabled={selectedAnswers[currentQuestion] === -1}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowResults(true)}
                    disabled={selectedAnswers[currentQuestion] === -1}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    See Results
                    <Trophy className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-4xl"
          >
            {/* Results */}
            <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
              <div className="mb-8 text-center">
                <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                  <Trophy className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Quiz Complete!</h3>
                <div className={`text-4xl font-bold ${getScoreColor()} mb-2`}>
                  {score}/{questions.length} ({percentage}%)
                </div>
                <p className="text-gray-600">{getScoreMessage()}</p>
              </div>

              {/* Download CTA */}
              <div className="mb-8 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-6 text-center">
                <h4 className="mb-2 font-semibold text-gray-900">
                  Score {score}/10? Your staff should too!
                </h4>
                <p className="mb-4 text-gray-600">
                  Download this quiz as a training handout for your team
                </p>
                <Button onClick={generatePDF} className="bg-purple-600 hover:bg-purple-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download Quiz PDF
                </Button>
              </div>

              {/* Review Questions */}
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-gray-900">Review Your Answers:</h4>
                {questions.map((question, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <h5 className="font-semibold text-gray-900">
                        Question {index + 1}: {question.question}
                      </h5>
                      <div className="flex items-center gap-2">
                        {selectedAnswers[index] === question.correctAnswer ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>

                    <div className="mb-4 space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`rounded-lg p-3 ${
                            optionIndex === question.correctAnswer
                              ? "border border-green-200 bg-green-50"
                              : optionIndex === selectedAnswers[index] &&
                                  optionIndex !== question.correctAnswer
                                ? "border border-red-200 bg-red-50"
                                : "border border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {optionIndex === question.correctAnswer && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            )}
                            {optionIndex === selectedAnswers[index] &&
                              optionIndex !== question.correctAnswer && (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                            <span
                              className={`font-medium ${
                                optionIndex === question.correctAnswer
                                  ? "text-green-800"
                                  : optionIndex === selectedAnswers[index] &&
                                      optionIndex !== question.correctAnswer
                                    ? "text-red-800"
                                    : "text-gray-700"
                              }`}
                            >
                              {option}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowExplanation(showExplanation === index ? null : index)}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                      {showExplanation === index ? "Hide" : "Show"} Explanation
                    </button>

                    {showExplanation === index && (
                      <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <p className="text-sm text-blue-800">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* InstaLabel CTA Message */}
            <div className="rounded-lg bg-white p-6 text-center shadow-lg">
              <p className="text-lg text-gray-700">
                Correct labelling isn't just about passing a quiz — it's the law. With InstaLabel,
                you can print compliant allergen labels in seconds.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
