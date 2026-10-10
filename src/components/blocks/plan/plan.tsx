import React from "react"
import { PlanHero } from "./sections/PlanHero"
import { PlanBody, type PublicPlan } from "./sections/PlanBody"

export const Plan = ({ initialPlan = null }: { initialPlan?: PublicPlan | null }) => {
  return (
    <>
      <PlanHero />
      <PlanBody initialPlan={initialPlan} />
    </>
  )
}
