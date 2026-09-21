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
    osType,
  } = usePrintBridgeContext()

  const getConnectionInfo = () => {
    if (osType === 'mac') {
      return {
        isConnected: printerConnected,
        printerCount: availablePrinters.length,
        error: null,
        reconnect: printerReconnect
      };
    } else if (osType === 'windows') {
      return {
        isConnected: printBridgeConnected,
        printerCount: printBridgePrinters.length,
        error: printBridgeError,
        reconnect: printBridgeReconnect
      };
    } else {
      return {
        isConnected: printerConnected,
        printerCount: availablePrinters.length,
        error: null,
        reconnect: printerReconnect
      };
    }
  };

  const connectionInfo = getConnectionInfo();

  return (
    <div
      className="fixed left-0 top-0 flex h-12 w-full items-center justify-end border-b border-gray-200 bg-white px-6 text-sm shadow-sm"
      style={{ paddingLeft: "var(--sidebar-width, 240px)", zIndex: 1 }}
    >
      <div className="flex items-center gap-4">
        {/* Simple Connection Status */}
        <div className="flex items-center gap-2">
          {connectionInfo.isConnected ? (
            <div className="flex items-center gap-2 text-green-600">
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="font-medium">Server Connected</span>
              <span className="text-xs text-gray-500">({connectionInfo.printerCount} printers)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <WifiOff className="h-4 w-4 text-red-500" />
              <span className="font-medium">Server Disconnected</span>
              {connectionInfo.error && (
                <span className="text-xs text-red-500">({connectionInfo.error})</span>
              )}
            </div>
          )}
        </div>

        {/* Test Server Button for Disconnected State */}
        {!connectionInfo.isConnected && (
          <button
            onClick={() => window.open(`http://localhost:8080`, '_blank', 'noopener,noreferrer')}
            className="rounded bg-purple-600 px-3 py-1 text-xs text-white hover:bg-purple-700"
          >
            Test Connection
          </button>
        )}
      </div>
    </div>
  )
} 