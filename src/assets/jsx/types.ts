import React from "react"

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  color?: string
}

export {}

declare global {
  interface Window {
    epson?: any
  }
}
