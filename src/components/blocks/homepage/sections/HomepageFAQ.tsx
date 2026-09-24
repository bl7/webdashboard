"use client"

import React from "react"
import Link from "next/link"
import { emitHomeEvent } from "../home-labels"

const faqs = [
  {
    q: "Do I need to buy an InstaLabel printer?",
    a: (
      <>
        No proprietary InstaLabel printer is required. Desktop printing uses PrintBridge with a
        label printer installed on Windows or macOS. Android uses supported Bluetooth models.{" "}
        <Link href="/kitchen-label-printer" className="home-link">
          Check compatibility
        </Link>{" "}
        before choosing your equipment.
      </>
    ),
  },
  {
    q: "Can I bring my existing items with me?",
    a: (
      <>
        Yes. Use{" "}
        <Link href="/features#csv-import" className="home-link">
          CSV import
        </Link>{" "}
        to bring in item information, then review the ingredients, allergens and date settings
        before printing.
      </>
    ),
  },
  {
    q: "What about allergens and PPDS labels?",
    a: (
      <>
        InstaLabel helps you prepare labels using recorded ingredient and allergen information,
        including{" "}
        <Link href="/natashas-law" className="home-link">
          PPDS layouts
        </Link>{" "}
        with ingredient lists and allergen emphasis. Your team still checks recipes, supplier
        information and the finished labels.
      </>
    ),
  },
  {
    q: "Who decides the dates on my labels?",
    a: (
      <>
        Your business sets the date rules. InstaLabel applies those settings to your labelling
        workflow. Check they match your food-safety procedures and the item you are labelling.
      </>
    ),
  },
  {
    q: "Which label sizes does InstaLabel print?",
    a: (
      <>
        Two formats: 60 × 40 mm and 56 × 80 mm. Both support prep, opened, cooked, defrost,
        use-first and PPDS labels. InstaLabel changes the layout to fit the size you select.
      </>
    ),
  },
  {
    q: "Does InstaLabel make my kitchen legally compliant?",
    a: (
      <>
        No. InstaLabel is a labelling system. Your business configures ingredients, allergens and
        date rules, and your team checks recipes, supplier information and the finished labels.
      </>
    ),
  },
  {
    q: "Can I see it working before I decide?",
    a: (
      <>
        Yes.{" "}
        <Link
          href="/register"
          className="home-link"
          onClick={() => emitHomeEvent("trial_click", { location: "faq" })}
        >
          Start a free trial
        </Link>{" "}
        to explore it with your own items, or{" "}
        <Link
          href="/bookdemo"
          className="home-link"
          onClick={() => emitHomeEvent("demo_click", { location: "faq" })}
        >
          book a demo
        </Link>{" "}
        to walk through your workflow and equipment. You can see current plans and terms on the{" "}
        <Link href="/plan" className="home-link">
          pricing page
        </Link>
        .
      </>
    ),
  },
]

export const HomepageFAQ = () => (
  <section className="home-section">
    <div className="home-wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <div className="home-eyebrow">Good questions</div>
        <h2 className="home-h2 mt-4">Before you get rolling.</h2>
        <p className="home-lead mt-4">Need to talk through your kitchen’s setup?</p>
        <Link
          href="/bookdemo"
          className="home-link mt-4 inline-block"
          onClick={() => emitHomeEvent("demo_click", { location: "faq" })}
        >
          Let’s walk through it
        </Link>
      </div>
      <div>
        {faqs.map((faq, index) => (
          <details
            key={faq.q}
            className="home-faq"
            onToggle={(event) => {
              if ((event.currentTarget as HTMLDetailsElement).open) {
                emitHomeEvent("faq_open", { index: String(index) })
              }
            }}
          >
            <summary>{faq.q}</summary>
            <div className="home-faq-body">{faq.a}</div>
          </details>
        ))}
      </div>
    </div>
  </section>
)
