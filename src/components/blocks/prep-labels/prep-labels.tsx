"use client"

import React from "react"
import { OperationalLabelPage } from "@/components/blocks/operational-label/OperationalLabelPage"

export const PrepLabelsPage = () => (
  <OperationalLabelPage
    config={{
      badge: "Prep labels",
      h1: "Keep prepared items clear between shifts.",
      heroBody:
        "Label prepared ingredients and dishes before they move into storage or the next stage of service. Reuse recorded item information and review the applicable date before printing.",
      whenTitle: "For items prepared ahead of service.",
      whenBody:
        "Use prep labels for tasks such as prepared vegetables or a mixture assembled in advance. Select the item and label type that match the work actually carried out.",
      exampleTitle: "See the information on a prep label.",
      itemName: "Mixed vegetables",
      labelType: "prep",
      allergens: ["Celery"],
      ingredients: [
        { uuid: "6", ingredientName: "Carrots", allergens: [] },
        { uuid: "7", ingredientName: "Broccoli", allergens: [] },
        { uuid: "8", ingredientName: "Celery", allergens: [{ allergenName: "Celery" }] },
        { uuid: "9", ingredientName: "Peppers", allergens: [] },
      ],
      callouts: [
        { title: "Product name", body: "Identifies the prepared item." },
        { title: "Prep label type", body: "Shows this is an internal prep label." },
        { title: "Configured expiry", body: "Comes from your kitchen's date settings." },
        { title: "Printed date", body: "Records when the label was created." },
        { title: "Recorded allergens", body: "Shows the allergen information on the item record." },
        { title: "Staff initials", body: "The identifier recorded by the workflow." },
      ],
      caption:
        "Illustrative layout for a recipe containing celery. This is an internal prep label, not a complete PPDS ingredient label.",
      workflowTitle: "Finish the preparation with a checked label.",
      steps: [
        "Select the prepared item and prep label type.",
        "Check the recorded allergens and applicable date.",
        "Review the preview and print.",
        "Apply the label to the matching container before the handover.",
      ],
      handoverTitle: "Give the next shift the same information.",
      handoverBody:
        "Use consistent item names and readable dates so staff can identify prepared items without recreating the label. Keep any additional batch or preparation records required by your procedure.",
      faqs: [
        {
          question: "Is this the same as a PPDS label?",
          answer:
            "No. A prep label supports internal kitchen work. PPDS food needs the appropriate customer-facing ingredient information.",
        },
        {
          question: "Does the print timestamp show when preparation happened?",
          answer:
            "Only if those events genuinely coincide and the workflow records it that way. Do not substitute printing time for a required preparation record.",
        },
        {
          question: "Will the label show a batch code?",
          answer:
            "Use the fields supported by your current template. Check the actual output before relying on a batch identifier.",
        },
      ],
      closingTitle: "See a prep item move from record to label.",
      closingBody: "Walk through a representative item from your preparation list.",
    }}
  />
)
