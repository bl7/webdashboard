// context/PrinterContext.tsx
"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import qz from "qz-tray"
import { toast } from "react-hot-toast"

interface PrinterContextType {
  isConnected: boolean
  availablePrinters: string[]
  selectedPrinter: string | null
  defaultPrinter: string | null
  reconnect: () => void
  setSelectedPrinter: (printer: string) => void
  loading: boolean
  error: string | null
}

const PrinterContext = createContext<PrinterContextType | undefined>(undefined)

export function PrinterProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [availablePrinters, setAvailablePrinters] = useState<string[]>([])
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null)
  const [defaultPrinter, setDefaultPrinter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper to persist selected printer
  useEffect(() => {
    if (selectedPrinter && selectedPrinter !== "Fallback_Printer") {
      localStorage.setItem("selectedPrinter", selectedPrinter)
    }
  }, [selectedPrinter])

  // Helper to load selected printer from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("selectedPrinter")
    // Only set if it's not a fallback printer name
    if (stored && stored !== "Fallback_Printer" && stored.trim() !== "") {
      setSelectedPrinter(stored)
    }
  }, [])

  // Enhanced reconnect logic with better error handling
  const reconnect = async (showToast = true) => {
    console.log("🔄 PrinterContext: Starting reconnect...")
    setLoading(true)
    setError(null)
    
    try {
      // Ensure QZ websocket is connected
      if (!qz.websocket.isActive()) {
        console.log("🔌 Connecting to QZ websocket...")
        await qz.websocket.connect()
      }

      // Get all available printers
      console.log("🔍 Finding printers...")
      const allPrinters = await qz.printers.find()
      console.log("🖨️ Raw printer response:", allPrinters)
      
      // Ensure we have an array and filter out invalid entries
      const printers = Array.isArray(allPrinters) 
        ? allPrinters.filter(p => p && p.trim() !== "" && p !== "Fallback_Printer")
        : (allPrinters && allPrinters.trim() !== "" && allPrinters !== "Fallback_Printer") 
          ? [allPrinters] 
          : []

      console.log("🖨️ Filtered printers:", printers)

      // Get default printer
      let defaultP: string | null = null
      try {
        defaultP = await qz.printers.getDefault()
        console.log("🎯 Default printer:", defaultP)
        
        // Filter out fallback printer from default as well
        if (defaultP === "Fallback_Printer" || !defaultP || defaultP.trim() === "") {
          defaultP = null
        }
      } catch (defaultErr) {
        console.warn("⚠️ Could not get default printer:", defaultErr)
        defaultP = null
      }

      // Update connection state
      setIsConnected(true)
      setAvailablePrinters(printers)
      setDefaultPrinter(defaultP)

      // Smart printer selection with comprehensive fallback logic
      setSelectedPrinter((currentSelected) => {
        console.log("🎯 Current selected printer:", currentSelected)
        
        // Priority 1: Keep current selection if it's still available and valid
        if (currentSelected && 
            currentSelected !== "Fallback_Printer" && 
            printers.includes(currentSelected)) {
          console.log("✅ Keeping current selected printer:", currentSelected)
          return currentSelected
        }

        // Priority 2: Use default printer if available and valid
        if (defaultP && printers.includes(defaultP)) {
          console.log("✅ Using default printer:", defaultP)
          return defaultP
        }

        // Priority 3: Use first available printer
        if (printers.length > 0) {
          console.log("✅ Using first available printer:", printers[0])
          return printers[0]
        }

        // No valid printers found
        console.log("❌ No valid printers found")
        return null
      })

      // Show appropriate messages
      if (printers.length === 0) {
        const errorMsg = "No printers found. Please check your printer connection and ensure printers are properly installed."
        setError(errorMsg)
        if (showToast) {
          toast.error(errorMsg)
        }
      } else {
        console.log(`✅ Successfully connected. Found ${printers.length} printer(s)`)
        if (showToast) {
          toast.success(`Connected! Found ${printers.length} printer(s)`)
        }
      }

    } catch (err: any) {
      console.error("❌ PrinterContext reconnect error:", err)
      
      // Reset all state on error
      setIsConnected(false)
      setAvailablePrinters([])
      setDefaultPrinter(null)
      setSelectedPrinter(null)
      
      const errorMsg = err.message || "QZ Tray not running or cannot connect. Please ensure QZ Tray is installed and running."
      setError(errorMsg)
      
      if (showToast) {
        toast.error(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  // Enhanced setSelectedPrinter with validation
  const setSelectedPrinterSafe = (printer: string) => {
    console.log("🎯 Setting selected printer:", printer)
    
    // Validate printer exists in available list
    if (printer && printer !== "Fallback_Printer" && availablePrinters.includes(printer)) {
      setSelectedPrinter(printer)
    } else {
      console.warn("⚠️ Attempted to select invalid printer:", printer)
      toast.error(`Printer "${printer}" is not available`)
    }
  }

  // Auto-reconnect on mount and periodic checks
  useEffect(() => {
    // Initial connection
    reconnect(false)

    // Set up periodic reconnection for disconnected state
    const interval = setInterval(() => {
      if (!isConnected && !loading) {
        console.log("🔄 Auto-reconnecting...")
        reconnect(false)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [isConnected, loading])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qz.websocket.isActive()) {
        qz.websocket.disconnect().catch(console.error)
      }
    }
  }, [])

  const contextValue: PrinterContextType = {
    isConnected,
    availablePrinters,
    selectedPrinter,
    defaultPrinter,
    reconnect: () => reconnect(true),
    setSelectedPrinter: setSelectedPrinterSafe,
    loading,
    error,
  }

  return (
    <PrinterContext.Provider value={contextValue}>
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