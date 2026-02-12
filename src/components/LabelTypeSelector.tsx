"use client"

import React from "react"
import { useLabelType, type LabelType } from "@/context/LabelTypeContext"
import { ChevronDownIcon } from "lucide-react"

export const LabelTypeSelector: React.FC = () => {
  const { labelType, setLabelType } = useLabelType()
  const [isOpen, setIsOpen] = React.useState(false)

  const labelTypes: { value: LabelType; label: string; description: string }[] = [
    {
      value: "standard",
      label: "Standard Labels",
      description: "Rectangular labels for all item types",
    },
    {
      value: "round-sticker",
      label: "Round Stickers",
      description: "Round stickers for menu items only",
    },
  ]

  const currentLabelType = labelTypes.find((lt) => lt.value === labelType) || labelTypes[0]

  const handleSelect = (type: LabelType) => {
    setLabelType(type)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Label type:</span>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 rounded border border-purple-300 bg-white px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <span>{currentLabelType.label}</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-1 min-w-[220px] rounded-lg border border-purple-200 bg-white shadow-lg">
                {labelTypes.map((lt) => (
                  <button
                    key={lt.value}
                    onClick={() => handleSelect(lt.value)}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      labelType === lt.value
                        ? "bg-purple-50 text-purple-900 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{lt.label}</div>
                    <div className="text-xs text-gray-500">{lt.description}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

