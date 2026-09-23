import React from "react"
import { Hero } from "./sections/hero"
import { TrustedBySection } from "./sections/features-scroll"
import { LabelTypeStrip } from "./sections/LabelTypeStrip"
import { ProductCapabilities } from "./sections/ProductCapabilities"
import { AllergenMatrixModule } from "./sections/AllergenMatrixModule"
import { KitchenWorkflowExplorer } from "./sections/KitchenWorkflowExplorer"
import { PrintingSetupSelector } from "./sections/PrintingSetupSelector"
import { HomepageFAQ } from "./sections/HomepageFAQ"
import { HomepageClosingCTA } from "./sections/HomepageClosingCTA"

export const Homepage = () => {
  return (
    <>
      <Hero />
      <div className="home-life">
        <LabelTypeStrip />
        <ProductCapabilities />
        <TrustedBySection />
        <AllergenMatrixModule />
        <KitchenWorkflowExplorer />
        <PrintingSetupSelector />
        <HomepageFAQ />
        <HomepageClosingCTA />
      </div>
    </>
  )
}
