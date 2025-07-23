"use client"
import React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui"

const faqsList = [
  {
    q: "What is InstaLabel?",
    a: "InstaLabel is a professional kitchen labeling system designed for restaurants, cafés, food trucks, and catering businesses. It lets you print food safety labels—prep, cook, use‑first, PPDS—instantly from any device without handwriting, fully compliant with regulations like Natasha’s Law."
  },
  {
    q: "Who benefits most from InstaLabel?",
    a: "Food operations of all sizes benefit—especially those with busy prep areas, high staff turnover, or needing airtight compliance. Ideal for multi‑location kitchens striving to reduce waste and errors."
  },
  {
    q: "How does InstaLabel ensure compliance?",
    a: "All labels include auto-calculated prep dates and expiry, highlight allergens (Natasha’s Law), and use FDA/EHO-approved templates. The system generates complete print logs for easy audits."
  },
  {
    q: "Which label types are supported?",
    a: (
      <ul className="list-disc ml-6">
        <li>Prep, Cook, Use-First, and PPDS labels</li>
        <li>Custom templates available</li>
        <li>Each includes ingredients, allergen alerts, prep/expiry dates, and storage instructions</li>
      </ul>
    )
  },
  {
    q: "What equipment do I need?",
    a: "Just any USB thermal label printer—or Sunmi Android devices for mobile printing. No special hardware required."
  },
  {
    q: "How fast is setup and printing?",
    a: "You can get started in minutes: upload your menu or ingredient list, plug in your printer, select the label type, and print—no drivers or plugins needed."
  },
  {
    q: "Can I override expiry dates?",
    a: "Yes—InstaLabel lets you adjust or override expiry logic when needed, while keeping full logging for traceability."
  },
  {
    q: "What results can I expect?",
    a: "Restaurants save about 15+ hours per week, reduce waste by 30%, and avoid compliance fines—all typically paying back in the first month."
  },
  {
    q: "Is there a trial available?",
    a: "Yes! Try InstaLabel free for 14 days—no credit card required—with full access to features and existing printer support."
  }
]

export default function FAQPage() {
  const [value, setValue] = React.useState("1")
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold my-8">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible value={value} onValueChange={setValue} className="w-full">
        {faqsList.map((item, idx) => (
          <AccordionItem key={item.q} value={(idx + 1).toString()}>
            <AccordionTrigger className="text-base">{item.q}</AccordionTrigger>
            <AccordionContent className="text-lg text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  )
}
