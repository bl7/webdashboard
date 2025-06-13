"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Printer = USBDevice | null
type USBConfiguration = {
  configurationValue: number
}
interface PrinterContextType {
  printer: Printer
  connectPrinter: () => Promise<void>
}

const PrinterContext = createContext<PrinterContextType | undefined>(undefined)

export const PrinterProvider = ({ children }: { children: React.ReactNode }) => {
  const [printer, setPrinter] = useState<Printer>(null)

  const connectPrinter = async () => {
    try {
      const device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x04b8 }], // Example: Epson
      })
      await device.open()

      const deviceWithConfig = device as USBDevice & { configuration: USBConfiguration | null }

      if (deviceWithConfig.configuration === null) {
        await device.selectConfiguration(1)
      }

      await device.claimInterface(0)

      setPrinter(device)
      console.log("Printer connected:", device)
    } catch (err) {
      console.error("Printer connection failed:", err)
    }
  }

  // Auto-reconnect on mount if already authorized
  useEffect(() => {
    const tryReconnect = async () => {
      const devices = await navigator.usb.getDevices()
      if (devices.length > 0) {
        const device = devices[0]
        try {
          await device.open()

          const deviceWithConfig = device as USBDevice & { configuration: USBConfiguration | null }

          if (deviceWithConfig.configuration === null) {
            await device.selectConfiguration(1)
          }

          await device.claimInterface(0)
          setPrinter(device)
        } catch (err) {
          console.error("Auto-reconnect failed:", err)
        }
      }
    }

    tryReconnect()
  }, [])

  return (
    <PrinterContext.Provider value={{ printer, connectPrinter }}>
      {children}
    </PrinterContext.Provider>
  )
}

export const usePrinter = (): PrinterContextType => {
  const context = useContext(PrinterContext)
  if (!context) {
    throw new Error("usePrinter must be used within a PrinterProvider")
  }
  return context
}
