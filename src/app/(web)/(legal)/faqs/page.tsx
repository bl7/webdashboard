"use client"
import React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui"

export default function FAQPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">❓ What is InstaLabel?</h2>
          <p>
            InstaLabel is a professional kitchen labeling system designed for restaurants, cafés, food trucks, and catering businesses. It lets you print food safety labels—prep, cook, use‑first, PPDS—instantly from any device without handwriting, fully compliant with regulations like Natasha&rsquo;s Law.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">❓ Who benefits most from InstaLabel?</h2>
          <p>
            Food operations of all sizes benefit—especially those with busy prep areas, high staff turnover, or needing airtight compliance. Ideal for multi‑location kitchens striving to reduce waste and errors.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">❓ How does InstaLabel ensure compliance?</h2>
          <p>
            All labels include auto-calculated prep dates and expiry, highlight allergens (Natasha&rsquo;s Law), and use FDA/EHO-approved templates. The system generates complete print logs for easy audits.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">❓ Which label types are supported?</h2>
          <ul className="list-disc ml-6">
            <li>Prep, Cook, Use-First, and PPDS labels</li>
            <li>Custom templates available</li>
            <li>Each includes ingredients, allergen alerts, prep/expiry dates, and storage instructions</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">❓ What equipment do I need?</h2>
          <p>
            Just any USB thermal label printer—or Sunmi Android devices for mobile printing. No special hardware required.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">❓ How fast is setup and printing?</h2>
          <p>
            You can get started in minutes: upload your menu or ingredient list, plug in your printer, select the label type, and print—no drivers or plugins needed.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">❓ Can I override expiry dates?</h2>
          <p>
            Yes—InstaLabel lets you adjust or override expiry logic when needed, while keeping full logging for traceability.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">❓ What results can I expect?</h2>
          <p>
            Restaurants save about 15+ hours per week, reduce waste by 30%, and avoid compliance fines—all typically paying back in the first month.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">❓ Is there a trial available?</h2>
          <p>
            Yes! Try InstaLabel free for 14 days—no credit card required—with full access to features and existing printer support.
          </p>
        </div>
      </div>
    </main>
  )
}
