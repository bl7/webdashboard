"use client"
// import { usePrinter } from "@/context/PrinterContext"
import React from "react"

export default function PrinterStatusBar() {
  // const { managerRef, status, setMessage } = usePrinter()

  const handleConnectBluetooth = async () => {
    // await managerRef.current?.scanAndConnectBluetooth()
  }

  // Bulb SVG component
  const Bulb = ({ color }: { color: string }) => (
    <svg
      className="mr-1 inline-block align-middle"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: 6, verticalAlign: "middle" }}
    >
      <circle cx="8" cy="8" r="7" stroke="#ccc" strokeWidth="1" />
    </svg>
  )

  return (
    <div className="flex w-full items-center justify-end">
      <div className="flex gap-6">
        <div className="flex items-center text-sm text-gray-700">
          USB:{" "}
          <span className="ml-1 flex items-center">
            {/* <Bulb color={status.printerConnected ? "#22c55e" : "#ef4444"} /> */}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          Bluetooth:{" "}
          <span className="ml-1 flex items-center">
            {/* <Bulb color={status.btDevice ? "#22c55e" : "#ef4444"} /> */}
          </span>
        </div>
        <button
          onClick={handleConnectBluetooth}
          // disabled={!!status.btDevice || status.isBtConnecting}
          className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:bg-gray-300"
        >
          {/* {status.isBtConnecting ? "Connecting..." : "Connect Bluetooth"} */}
        </button>
      </div>
    </div>
  )
}
