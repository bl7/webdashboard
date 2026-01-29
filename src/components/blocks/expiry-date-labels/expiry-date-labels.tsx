"use client"
import React from "react"
import { ExpiryDateLabelsHero } from "./sections/ExpiryDateLabelsHero"
import { ExpiryDateLabelsProblem } from "./sections/ExpiryDateLabelsProblem"
import { ExpiryDateLabelsSolution } from "./sections/ExpiryDateLabelsSolution"
import { ExpiryDateLabelsFeatures } from "./sections/ExpiryDateLabelsFeatures"
import { ExpiryDateLabelsCompliance } from "./sections/ExpiryDateLabelsCompliance"
export const ExpiryDateLabelsPage = () => {
  return (
    <>
      <ExpiryDateLabelsHero />
      <ExpiryDateLabelsProblem />
      <ExpiryDateLabelsSolution />
      <ExpiryDateLabelsFeatures />
      <ExpiryDateLabelsCompliance />
      <div className="bg-gray-50 border-t border-gray-200 py-6 px-4 sm:px-6 md:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> InstaLabel helps standardize labeling workflows. Your team remains responsible for compliance and staff training.
          </p>
        </div>
      </div>
    </>
  )
}
