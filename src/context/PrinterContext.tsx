"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from "react"
import { usePrintBridge } from "../hooks/usePrintBridge"

interface Printer {
  name: string
  systemName: string
  driverName: string
  state: string
  location: string
  isDefault: boolean
}

interface PrinterContextType {
  isConnected: boolean
  loading: boolean
  error: string | null
  printers: Printer[]
  defaultPrinter: Printer | null
  selectedPrinter: Printer | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  reconnect: () => Promise<void>
  print: (imageData: string, printer?: Printer, options?: { widthPx?: number, heightPx?: number, labelHeight?: "31mm" | "40mm" | "80mm" }) => Promise<void>
  selectPrinter: (printer: Printer | null) => void
}

const PrinterContext = createContext<PrinterContextType | undefined>(undefined)

export function PrinterProvider({ children }: { children: React.ReactNode }) {
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null)
  
  // Use the PrintBridge hook for WebSocket connection
  const {
    isConnected,
    printers,
    defaultPrinter,
    loading,
    error,
    sendPrintJob,
    connect: printBridgeConnect,
    disconnect: printBridgeDisconnect,
    reconnect: printBridgeReconnect
  } = usePrintBridge()

  const connect = async () => {
    console.log("🔌 Connecting to PrintBridge server...")
    printBridgeConnect()
  }

  const disconnect = async () => {
    console.log("🔌 Disconnecting from PrintBridge server...")
    printBridgeDisconnect()
  }

  const reconnect = async () => {
    console.log("🔄 Reconnecting to PrintBridge server...")
    printBridgeReconnect()
  }

  const selectPrinter = (printer: Printer | null) => {
    setSelectedPrinter(printer)
  }

  const print = async (imageData: string, printer?: Printer, options?: { widthPx?: number, heightPx?: number, labelHeight?: "31mm" | "40mm" | "80mm" }) => {
    if (!isConnected) {
      throw new Error("Printer not connected. Please connect first.")
    }

    // Use provided printer, selected printer, or default printer
    const targetPrinter = printer || selectedPrinter || defaultPrinter
    if (!targetPrinter) {
      throw new Error("No printer selected. Please select a printer first.")
    }

    // Map labelHeight string to mm
    let labelHeightMm = 31;
    if (options && options.labelHeight) {
      if (options.labelHeight === "40mm") labelHeightMm = 40;
      else if (options.labelHeight === "80mm") labelHeightMm = 80;
    }

    try {
      // Remove data URL prefix if present
      const cleanImageData = imageData.includes(',') ? imageData.split(',')[1] : imageData

      // Send print job using PrintBridge
      const success = sendPrintJob(imageData, targetPrinter.name, 56, labelHeightMm)
      
      if (success) {
        console.log("✅ Print job sent successfully via PrintBridge", { printer: targetPrinter.name })
      } else {
        throw new Error("Failed to send print job via PrintBridge")
      }
    } catch (err: any) {
      console.error("❌ Print job failed:", err)
      throw new Error(err.message || "Failed to send print job")
    }
  }

  // Auto-select default printer if no printer is currently selected
  useEffect(() => {
    if (defaultPrinter && !selectedPrinter) {
      setSelectedPrinter(defaultPrinter)
    }
  }, [defaultPrinter, selectedPrinter])

  const value: PrinterContextType = {
    isConnected,
    loading,
    error,
    printers,
    defaultPrinter,
    selectedPrinter,
    connect,
    disconnect,
    reconnect,
    print,
    selectPrinter,
  }

  return (
    <PrinterContext.Provider value={value}>
      {children}
    </PrinterContext.Provider>
  )
}

export const usePrinter = () => {
  const context = useContext(PrinterContext)
  if (context === undefined) {
    throw new Error('usePrinter must be used within a PrinterProvider')
  }
  return context
} 