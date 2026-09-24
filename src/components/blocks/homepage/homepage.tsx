import React from "react"
import { Hero } from "./sections/hero"
import { TrustedBySection } from "./sections/features-scroll"
import { WhyLabelling } from "./sections/WhyLabelling"
import { ScrollBeforeAfter } from "./sections/ScrollBeforeAfter"
import { LabelTypeStrip } from "./sections/LabelTypeStrip"
import { ProductCapabilities } from "./sections/ProductCapabilities"
import { AllergenMatrixModule } from "./sections/AllergenMatrixModule"
import { LabelFormats } from "./sections/LabelFormats"
import { KitchenWorkflowExplorer } from "./sections/KitchenWorkflowExplorer"
import { PrintingSetupSelector } from "./sections/PrintingSetupSelector"
import { MenuImport } from "./sections/MenuImport"
import { HomepageFAQ } from "./sections/HomepageFAQ"
import { HomepageClosingCTA } from "./sections/HomepageClosingCTA"

export const Homepage = () => {
  return (
    <>
      <Hero />
      <div className="home-life">
        <WhyLabelling />
      </div>
      <ScrollBeforeAfter />
      <div className="home-life">
        <LabelTypeStrip />
        <KitchenWorkflowExplorer />
        <ProductCapabilities />
        <AllergenMatrixModule />
        <LabelFormats />
        <PrintingSetupSelector />
        <MenuImport />
        <TrustedBySection />
        <HomepageFAQ />
        <HomepageClosingCTA />
      </div>
    </>
  )
}
