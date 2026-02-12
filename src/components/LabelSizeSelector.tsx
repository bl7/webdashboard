"use client"

import React from "react"
import { useLabelSize, type LabelSize } from "@/context/LabelSizeContext"
import { ChevronDownIcon } from "lucide-react"

export const LabelSizeSelector: React.FC = () => {
  const { selectedSize, setSelectedSize, labelSizes } = useLabelSize()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelect = (size: LabelSize) => {
    setSelectedSize(size)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Label size:</span>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 rounded border border-purple-300 bg-white px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <span>
              {selectedSize.label} ({selectedSize.height === 40 ? "small" : "large"})
            </span>
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
              <div className="absolute right-0 z-20 mt-1 min-w-[180px] rounded-lg border border-purple-200 bg-white shadow-lg">
                {labelSizes.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => handleSelect(size)}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                      selectedSize.label === size.label
                        ? "bg-purple-50 text-purple-900 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {size.label} ({size.width}mm × {size.height}mm){" "}
                    <span className="text-gray-500">
                      ({size.height === 40 ? "small" : "large"})
                    </span>
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

