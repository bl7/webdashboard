import React from "react"
import { AllergenComplianceHero } from "./sections/AllergenComplianceHero"
import { AllergenComplianceBody } from "./sections/AllergenComplianceBody"
import { ShotStrip } from "@/components/marketing/MediaSlot"

export const AllergenCompliancePage = () => {
  return (
    <>
      <AllergenComplianceHero />
      <ShotStrip
        shots={[
          {
            file: "matrix-screen.mp4",
            poster: "dashboard-matrix.png",
            alt: "Allergen matrix built from saved items",
            label: "The matrix uses the same records as the labels. Staff still review it.",
          },
        ]}
      />
      <AllergenComplianceBody />
    </>
  )
}
