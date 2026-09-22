"use client"

import React from "react"
import { OperationalLabelPage } from "@/components/blocks/operational-label/OperationalLabelPage"

export const DefrostLabelsPage = () => (
  <OperationalLabelPage
    config={{
      badge: "Defrost labels",
      h1: "Keep the defrost workflow clear between shifts.",
      heroBody:
        "Identify food moving out of frozen storage and keep the relevant item information visible. Check the label against the actual stage of your kitchen's defrosting procedure.",
      whenTitle: "Identify the item and its current stage.",
      whenBody:
        "Use the defrost workflow to distinguish items being handled under your kitchen's defrosting process. Record and check actual start or completion events in the system your procedure uses. A label does not establish that an item has finished defrosting.",
      exampleTitle: "See the item information clearly.",
      itemName: "Cod fillet",
      labelType: "default",
      allergens: ["Fish"],
      ingredients: [{ uuid: "d1", ingredientName: "Cod fillet", allergens: [{ allergenName: "Fish" }] }],
      callouts: [
        { title: "Item name", body: "Identifies the food being handled." },
        { title: "Printed date", body: "Records when the label was created." },
        { title: "Configured expiry", body: "Comes from your kitchen's date settings." },
        { title: "Recorded allergens", body: "Shows the allergen information on the item record." },
        { title: "Staff initials", body: "The identifier recorded by the workflow." },
      ],
      caption:
        "Illustrative defrost-workflow label. Printing and defrost completion are separate events.",
      workflowTitle: "Match the dates to the real process.",
      steps: [
        "Select the item and the defrost workflow.",
        "Check which event the date settings relate to.",
        "Review the label and any separate records required by your procedure.",
        "Print and apply the label to the correct item.",
      ],
      handoverTitle: "Leave clear information for the next check.",
      handoverBody:
        "Use the label alongside the records your team relies on to know the item's status. Do not use an automatically calculated date as evidence that a physical defrosting step is complete.",
      faqs: [
        {
          question: "Does InstaLabel know when food has fully defrosted?",
          answer:
            "A printed label does not measure that condition. Follow your kitchen's checks and record the actual event.",
        },
        {
          question: "Can the printed date stand in for the defrost start time?",
          answer:
            "Only where the workflow and procedure accurately make those the same event. Otherwise keep them distinct.",
        },
        {
          question: "Does a new label extend the use period?",
          answer:
            "No. Check the original information and the applicable date rule before replacing a label.",
        },
      ],
      closingTitle: "Review your defrost labelling routine.",
      closingBody:
        "Walk through an example with the team and check which information appears on the label.",
    }}
  />
)
