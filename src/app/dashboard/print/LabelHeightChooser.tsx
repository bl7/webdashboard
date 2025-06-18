import React from "react"

export type LabelHeight = "40mm" | "80mm"

interface LabelHeightChooserProps {
  selectedHeight: LabelHeight
  onHeightChange: (height: LabelHeight) => void
  className?: string
}

const LabelHeightChooser: React.FC<LabelHeightChooserProps> = ({
  selectedHeight,
  onHeightChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <label className="text-sm font-medium text-gray-700">Label Height:</label>
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => onHeightChange("40mm")}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-all ${
            selectedHeight === "40mm"
              ? "bg-white text-purple-700 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          40mm
        </button>
        <button
          onClick={() => onHeightChange("80mm")}
          className={`rounded-md px-3 py-1 text-sm font-medium transition-all ${
            selectedHeight === "80mm"
              ? "bg-white text-purple-700 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          80mm
        </button>
      </div>
      <span className="text-xs text-gray-500">
        {selectedHeight === "40mm" ? "Compact labels" : "Extended labels"}
      </span>
    </div>
  )
}

export default LabelHeightChooser
