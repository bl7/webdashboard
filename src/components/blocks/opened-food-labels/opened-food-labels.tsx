"use client"

import { OperationalLabelPage } from "@/components/blocks/operational-label/OperationalLabelPage"

export const OpenedFoodLabelsPage = () => (
  <OperationalLabelPage
    config={{
      badge: "Ingredient labels",
      h1: "Label an opened pack with an ingredient label.",
      heroBody:
        "There is no separate opened label type. Select the ingredient, check the date from the shelf-life days you saved, and print.",
      whenTitle: "For a supplier pack you have started.",
      whenBody:
        "Cream, sauces and other bought-in products can have instructions that apply after opening. Print an ingredient label for that product. Set the shelf-life days from the pack. Opening it does not reset the manufacturer's date, and the software does not read that date off the pack.",
      exampleTitle: "See the information on the ingredient label.",
      itemName: "Double cream",
      itemType: "ingredients",
      labelType: "default",
      allergens: ["Milk"],
      ingredients: [
        { uuid: "1", ingredientName: "Double cream", allergens: [{ allergenName: "Milk" }] },
      ],
      callouts: [
        { title: "Product name", body: "The ingredient you selected." },
        { title: "Saved date", body: "Comes from the shelf-life days stored for that ingredient." },
        { title: "Recorded allergens", body: "Shows the allergen information saved for that ingredient." },
      ],
      caption:
        "Illustrative ingredient label for double cream. This is not a separate opened-label type.",
      workflowTitle: "Label the pack that actually changed.",
      steps: [
        "Select the ingredient for the pack that was opened.",
        "Check the supplier date, storage instructions and after-opening limit.",
        "Review the preview and print for that pack or decanted container.",
        "Apply the label so the next shift can read it.",
      ],
      handoverTitle: "Leave a readable reference for the next shift.",
      handoverBody:
        "Use the same ingredient label for each opened pack. The label applies the shelf-life days you saved. It does not override a manufacturer's date.",
      faqs: [
        {
          question: "Should I replace the manufacturer's use-by date?",
          answer:
            "Keep the original date and instructions when you set the shelf-life days. The ingredient label uses those saved days. It does not replace the manufacturer's date.",
        },
      ],
      closingTitle: "Try one opened product from your fridge.",
      closingBody: "Print it on the stock you use and check the date against the supplier pack.",
    }}
  />
)
