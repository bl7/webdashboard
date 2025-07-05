"use client"

import React from "react"
import { usePrinter } from "@/context/PrinterContext"
import { ServerOff, Server, CheckCircle } from "lucide-react"

export default function PrinterStatusBar() {
  const {
    isConnected,
    printers: availablePrinters,
    selectedPrinter,
    selectPrinter,
    reconnect,
  } = usePrinter()

  return (
    <div
      className="fixed left-0 top-0 flex h-12 w-full items-center justify-end border-b border-gray-200 bg-white px-6 text-sm shadow-sm"
      style={{ paddingLeft: "var(--sidebar-width, 240px)", zIndex: 1 }}
    >
      {isConnected ? (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="font-medium">Connected to Local Server</span>
        </div>
      ) : (
        <div className="flex items-center gap-4 text-red-600">
          <ServerOff className="h-5 w-5 text-red-500" />
          <span className="font-medium">Server unavailable</span>
          <button
            onClick={() => window.open('http://localhost:8080', '_blank', 'noopener,noreferrer')}
            className="rounded bg-purple-600 px-3 py-1 text-xs text-white hover:bg-purple-700"
          >
            Test
          </button>
        </div>
      )}
    </div>
  )
} 