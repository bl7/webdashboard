import React from "react"
import { NatashasLawHero } from "./sections/NatashasLawHero"
import { NatashasLawBody } from "./sections/NatashasLawBody"
import { ShotStrip } from "@/components/marketing/MediaSlot"

export const NatashasLawPage = () => {
  return (
    <>
      <NatashasLawHero />
      <ShotStrip
        shots={[
          {
            file: "ppds-on-container.png",
            alt: "A PPDS label on packed food",
            label: "A 56×80 mm PPDS label on the food. Replace with a readable close-up.",
          },
        ]}
      />
      <NatashasLawBody />
    </>
  )
}
