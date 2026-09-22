"use client"

import React from "react"
import { OperationalLabelPage } from "@/components/blocks/operational-label/OperationalLabelPage"

export const IngredientLabelsPage = () => (
  <OperationalLabelPage
    config={{
      badge: "Ingredient labels",
      h1: "Know what is in the container.",
      heroBody:
        "Print clear ingredient labels for stored or decanted items. Keep the item name and relevant date information easy to find during preparation and shift handovers.",
      whenTitle: "Give stored ingredients a consistent identity.",
      whenBody:
        "Use an ingredient label when an item needs clear identification in your kitchen's storage system. Keep the original supplier and traceability information your procedures require; a new container label is not a substitute for it.",
      exampleTitle: "An ingredient label at a glance.",
      itemName: "Fresh basil",
      labelType: "default",
      allergens: [],
      ingredients: [{ uuid: "b1", ingredientName: "Fresh basil", allergens: [] }],
      callouts: [
        { title: "Item name", body: "Identifies the contents." },
        {
          title: "Date fields",
          body: "Distinguish printing from the applicable expiry.",
        },
        {
          title: "Staff initials",
          body: "Show the identifier recorded by the workflow.",
        },
      ],
      caption: "Illustrative ingredient-label layout. Check item information and dates before use.",
      workflowTitle: "Select, check and label.",
      steps: [
        "Select the correct ingredient record.",
        "Check its date and recorded information.",
        "Review the preview, print and apply the label to the right container.",
      ],
      handoverTitle: "Make the next shift's checks easier.",
      handoverBody:
        "A consistent product name and readable date give staff a useful starting point. Use the label with your normal storage, stock-rotation and ingredient checks.",
      faqs: [
        {
          question: "Does an ingredient label replace the supplier label?",
          answer:
            "Keep the source information your kitchen needs. A container label supports day-to-day identification.",
        },
        {
          question: "Is 40mm always the correct size?",
          answer:
            "Choose a supported label size that fits the information and remains readable on the container. Check your printer and stock dimensions.",
        },
        {
          question: "Does a printed date prove when the ingredient was opened?",
          answer: "No. Only describe an opening date where the actual workflow records it.",
        },
      ],
      closingTitle: "Bring clearer identification to your ingredient storage.",
      closingBody: "See how one of your regular ingredients looks in the label workflow.",
      hideEmptyContains: true,
    }}
  />
)
