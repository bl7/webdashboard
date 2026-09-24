import React from "react"
import { UsesHero } from "./sections"
import { UsesBody } from "./sections/UsesBody"
import { ShotStrip } from "@/components/marketing/MediaSlot"

export const Uses = () => {
  return (
    <>
      <UsesHero />
      <ShotStrip
        title="One label for the job in front of you."
        shots={[
          {
            file: "prep-on-container.png",
            alt: "Prep label on a container",
            label: "Prep. Replace with the label on a real container.",
          },
          {
            file: "cooked-on-container.jpg",
            alt: "Cooked label on a container",
            label: "Cooked.",
          },
          {
            file: "defrost-on-container.png",
            alt: "Defrost label on a container",
            label: "Defrost.",
          },
          {
            file: "ingredient-on-container.png",
            alt: "Ingredient label on a container",
            label: "Ingredient, including food that has been opened.",
          },
          {
            file: "ppds-on-container.png",
            alt: "PPDS label on packed food",
            label: "PPDS, 56×80 mm.",
          },
          {
            file: "both-sizes.png",
            alt: "60 by 40 and 56 by 80 labels side by side",
            label: "60×40 mm and 56×80 mm, from the same item.",
          },
        ]}
      />
      <UsesBody />
    </>
  )
}
