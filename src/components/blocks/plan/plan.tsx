import React from "react"
import { PlanBody, type PublicPlan } from "./sections/PlanBody"

export const Plan = ({ initialPlan = null }: { initialPlan?: PublicPlan | null }) => {
  return <PlanBody initialPlan={initialPlan} />
}
