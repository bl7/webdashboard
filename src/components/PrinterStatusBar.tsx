"use client"

import { usePrinterStatus } from "@/context/PrinterContext"

export default function PrinterStatusBar() {
  const {
    isConnected,
    defaultPrinter,
    selectedPrinter,
    availablePrinters,
    setSelectedPrinter,
    reconnect,
  } = usePrinterStatus()

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
              Default: <strong>{defaultPrinter}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-black dark:text-white">
            <label htmlFor="printer-select" className="text-xs font-medium">
              Selected Printer:
            </label>
            <select
              id="printer-select"
              value={selectedPrinter ?? ""}
              onChange={(e) => setSelectedPrinter(e.target.value)}
              className="rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              style={{ minWidth: 120 }}
            >
              {availablePrinters.map((printer) => (
                <option key={printer} value={printer}>
                  {printer}
                </option>
              ))}
            </select>
          </div>
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
