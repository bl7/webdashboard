"use client"

import React, { useState } from "react"
import { usePrinter } from "@/context/PrinterContext"
import { Button } from "@/components/ui/button"
import { PrinterIcon, CheckCircle2, XCircle } from "lucide-react"

export default function PrinterStatusBar() {
  const [printerConnected, setPrinterConnected] = useState(false)
  const { printer, connectPrinter } = usePrinter()
  const [status, setStatus] = useState("Ready to connect")
  const connectToPrinter = async () => {
    try {
      setStatus("Connecting...")
      if (!navigator.usb) {
        setStatus("WebUSB not supported")
        return
      }
      const device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x04b8 }] })
      await device.open()
      await device.selectConfiguration(1)
      await device.claimInterface(0)
      window.epsonPrinter = device
      setPrinterConnected(true)
      setStatus("Printer connected")
    } catch (e: any) {
      console.error("Printer connection error", e)
      setStatus(`Connection failed: ${e.message}`)
    }
  }
  return (
    <nav className="fixed left-0 right-0 top-0 flex h-12 items-center justify-end gap-4 border-b border-gray-200 bg-white px-6 py-3 shadow-md">
      {printerConnected ? (
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

      <Button size="sm" variant="outline" className="h-8 px-3 text-xs" onClick={connectPrinter}>
        <PrinterIcon size={16} className="mr-1" />
        {printerConnected ? "Reconnect" : "Connect"}
      </Button>
    </nav>
  )
}
