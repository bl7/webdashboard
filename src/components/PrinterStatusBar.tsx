"use client"

import React from "react"
import { usePrinter } from "@/context/PrinterContext"
import { usePrintBridgeContext } from "@/context/PrintBridgeContext"
import { ServerOff, Server, CheckCircle, Wifi, WifiOff } from "lucide-react"

export default function PrinterStatusBar() {
  const {
    isConnected: printerConnected,
    printers: availablePrinters,
    selectedPrinter,
    selectPrinter,
    reconnect: printerReconnect,
  } = usePrinter()

  const {
    isConnected: printBridgeConnected,
    printers: printBridgePrinters,
    loading: printBridgeLoading,
    error: printBridgeError,
    reconnect: printBridgeReconnect,
  } = usePrintBridgeContext()

  return (
    <div
      className="fixed left-0 top-0 flex h-12 w-full items-center justify-end border-b border-gray-200 bg-white px-6 text-sm shadow-sm"
      style={{ paddingLeft: "var(--sidebar-width, 240px)", zIndex: 1 }}
    >
      <div className="flex items-center gap-4">
        {/* PrintBridge Status */}
        <div className="flex items-center gap-2">
          {printBridgeConnected ? (
            <div className="flex items-center gap-2 text-green-600">
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="font-medium">PrintBridge Connected</span>
              <span className="text-xs text-gray-500">({printBridgePrinters.length} printers)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <WifiOff className="h-4 w-4 text-red-500" />
              <span className="font-medium">PrintBridge Disconnected</span>
              {printBridgeError && (
                <span className="text-xs text-red-500">({printBridgeError})</span>
              )}
            </div>
          )}
        </div>

        {/* Legacy Printer Status */}
        {printerConnected ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="font-medium">Printer System Ready</span>
            <span className="text-xs text-gray-500">({availablePrinters.length} printers)</span>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-red-600">
            <ServerOff className="h-4 w-4 text-red-500" />
            <span className="font-medium">Printer System Unavailable</span>
            <button
              onClick={() => window.open('http://localhost:8080', '_blank', 'noopener,noreferrer')}
              className="rounded bg-purple-600 px-3 py-1 text-xs text-white hover:bg-purple-700"
            >
              Test Server
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 