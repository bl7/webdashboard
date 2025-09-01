import React from "react"
import {
  UsesHero,
  FeatureIntro,
  FeaturesGridUses,
  GalleryFeature,
  PPDSLabelShowcaseSection,
  EnhancedLabelTypes,
  PrintingSetup,
  IndustryUseCases,
  WorkflowIntegration,
} from "./sections"

export const Uses = () => {
  return (
    <>
      <UsesHero />
      <PPDSLabelShowcaseSection />
      <FeatureIntro />
      <EnhancedLabelTypes />
      <PrintingSetup />
      <IndustryUseCases />
      <WorkflowIntegration />
      <GalleryFeature />
      <FeaturesGridUses />
    </>
  )
}
