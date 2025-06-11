"use client"
import { usePrinter } from "@/context/PrinterContext"
import React, { useEffect, useRef, useState } from "react"
import PrinterManager, { PrinterManagerHandles } from "@/app/dashboard/print/PrinterManager"

export default function PrinterStatusBar() {
  const { managerRef, status, setMessage } = usePrinter()

  const handleConnectBluetooth = async () => {
    await managerRef.current?.scanAndConnectBluetooth()
  }

  return (
    <div className="flex w-full items-center justify-end">
      <div className="flex gap-6">
        <div className="text-sm text-gray-700">
          USB:{" "}
          <span className={status.printerConnected ? "text-green-600" : "text-red-500"}>
            {status.printerConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="text-sm text-gray-700">
          Bluetooth:{" "}
          <span className={status.btDevice ? "text-green-600" : "text-red-500"}>
            {status.btDevice?.name ?? "Not connected "}
          </span>
        </div>
        <button
          onClick={handleConnectBluetooth}
          disabled={!!status.btDevice || status.isBtConnecting}
          className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:bg-gray-300"
        >
          {status.isBtConnecting ? "Connecting..." : "Connect Bluetooth"}
        </button>
      </div>
    </div>
  )
}
