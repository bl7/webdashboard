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
      <label className="text-sm font-medium text-gray-700">Label Size:</label>
      <div className="flex rounded-lg bg-gray-100 p-1">
        <button
          onClick={() => onHeightChange("40mm")}
          className="rounded-md bg-white px-3 py-1 text-sm font-medium text-purple-700 shadow-sm transition-all"
        >
          60mm × 40mm
        </button>
      </div>
      <span className="text-xs text-gray-500">Standard label size</span>
    </div>
  )
}

export default LabelHeightChooser
