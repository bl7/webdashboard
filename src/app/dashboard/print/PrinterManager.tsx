import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react"

const ALLERGENS = ["milk", "eggs", "nuts", "soy", "wheat", "fish", "shellfish", "peanuts"]
const MAX_INGREDIENTS_TO_FIT = 6

import { PrintQueueItem } from "@/types/print"
type PrinterStatus = {
  printerConnected: boolean
  btDevice: BluetoothDevice | null
  isBtConnecting: boolean
  isBtSending: boolean
}

interface EpsonDevice {
  addTextAlign(align: number): void
  addTextSize(width: number, height: number): void
  addText(text: string): void
  addFeedLine(lines: number): void
  addCut(mode: number): void
  send(): void
  ALIGN_CENTER: number
  ALIGN_LEFT: number
  CUT_FEED: number
}

export interface PrinterManagerHandles {
  handleEpsonPrint: (queue: PrintQueueItem[]) => void
  handleBluetoothPrint: (queue: PrintQueueItem[]) => Promise<void>
  scanAndConnectBluetooth: () => Promise<void>
  initializeEpsonPrinter: () => void
  printerConnected: boolean
  btServer: BluetoothRemoteGATTServer | null
}

type Props = {
  setMessage: (msg: string | null) => void
  scriptLoaded: boolean
  onStatusChange?: (status: PrinterStatus) => void
}

const PrinterManager = forwardRef<PrinterManagerHandles, Props>(
  ({ setMessage, scriptLoaded }, ref) => {
    const [epsonPrinter, setEpsonPrinter] = useState<EpsonDevice | null>(null)
    const [printerConnected, setPrinterConnected] = useState(false)
    const [btDevice, setBtDevice] = useState<BluetoothDevice | null>(null)
    const [btServer, setBtServer] = useState<BluetoothRemoteGATTServer | null>(null)
    const [isBtConnecting, setIsBtConnecting] = useState(false)
    const [isBtSending, setIsBtSending] = useState(false)

    const printCallback = useCallback(
      (deviceObj: EpsonDevice | null, errorCode: number) => {
        if (deviceObj) {
          setEpsonPrinter(deviceObj)
          setPrinterConnected(true)
          setMessage("USB/Network printer connected")
        } else {
          setPrinterConnected(false)
          setMessage(`Failed to create printer device: ${errorCode}`)
        }
      },
      [setMessage]
    )

    const connectCallback = useCallback(
      (resultConnect: string) => {
        if (resultConnect === "OK") {
          // @ts-ignore
          window.epsonPrinter.createDevice(
            "local_printer",
            // @ts-ignore
            window.epsonPrinter.DEVICE_TYPE_PRINTER,
            { crypto: false, buffer: false },
            printCallback
          )
          setMessage("Connected to printer service. Creating printer device...")
        } else {
          setPrinterConnected(false)
          setMessage(`Connection error: ${resultConnect}`)
        }
      },
      [printCallback, setMessage]
    )

    const initializeEpsonPrinter = useCallback(() => {
      try {
        // @ts-ignore
        if (window.epson && window.epson.ePOSDevice) {
          // @ts-ignore
          window.epsonPrinter = new window.epson.ePOSDevice()
          // @ts-ignore
          window.epsonPrinter.connect("localhost", 8008, connectCallback)
          setMessage("Initializing USB/Network printer connection...")
        } else {
          setMessage("Epson ePOS SDK not loaded")
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage(`Initialization error: ${error.message}`)
        } else {
          setMessage("Unknown initialization error")
        }
      }
    }, [connectCallback, setMessage])

    useEffect(() => {
      if (scriptLoaded) {
        initializeEpsonPrinter()
      }
      return () => {
        // @ts-ignore
        if (window.epsonPrinter) {
          // @ts-ignore
          window.epsonPrinter.disconnect?.()
        }
      }
    }, [scriptLoaded, initializeEpsonPrinter])

    async function scanAndConnectBluetooth() {
      setMessage(null)
      setIsBtConnecting(true)
      try {
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ["0000ffe0-0000-1000-8000-00805f9b34fb"],
        })
        if (!device.gatt) throw new Error("No GATT server available on device")
        const server = await device.gatt.connect()
        setBtServer(server)
        try {
          await server.getPrimaryService("0000ffe0-0000-1000-8000-00805f9b34fb")
        } catch {
          throw new Error("Device does not support required service")
        }
        setBtDevice(device)
        device.addEventListener("gattserverdisconnected", () => {
          setMessage("Bluetooth device disconnected")
          setBtDevice(null)
          setBtServer(null)
        })
        setMessage("Bluetooth printer connected")
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage(`Bluetooth connection failed: ${error.message}`)
        } else {
          setMessage("Bluetooth connection failed: Unknown error")
        }
      } finally {
        setIsBtConnecting(false)
      }
    }

    async function sendDataBluetooth(data: Uint8Array) {
      if (!btServer) {
        setMessage("No Bluetooth device connected")
        return
      }
      setIsBtSending(true)
      try {
        const serviceUUID = "0000ffe0-0000-1000-8000-00805f9b34fb"
        const characteristicUUID = "0000ffe1-0000-1000-8000-00805f9b34fb"
        const service = await btServer.getPrimaryService(serviceUUID)
        const characteristic = await service.getCharacteristic(characteristicUUID)
        await characteristic.writeValue(data.buffer as ArrayBuffer)
        setMessage("Data sent to Bluetooth printer")
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage(`Send failed: ${error.message}`)
        } else {
          setMessage("Send failed: Unknown error")
        }
      } finally {
        setIsBtSending(false)
      }
    }

    const handleEpsonPrint = (queue: PrintQueueItem[]) => {
      if (!epsonPrinter) {
        setMessage("USB/Network printer not connected")
        return
      }
      if (queue.length === 0) {
        setMessage("No items to print")
        return
      }
      try {
        queue.forEach((item) => {
          for (let i = 0; i < item.quantity; i++) {
            epsonPrinter.addTextAlign(epsonPrinter.ALIGN_CENTER)
            epsonPrinter.addTextSize(1, 1)
            epsonPrinter.addText(`${item.name}\n`)
            epsonPrinter.addTextAlign(epsonPrinter.ALIGN_LEFT)
            epsonPrinter.addTextSize(1, 1)
            if (item.type === "ingredients" && item.allergens?.length) {
              epsonPrinter.addText("Allergens: " + item.allergens.join(", ") + "\n")
            } else if (item.type === "menu" && item.ingredients?.length) {
              const tooLong = item.ingredients.length > MAX_INGREDIENTS_TO_FIT
              if (tooLong) {
                const allergensInIngredients = item.ingredients
                  .map((ing) => ing.toLowerCase())
                  .filter((ing) => ALLERGENS.includes(ing))
                if (allergensInIngredients.length > 0) {
                  epsonPrinter.addText("Allergens: " + allergensInIngredients.join(", ") + "\n")
                }
              } else {
                epsonPrinter.addText("Ingredients: " + item.ingredients.join(", ") + "\n")
              }
            }
            if (item.printedOn && item.expiryDate) {
              epsonPrinter.addText(
                `Printed On: ${new Date(item.printedOn).toLocaleDateString()} | Expiry: ${new Date(
                  item.expiryDate
                ).toLocaleDateString()}\n`
              )
            }
            epsonPrinter.addFeedLine(2)
            epsonPrinter.addCut(epsonPrinter.CUT_FEED)
          }
        })
        epsonPrinter.send()
        setMessage("USB/Network print job sent")
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage(`Print error: ${error.message}`)
        } else {
          setMessage("Unknown print error")
        }
      }
    }

    async function printLabelOverBluetooth(item: PrintQueueItem) {
      const encoder = new TextEncoder()
      let lines = `${item.name}\n`
      if (item.type === "ingredients" && item.allergens?.length) {
        lines += `Allergens: ${item.allergens.join(", ")}\n`
      } else if (item.type === "menu" && item.ingredients?.length) {
        const tooLong = item.ingredients.length > MAX_INGREDIENTS_TO_FIT
        if (tooLong) {
          const allergensInIngredients = item.ingredients
            .map((ing) => ing.toLowerCase())
            .filter((ing) => ALLERGENS.includes(ing))
          if (allergensInIngredients.length > 0) {
            lines += `Allergens: ${allergensInIngredients.join(", ")}\n`
          }
        } else {
          lines += `Ingredients: ${item.ingredients.join(", ")}\n`
        }
      }
      if (item.printedOn && item.expiryDate) {
        lines += `Printed On: ${new Date(item.printedOn).toLocaleDateString()} | Expiry: ${new Date(
          item.expiryDate
        ).toLocaleDateString()}\n`
      }
      const textBytes = encoder.encode(lines)
      const cutBytes = new Uint8Array([0x1d, 0x56, 0x01])
      const data = new Uint8Array(textBytes.length + cutBytes.length)
      data.set(textBytes, 0)
      data.set(cutBytes, textBytes.length)
      await sendDataBluetooth(data)
    }

    const handleBluetoothPrint = async (queue: PrintQueueItem[]) => {
      if (!btServer) {
        setMessage("Bluetooth printer not connected")
        return
      }
      if (queue.length === 0) {
        setMessage("No items to print")
        return
      }
      for (const item of queue) {
        for (let i = 0; i < item.quantity; i++) {
          await printLabelOverBluetooth(item)
        }
      }
      setMessage("Bluetooth print job sent")
    }

    useImperativeHandle(ref, () => ({
      handleEpsonPrint,
      handleBluetoothPrint,
      scanAndConnectBluetooth,
      initializeEpsonPrinter,
      printerConnected,
      btServer,
    }))

    return null
  }
)

export default PrinterManager
