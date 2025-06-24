// context/PrinterContext.tsx
"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import qz from "qz-tray"

interface PrinterContextType {
  isConnected: boolean
  availablePrinters: string[]
  selectedPrinter: string | null
  defaultPrinter: string | null
  reconnect: () => void
  setSelectedPrinter: (printer: string) => void
}

const PrinterContext = createContext<PrinterContextType | undefined>(undefined)

export function PrinterProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [availablePrinters, setAvailablePrinters] = useState<string[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null)
  const [defaultPrinter, setDefaultPrinter] = useState<string | null>(null)

  const reconnect = async () => {
    try {
      await qz.websocket.connect()
      // Only use documented API methods:
      const allPrinters = await qz.printers.find()
      const printers = Array.isArray(allPrinters) ? allPrinters : [allPrinters]
      const defaultP = await qz.printers.getDefault()

      setIsConnected(true)
      setAvailablePrinters(printers)
      setDefaultPrinter(defaultP)
      setSelectedPrinter((prev) => prev ?? defaultP)
    } catch (err) {
      // handle error
    }
  }

  useEffect(() => {
    reconnect()
  }, [])

  return (
    <PrinterContext.Provider
      value={{
        isConnected,
        availablePrinters,
        selectedPrinter,
        defaultPrinter,
        reconnect,
        setSelectedPrinter,
      }}
    >
      {children}
    </PrinterContext.Provider>
  )
}

export function usePrinterStatus() {
  const context = useContext(PrinterContext)
  if (!context) {
    throw new Error("usePrinterStatus must be used within a PrinterProvider")
  }
  return context
}
