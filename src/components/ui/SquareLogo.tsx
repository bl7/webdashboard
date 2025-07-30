import React from "react"

interface SquareLogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export const SquareLogo: React.FC<SquareLogoProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="black"/>
        <rect x="6" y="6" width="12" height="12" rx="2" fill="white"/>
        <rect x="8" y="8" width="8" height="8" rx="1" fill="black"/>
      </svg>
    </div>
  )
} 