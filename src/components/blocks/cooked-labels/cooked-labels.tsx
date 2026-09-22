"use client"

import React from "react"
import { OperationalLabelPage } from "@/components/blocks/operational-label/OperationalLabelPage"

export const CookedLabelsPage = () => (
  <OperationalLabelPage
    config={{
      badge: "Cooked labels",
      h1: "Keep cooked batches easy to identify.",
      heroBody:
        "Print a consistent cooked label with the item's recorded information and relevant date. Keep the label alongside the cooking, cooling and storage records your kitchen requires.",
      whenTitle: "Identify the item after cooking.",
      whenBody:
        "Use cooked labels when an item needs to remain identifiable through the next stage of your kitchen's process. Choose the correct record and check the date against the procedure for that batch.",
      exampleTitle: "A cooked label with readable item information.",
      itemName: "Chicken curry",
      labelType: "cooked",
      allergens: ["Milk", "Mustard"],
      ingredients: [
        { uuid: "c1", ingredientName: "Chicken", allergens: [] },
        { uuid: "c2", ingredientName: "Cream", allergens: [{ allergenName: "Milk" }] },
        { uuid: "c3", ingredientName: "Mustard", allergens: [{ allergenName: "Mustard" }] },
      ],
      callouts: [
        { title: "Dish name", body: "Identifies the cooked item." },
        { title: "Cooked label type", body: "Shows this is a cooked-batch label." },
        { title: "Printed date", body: "Records when the label was created." },
        { title: "Configured expiry", body: "Comes from your kitchen's date settings." },
        { title: "Recorded allergens", body: "Shows the allergen information on the item record." },
        { title: "Staff initials", body: "The identifier recorded by the workflow." },
      ],
      caption:
        "Illustrative label for the stated example recipe. This specimen does not record a cooking temperature or prove that a cooking check was completed.",
      workflowTitle: "Check the item before you print.",
      steps: [
        "Complete the cooking and other checks required by your kitchen's procedure.",
        "Select the correct item and cooked label type.",
        "Review the dates, allergens and preview.",
        "Print and apply the label to the matching batch.",
      ],
      handoverTitle: "Give the next station a clear starting point.",
      handoverBody:
        "A readable item name and consistent date format help staff identify what they are handling. Continue using your established temperature, cooling and storage records for those checks.",
      faqs: [
        {
          question: "Does this label measure cooking temperature?",
          answer:
            "No. Printing a label does not measure temperature. Use the monitoring process required by your kitchen.",
        },
        {
          question: "Is the printed date the cooked date?",
          answer:
            "Not automatically. Describe the actual event a field records; do not infer one from the other.",
        },
        {
          question: "Does it replace a HACCP record?",
          answer:
            "It may form part of your records, but does not replace the wider checks and evidence your procedure requires.",
        },
      ],
      closingTitle: "See the cooked-label workflow.",
      closingBody:
        "Bring an example item and review how its recorded information appears on the label.",
    }}
  />
)
