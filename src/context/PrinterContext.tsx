"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface PrinterContextType {
  printer: USBDevice | null
  isConnected: boolean
  connectPrinter: () => Promise<void>
  disconnectPrinter: () => void
}

const PrinterContext = createContext<PrinterContextType | undefined>(undefined)

export function PrinterProvider({ children }: { children: ReactNode }) {
  const [printer, setPrinter] = useState<USBDevice | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const connectPrinter = async () => {
    try {
      if (!navigator.usb) {
        throw new Error("WebUSB not supported")
      }

      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x04b8 }], // Epson vendor ID
      })

      await device.open()
      await device.selectConfiguration(1)
      await device.claimInterface(0)

      // Store globally for other components
      ;(window as any).epsonPrinter = device

      setPrinter(device)
      setIsConnected(true)
    } catch (error) {
      setIsConnected(false)
      setPrinter(null)
      throw error
    }
  }

  const disconnectPrinter = () => {
    if (printer) {
      printer.close()
    }
    setPrinter(null)
    setIsConnected(false)
    ;(window as any).epsonPrinter = null
  }

  return (
    <PrinterContext.Provider
      value={{
        printer,
        isConnected,
        connectPrinter,
        disconnectPrinter,
      }}
    >
      {children}
    </PrinterContext.Provider>
  )
}

export function usePrinter() {
  const context = useContext(PrinterContext)
  if (context === undefined) {
    throw new Error("usePrinter must be used within a PrinterProvider")
  }
  return context
}
