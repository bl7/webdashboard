"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from "react"

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
  print: (imageData: string, printer?: Printer, options?: { widthPx?: number, heightPx?: number }) => Promise<void>
  selectPrinter: (printer: Printer | null) => void
}

const PrinterContext = createContext<PrinterContextType | undefined>(undefined)

export function PrinterProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [printers, setPrinters] = useState<Printer[]>([])
  const [defaultPrinter, setDefaultPrinter] = useState<Printer | null>(null)
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const connect = async () => {
    setLoading(true)
    setError(null)
    try {
      // console.log("🔌 Connecting to WebSocket printer service...")
      
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close()
      }

      // Create new WebSocket connection
      const ws = new WebSocket('ws://localhost:8080')
      wsRef.current = ws

      // Set up event handlers
      ws.onopen = () => {
        // console.log("✅ WebSocket printer connection established")
        setIsConnected(true)
        setError(null)
        setLoading(false)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          // console.log("📨 Received message from printer service:", data)
          
          // Handle different message types
          if (data.type === 'status') {
            // Update printer status
            if (data.printers) {
              setPrinters(data.printers)
              // Set default printer if available
              if (data.defaultPrinter) {
                setDefaultPrinter(data.defaultPrinter)
                // Auto-select default printer if no printer is currently selected
                if (!selectedPrinter) {
                  setSelectedPrinter(data.defaultPrinter)
                }
              }
            }
          } else if (data.type === 'error') {
            setError(data.message || 'Printer service error')
          } else if (data.type === 'print_success') {
            console.log("✅ Print job completed successfully")
          } else if (data.type === 'print_error') {
            setError(data.message || 'Print job failed')
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err)
        }
      }

      ws.onerror = (error) => {
        // console.error("❌ WebSocket printer connection error:", error)
        setError("Failed to connect to printer service")
        setIsConnected(false)
        setLoading(false)
      }

      ws.onclose = (event) => {
        // console.log("🔌 WebSocket printer connection closed:", event.code, event.reason)
        setIsConnected(false)
        setLoading(false)
        
        // Auto-reconnect if not manually closed
        if (event.code !== 1000) {
          setTimeout(() => {
            // console.log("🔄 Attempting to reconnect to printer service...")
            connect()
          }, 3000)
        }
      }

    } catch (err: any) {
      console.error("❌ Printer connection error:", err)
      setError(err.message || "Failed to connect to printer service")
      setIsConnected(false)
      setLoading(false)
    }
  }

  const disconnect = async () => {
    try {
      // console.log("🔌 Disconnecting from printer service...")
      if (wsRef.current) {
        wsRef.current.close(1000, "Manual disconnect")
        wsRef.current = null
      }
      setIsConnected(false)
      setError(null)
    } catch (err: any) {
      console.error("Failed to disconnect:", err)
    }
  }

  const reconnect = async () => {
    await disconnect()
    await connect()
  }

  const selectPrinter = (printer: Printer | null) => {
    setSelectedPrinter(printer)
  }

  const print = async (imageData: string, printer?: Printer, options?: { widthPx?: number, heightPx?: number }) => {
    if (!isConnected || !wsRef.current) {
      throw new Error("Printer not connected. Please connect first.")
    }

    // Use provided printer, selected printer, or default printer
    const targetPrinter = printer || selectedPrinter || defaultPrinter
    if (!targetPrinter) {
      throw new Error("No printer selected. Please select a printer first.")
    }

    try {
      console.log("🖨️ Sending print job...")
      console.log("🖨️ Original image data length:", imageData.length)
      console.log("🖨️ Original image data starts with:", imageData.substring(0, 50))
      console.log("🖨️ Using printer:", targetPrinter.name)
      
      // Remove data URL prefix if present
      const cleanImageData = imageData.includes(',') ? imageData.split(',')[1] : imageData
      
      console.log("🖨️ Clean image data length:", cleanImageData.length)
      console.log("🖨️ Clean image data starts with:", cleanImageData.substring(0, 50))
      
      if (!cleanImageData || cleanImageData.length < 100) {
        throw new Error("Invalid or empty image data")
      }
      
      const printJob: any = {
        type: 'print',
        images: [cleanImageData],
        selectedPrinter: targetPrinter.name
      }
      if (options && (options.widthPx || options.heightPx)) {
        if (options.widthPx) printJob.widthPx = options.widthPx;
        if (options.heightPx) printJob.heightPx = options.heightPx;
      }

      console.log("🖨️ Sending print job with", printJob.images.length, "images")
      wsRef.current.send(JSON.stringify(printJob))
      console.log("✅ Print job sent successfully")
    } catch (err: any) {
      console.error("❌ Print job failed:", err)
      throw new Error(err.message || "Failed to send print job")
    }
  }

  useEffect(() => {
    // Auto-connect on mount
    console.log("🖨️ Printer context initialized - connecting to WebSocket service")
    connect()

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

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

export function usePrinter() {
  const context = useContext(PrinterContext)
  if (context === undefined) {
    throw new Error("usePrinter must be used within a PrinterProvider")
  }
  return context
} 