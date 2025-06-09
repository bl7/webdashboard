import React from "react"

interface ProgressProps {
  value: number // 0-100
}

export const Progress: React.FC<ProgressProps> = ({ value }) => {
  return (
    <div className="h-3 w-full overflow-hidden rounded bg-gray-200">
      <div
        className="h-full bg-blue-600 transition-all"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  )
}
