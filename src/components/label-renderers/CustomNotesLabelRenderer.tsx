import React from "react"
import type { LabelHeight } from "@/app/dashboard/print/LabelHeightChooser"

export type TextAlign = "left" | "center" | "right"

export type NotesBlock = {
  id: string
  text: string
  x: number
  y: number
  width: number
  fontSize: number
  bold: boolean
  align: TextAlign
  invert: boolean
  border: boolean
}

export type NotesConfig = {
  showOuterBorder: boolean
  blocks: NotesBlock[]
}

export function CustomNotesLabelRenderer({
  config,
  labelHeight,
  showGuides = false,
}: {
  config: NotesConfig
  labelHeight: LabelHeight
  showGuides?: boolean
}) {
  const heightCm = labelHeight === "80mm" ? 8.0 : 4.0
  return (
    <div
      style={{
        width: "6.0cm",
        height: `${heightCm}cm`,
        border: config.showOuterBorder ? "2px solid black" : "1px solid #e5e7eb",
        borderRadius: 6,
        background: "white",
        padding: "3mm",
        boxSizing: "border-box",
        fontFamily: "Menlo, Consolas, 'Liberation Mono', monospace",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {config.blocks.map((block) => (
        <div
          key={block.id}
          style={{
            position: "absolute",
            left: `${block.x}%`,
            top: `${block.y}%`,
            width: `${block.width}%`,
            whiteSpace: "pre-wrap",
            overflow: "hidden",
            lineHeight: 1.2,
            fontSize: block.fontSize,
            fontWeight: block.bold ? 800 : 500,
            textAlign: block.align,
            color: block.invert ? "white" : "black",
            backgroundColor: block.invert ? "black" : "transparent",
            border:
              block.border || showGuides
                ? "1px dashed rgba(107,114,128,0.7)"
                : "1px solid transparent",
            borderRadius: 2,
            padding: "2px 3px",
            boxSizing: "border-box",
          }}
        >
          {block.text || " "}
        </div>
      ))}
    </div>
  )
}


