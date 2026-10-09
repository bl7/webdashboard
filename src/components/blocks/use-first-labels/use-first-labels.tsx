"use client"

import React from "react"
import { OperationalLabelPage } from "@/components/blocks/operational-label/OperationalLabelPage"

export const UseFirstLabelsPage = () => (
  <OperationalLabelPage
    config={{
      badge: "Use first labels",
      h1: "Use-first labels that make stock priorities visible.",
      heroBody:
        "Print a Use First marker so the next person can see which container to take. It is a stock-rotation sign. It does not set a shelf life and it does not replace the item's own date label.",
      whenTitle: "Point staff at the container that should be used next.",
      whenBody:
        "The label prints the words Use First. Put it on the container your team should take before the others. The food's date still comes from that item's own label and your kitchen's date rule.",
      exampleTitle: "The marker on its own.",
      itemName: "USE FIRST",
      labelType: "default",
      allergens: [],
      ingredients: [],
      callouts: [
        { title: "Use First", body: "The only words on this label." },
        {
          title: "No new shelf life",
          body: "Printing it does not change how long the food may be kept.",
        },
        {
          title: "The item label stays",
          body: "Keep the product's own name, date and allergen label in place.",
        },
      ],
      caption: "Illustrative Use First marker. It does not record a date or an allergen.",
      workflowTitle: "Choose the container, then print the marker.",
      steps: [
        "Decide which container should be used next.",
        "Print the Use First label.",
        "Apply it to that container, alongside the item's own label.",
        "Remove it when that container is finished. Do not move it to a newer product to extend a date.",
      ],
      handoverTitle: "The marker shows priority. The date label shows the limit.",
      handoverBody:
        "Staff still read the item's own date and follow the kitchen's stock checks. A Use First label does not restart or replace that date.",
      faqs: [
        {
          question: "Does a Use First label change the shelf life?",
          answer: "No. It does not calculate, extend or replace the date on the item.",
        },
        {
          question: "Does it record allergens?",
          answer: "No. Allergen information stays on the item's own label and records.",
        },
        {
          question: "Can it go on any container?",
          answer:
            "Only the container the team should use next. Moving the marker to a different product does not transfer that product's date.",
        },
      ],
      heroNote: "Illustrative marker. It does not print a date or an allergen.",
      closingTitle: "Mark the container the team should take next.",
      closingBody: "Print the marker, leave the item's own date label where it is, and check both at handover.",
    }}
  />
)
