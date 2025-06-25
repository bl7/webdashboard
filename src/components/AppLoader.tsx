import React from "react"

export default function AppLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex h-96 items-center justify-center">
      <svg className="h-10 w-10 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span className="ml-4 text-lg text-gray-500">{message}</span>
    </div>
  )
}
