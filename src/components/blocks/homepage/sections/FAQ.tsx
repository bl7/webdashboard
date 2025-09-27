"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"

export const FAQ = () => {
  const faqs = [
    {
      question: "What is InstaLabel?",
      answer: "A simple Android + web app that prints compliant kitchen labels in seconds.",
    },
    {
      question: "Do I need a label printer?",
      answer: "Yes — InstaLabel works with most USB and Bluetooth label printers.",
    },
    {
      question: "How do I print from the Android app?",
      answer: "Connect your Bluetooth label printer and start printing instantly.",
    },
    {
      question: "How do I print from the web app?",
      answer: "Install our lightweight PrintBridge to connect your browser with your printer.",
    },
    {
      question: "How quickly can I get set up?",
      answer: "In just minutes — sign up, add your items, connect your printer, and go.",
    },
    {
      question: "What labels can I print?",
      answer: "Prep, cook, PPDS, ingredient, defrost, use-first, and custom expiry labels.",
    },
    {
      question: "Does InstaLabel help with compliance?",
      answer: "Yes — allergens and expiry rules are built in for Natasha's Law compliance.",
    },
    {
      question: "Will it save time in my kitchen?",
      answer: "Absolutely — print in seconds, cut errors, and stop wasting time on handwriting.",
    },
    {
      question: "Can I try it before paying?",
      answer: "Yes, start with a free trial and test with your own printer.",
    },
  ]

  // Split FAQs into two columns
  const leftColumnFAQs = faqs.slice(0, Math.ceil(faqs.length / 2))
  const rightColumnFAQs = faqs.slice(Math.ceil(faqs.length / 2))

  return (
    <section className="relative bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-semibold text-purple-800 ring-1 ring-purple-200">
            <HelpCircle className="mr-2 h-4 w-4" />
            Frequently Asked Questions
          </div>

          <h3 className="mb-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Got questions?
            </span>
            <br />
            <span className="text-gray-900">We've got answers.</span>
          </h3>
        </motion.div>

        {/* FAQ Accordion - 2 Columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid gap-8 lg:grid-cols-2"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {leftColumnFAQs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-lg border border-gray-200 bg-white/50 px-4 transition-all duration-300 hover:bg-white hover:shadow-sm"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold text-gray-900 hover:text-purple-600 [&[data-state=open]]:text-purple-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {rightColumnFAQs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index + leftColumnFAQs.length}`}
                  className="rounded-lg border border-gray-200 bg-white/50 px-4 transition-all duration-300 hover:bg-white hover:shadow-sm"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold text-gray-900 hover:text-purple-600 [&[data-state=open]]:text-purple-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="mb-8">
            <h4 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                See InstaLabel in Action
              </span>
            </h4>
            <p className="text-lg text-gray-600">
              Watch how easy it is to create compliant kitchen labels in seconds
            </p>
          </div>

          <div className="flex justify-center">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/NPSIOvzwJ-s"
              title="InstaLabel Demo - See How Easy Kitchen Labeling Can Be"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full max-w-4xl rounded-xl shadow-lg"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
