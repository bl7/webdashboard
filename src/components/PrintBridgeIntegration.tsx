import React, { useState } from "react"
import { usePrintBridgeContext } from "../context/PrintBridgeContext"
import { usePrinter } from "../context/PrinterContext"
import { ConnectionStatus } from "./ConnectionStatus"
import { Button } from "./ui/button"
import Link from "next/link"

type LabelHeight = "40mm" | "80mm"

function getPrinterName(printer: any): string {
  if (!printer) return ""
  if (typeof printer === "string") return printer
  if (typeof printer.name === "object" && typeof printer.name.name === "string")
    return printer.name.name
  if (typeof printer.name === "string") return printer.name
  return ""
}

export const PrintBridgeIntegration: React.FC = () => {
  const {
    isConnected: printBridgeConnected,
    printers: printBridgePrinters,
    defaultPrinter: printBridgeDefaultPrinter,
    sendPrintJob,
    loading: printBridgeLoading,
    error: printBridgeError,
    reconnect: printBridgeReconnect,
    osType,
  } = usePrintBridgeContext()

  const {
    isConnected: printerConnected,
    printers: availablePrinters,
    defaultPrinter: legacyDefaultPrinter,
    print: legacyPrint,
    loading: printerLoading,
    error: printerError,
    reconnect: printerReconnect,
  } = usePrinter()

  const [selectedPrinterName, setSelectedPrinterName] = useState<string>("")
  const [labelHeight, setLabelHeight] = useState<LabelHeight>("40mm")
  const [printStatus, setPrintStatus] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  // Set mounted state after component mounts
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getConnectionInfo = () => {
    if (osType === "mac") {
      return {
        isConnected: printerConnected,
        printers: availablePrinters,
        defaultPrinter: legacyDefaultPrinter,
        loading: printerLoading,
        error: printerError,
        reconnect: printerReconnect,
        sendPrint: (imageData: string, printerName?: string) => {
          if (printerName) {
            const printer = availablePrinters.find((p) => getPrinterName(p) === printerName)
            return legacyPrint(imageData, printer)
          }
          return legacyPrint(imageData)
        },
      }
    } else if (osType === "windows") {
      return {
        isConnected: printBridgeConnected,
        printers: printBridgePrinters,
        defaultPrinter: printBridgeDefaultPrinter,
        loading: printBridgeLoading,
        error: printBridgeError,
        reconnect: printBridgeReconnect,
        sendPrint: sendPrintJob,
      }
    } else {
      return {
        isConnected: printerConnected,
        printers: availablePrinters,
        defaultPrinter: legacyDefaultPrinter,
        loading: printerLoading,
        error: printerError,
        reconnect: printerReconnect,
        sendPrint: (imageData: string, printerName?: string) => {
          if (printerName) {
            const printer = availablePrinters.find((p) => getPrinterName(p) === printerName)
            return legacyPrint(imageData, printer)
          }
          return legacyPrint(imageData)
        },
      }
    }
  }

  const connectionInfo = getConnectionInfo()

  // Create a simple test label image based on height
  const createTestLabel = (): string => {
    // Check if we're on the client side
    if (typeof window === "undefined" || typeof document === "undefined") {
      return ""
    }

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    // Set canvas size based on label height at 300 DPI
    const width = 661 // 56mm at 300 DPI
    let height: number

    switch (labelHeight) {
      case "40mm":
        height = 472 // 40mm at 300 DPI
        break
      case "80mm":
        height = 944 // 80mm at 300 DPI
        break
      default:
        height = 472 // Default to 40mm
        break
    }

    canvas.width = width
    canvas.height = height

    if (!ctx) return ""

    // White background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)

    // Purple border
    ctx.strokeStyle = "#7c3aed"
    ctx.lineWidth = 4
    ctx.strokeRect(2, 2, width - 4, height - 4)

    // Purple background for header
    ctx.fillStyle = "#7c3aed"
    ctx.fillRect(0, 0, width, 60)

    // White text for header
    ctx.fillStyle = "white"
    ctx.font = "bold 24px Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("TEST LABEL", width / 2, 38)

    // Black text for main content
    ctx.fillStyle = "black"
    ctx.font = "bold 20px Arial, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Thank you for choosing", width / 2, 120)
    ctx.fillText("InstaLabel", width / 2, 150)

    // Additional info
    ctx.font = "16px Arial, sans-serif"
    ctx.fillText("Printer Test Successful", width / 2, 200)
    ctx.fillText(
      "Connection: " + (connectionInfo.isConnected ? "Connected" : "Disconnected"),
      width / 2,
      230
    )
    ctx.fillText(
      "Printer: " + (selectedPrinterName || connectionInfo.defaultPrinter?.name || "Default"),
      width / 2,
      260
    )
    ctx.fillText("Label Size: " + labelHeight, width / 2, 290)

    // Footer
    ctx.font = "12px Arial, sans-serif"
    ctx.fillText("Generated: " + new Date().toLocaleString(), width / 2, height - 30)

    return canvas.toDataURL("image/png")
  }

  const handlePrint = async () => {
    // Check if we're on the client side
    if (typeof window === "undefined") {
      return
    }

    if (!connectionInfo.isConnected) {
      setPrintStatus("❌ Printer not connected")
      return
    }

    // Use selected printer or default printer
    const printerToUse = selectedPrinterName || connectionInfo.defaultPrinter?.name

    if (!printerToUse) {
      setPrintStatus("❌ No printer selected")
      return
    }

    setPrintStatus("🖨️ Sending test label...")

    // Create the test label image
    const testImageData = createTestLabel()

    try {
      if (osType === "windows") {
        // Windows: use PrintBridge sendPrintJob
        if (connectionInfo.sendPrint(testImageData, printerToUse)) {
          setPrintStatus(`✅ Test label sent to ${printerToUse}`)
        } else {
          setPrintStatus("❌ Failed to send test label")
        }
      } else {
        // Mac/Other: use legacy print
        await connectionInfo.sendPrint(testImageData, printerToUse)
        setPrintStatus(`✅ Test label sent to ${printerToUse}`)
      }
      setTimeout(() => setPrintStatus(""), 3000)
    } catch (error) {
      setPrintStatus("❌ Failed to send test label")
    }
  }

  const handleReconnect = () => {
    setPrintStatus("🔄 Reconnecting...")
    connectionInfo.reconnect()
    setTimeout(() => setPrintStatus(""), 2000)
  }

  // Auto-select default printer if available and no printer is selected
  React.useEffect(() => {
    const defaultPrinter: any = connectionInfo.defaultPrinter
    if (defaultPrinter && !selectedPrinterName) {
      if (typeof defaultPrinter.name === "object" && typeof defaultPrinter.name.name === "string") {
        setSelectedPrinterName(defaultPrinter.name.name)
      } else if (typeof defaultPrinter.name === "string") {
        setSelectedPrinterName(defaultPrinter.name)
      }
    }
  }, [connectionInfo.defaultPrinter, selectedPrinterName])

  // When sending a print job, find the printer object by matching printer.name.name or printer.name to selectedPrinterName
  const getSelectedPrinter = () => {
    return connectionInfo.printers.find((p: any) => getPrinterName(p) === selectedPrinterName)
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-purple-800">Printer Integration</h2>
          <p className="mt-1 text-sm text-gray-500">Test and manage your printer connection</p>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        <ConnectionStatus />
      </div>

      {/* Server Download Notice */}
      {!connectionInfo.isConnected && (
        <div className="mb-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-purple-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="mb-1 text-sm font-medium text-purple-800">Need the printer server?</h4>
              <p className="mb-2 text-sm text-purple-700">
                If you don't have the printer server installed, you can download it from the
                Settings page.
              </p>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center rounded bg-purple-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                Go to Settings →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {connectionInfo.error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <div className="text-sm text-red-800">
            <strong>Connection Error:</strong> {connectionInfo.error}
          </div>
        </div>
      )}

      {/* Printer Selection - Always show if printers are available */}
      {connectionInfo.printers.length > 0 && (
        <div className="mb-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
          <h3 className="mb-3 font-semibold text-purple-900">Available Printers</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-purple-800">Select Printer:</label>
            <select
              value={selectedPrinterName}
              onChange={(e) => setSelectedPrinterName(e.target.value)}
              className="w-full rounded border border-purple-300 bg-white p-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Select a printer...</option>
              {connectionInfo.printers.map((printer: any) => {
                const printerName = getPrinterName(printer)
                return (
                  <option key={printerName} value={printerName}>
                    {printerName}
                  </option>
                )
              })}
            </select>
            <div className="text-xs text-purple-600">
              {connectionInfo.printers.length} printer(s) detected
            </div>
          </div>
        </div>
      )}

      {/* No Printers Available Message */}
      {connectionInfo.printers.length === 0 && connectionInfo.isConnected && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-yellow-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="mb-1 text-sm font-medium text-yellow-800">No printers detected</h4>
              <p className="text-sm text-yellow-700">
                The server is connected but no printers were found. Make sure your printers are
                properly connected and the server has access to them.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Label Height Selection */}
      <div className="mb-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
        <h3 className="mb-3 font-semibold text-purple-900">Label Height</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium text-purple-800">Select Label Height:</label>
          <select
            value={labelHeight}
            onChange={(e) => setLabelHeight(e.target.value as LabelHeight)}
            className="w-full rounded border border-purple-300 bg-white p-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          >
            <option value="40mm">40mm (Standard)</option>
            <option value="80mm">80mm (Large)</option>
          </select>
          <div className="text-xs text-purple-600">
            Label will be printed at {labelHeight === "40mm" ? "60mm" : "56mm"} width x{" "}
            {labelHeight} height
          </div>
        </div>
      </div>

      {/* Test Label Preview */}
      {mounted ? (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-800">Test Label Preview</h3>
          <div className="flex justify-center">
            <div className="rounded-lg border-2 border-purple-300 bg-white p-2">
              <img
                src={createTestLabel()}
                alt="Test Label Preview"
                className="object-contain"
                style={{
                  width: labelHeight === "40mm" ? "165px" : "330px",
                  height: labelHeight === "40mm" ? "93px" : "186px",
                }}
              />
            </div>
          </div>
          <div className="mt-2 text-center text-xs text-gray-500">
            This test label will be printed at 56mm x {labelHeight}
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-3 font-semibold text-gray-800">Test Label Preview</h3>
          <div className="flex h-32 items-center justify-center">
            <div className="text-gray-500">Loading preview...</div>
          </div>
        </div>
      )}

      {/* Print Status */}
      {printStatus && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="text-sm">{printStatus}</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handlePrint}
          disabled={!connectionInfo.isConnected || connectionInfo.loading || !selectedPrinterName}
          className="flex-1 bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400"
        >
          {connectionInfo.loading ? "Connecting..." : "Print Test Label"}
        </Button>

        {!connectionInfo.isConnected && (
          <Button
            onClick={handleReconnect}
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Reconnect
          </Button>
        )}
      </div>

      {/* Debug Information */}
      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-gray-700">Debug Information</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div>Connection Status: {connectionInfo.isConnected ? "Connected" : "Disconnected"}</div>
          <div>Loading: {connectionInfo.loading ? "Yes" : "No"}</div>
          <div>Available Printers: {connectionInfo.printers.length}</div>
          <div>
            Default Printer:{" "}
            {connectionInfo.defaultPrinter
              ? typeof (connectionInfo.defaultPrinter as any).name === "object" &&
                typeof (connectionInfo.defaultPrinter as any).name.name === "string"
                ? (connectionInfo.defaultPrinter as any).name.name
                : typeof (connectionInfo.defaultPrinter as any).name === "string"
                  ? (connectionInfo.defaultPrinter as any).name
                  : "Unknown Printer"
              : "None"}
          </div>
          <div>Selected Printer: {selectedPrinterName || "None"}</div>
          <div>Label Height: {labelHeight}</div>
        </div>
      </div>
    </div>
  )
}
