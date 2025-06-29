"use client"

import React from "react"
import { usePrinter } from "@/context/PrinterContext"

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
      className="fixed left-0 top-0 flex h-12 w-full items-center justify-end border-b border-gray-200 bg-white px-6 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900"
      style={{ paddingLeft: "var(--sidebar-width, 240px)", zIndex: 1 }} // Move content to right, set lowest z-index
    >
      {isConnected ? (
        <div className="flex flex-wrap items-center gap-6 text-green-600">
          <div className="flex items-center gap-2">
            🖨️ <span className="font-medium">Connected</span>
            <span className="ml-2 text-xs text-gray-700 dark:text-gray-300">
              WebSocket: ws://localhost:8080
            </span>
          </div>
          <div className="flex items-center gap-2 text-black dark:text-white">
            <span className="text-xs font-medium">
              Available Printers: {availablePrinters.length}
            </span>
          </div>
          {availablePrinters.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-black dark:text-white">
                Selected:
              </span>
              <select
                value={selectedPrinter?.name || ''}
                onChange={(e) => {
                  const printer = availablePrinters.find(p => p.name === e.target.value)
                  selectPrinter(printer || null)
                }}
                className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="">Select Printer</option>
                {availablePrinters.map((printer) => (
                  <option key={printer.name} value={printer.name}>
                    {printer.name} {printer.isDefault ? '(Default)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4 text-red-600">
          ❌ <span className="font-medium">Not connected</span>
          <button
            onClick={reconnect}
            className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
          >
            Reconnect
          </button>
        </div>
      )}
    </div>
  )
} 