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
    <div className="fixed right-4 top-3 z-50 w-[260px] rounded border border-gray-200 bg-white px-4 py-3 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-900">
      {isConnected ? (
        <div className="space-y-2 text-green-600">
          <div>
            🖨️ Connected
            <div className="text-xs text-gray-700 dark:text-gray-300">
              Default: <strong>{defaultPrinter}</strong>
            </div>
          </div>
          <div className="text-black dark:text-white">
            <label htmlFor="printer-select" className="text-xs font-medium">
              Selected Printer:
            </label>
            <select
              id="printer-select"
              value={selectedPrinter ?? ""}
              onChange={(e) => setSelectedPrinter(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-white"
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
        <div className="flex flex-col items-start gap-2 text-red-600">
          ❌ Not connected
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
