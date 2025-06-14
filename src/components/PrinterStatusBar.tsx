"use client"

import React, { useState } from "react"
import { usePrinter } from "@/context/PrinterContext"
import { Button } from "@/components/ui/button"
import { PrinterIcon, CheckCircle2, XCircle } from "lucide-react"

export default function PrinterStatusBar() {
  const { printer, connectPrinter, isConnected } = usePrinter()
  const [status, setStatus] = useState("Ready to connect")
  const [isConnecting, setIsConnecting] = useState(false)

  // Update status based on connection state
  React.useEffect(() => {
    if (isConnected && !isConnecting) {
      setStatus("Printer connected")
    } else if (!isConnected && !isConnecting) {
      setStatus("Ready to connect")
    }
  }, [isConnected, isConnecting])

  const handleConnect = async () => {
    setIsConnecting(true)
    setStatus("Connecting...")

    try {
      await connectPrinter()
      setStatus("Printer connected")
    } catch (error: any) {
      console.error("Printer connection error", error)
      setStatus(`Connection failed: ${error.message}`)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <nav className="fixed left-0 right-0 top-0 flex h-12 items-center justify-end gap-4 border-b border-gray-200 bg-white px-6 py-3 shadow-md">
      {isConnected ? (
        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
          <CheckCircle2 size={18} />
          Connected
        </div>
      ) : (
        <div className="flex items-center gap-1 text-sm font-medium text-red-500">
          <XCircle size={18} />
          Not Connected
        </div>
      )}

      <div className="mr-2 text-xs text-gray-500">{status}</div>

      <Button
        size="sm"
        variant="outline"
        className="h-8 px-3 text-xs"
        onClick={handleConnect}
        disabled={isConnecting}
      >
        <PrinterIcon size={16} className="mr-1" />
        {isConnecting ? "Connecting..." : isConnected ? "Reconnect" : "Connect"}
      </Button>
    </nav>
  )
}
