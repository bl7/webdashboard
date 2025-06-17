// import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react"
// import { PrintQueueItem } from "@/types/print"

// const ALLERGENS = ["milk", "eggs", "nuts", "soy", "wheat", "fish", "shellfish", "peanuts"]
// const MAX_INGREDIENTS_TO_FIT = 6
// import { formatLabelForPrint } from "./labelFormatter"
// interface EpsonDevice {
//   addTextAlign(align: number): void
//   addTextSize(width: number, height: number): void
//   addText(text: string): void
//   addFeedLine(lines: number): void
//   addCut(mode: number): void
//   send(): void
//   ALIGN_CENTER: number
//   ALIGN_LEFT: number
//   CUT_FEED: number
// }

// export interface PrinterManagerHandles {
//   handleEpsonPrint: (
//     queue: PrintQueueItem[],
//     ALLERGENS: string[],
//     customExpiry: Record<string, string>,
//     MAX_INGREDIENTS_TO_FIT: number
//   ) => void
//   handleBluetoothPrint: (
//     queue: PrintQueueItem[],
//     ALLERGENS: string[],
//     customExpiry: Record<string, string>,
//     MAX_INGREDIENTS_TO_FIT: number
//   ) => Promise<void>
//   scanAndConnectBluetooth: () => Promise<void>
//   initializeEpsonPrinter: () => void
//   printerConnected: boolean
//   btServer: BluetoothRemoteGATTServer | null
// }

// type Props = {
//   setMessage: (msg: string | null) => void
//   scriptLoaded: boolean
//   onStatusChange?: (status: any) => void
// }

// const PrinterManager = forwardRef<PrinterManagerHandles, Props>(
//   ({ setMessage, scriptLoaded, onStatusChange }, ref) => {
//     const [epsonPrinter, setEpsonPrinter] = useState<EpsonDevice | null>(null)
//     const [printerConnected, setPrinterConnected] = useState(false)
//     const [btDevice, setBtDevice] = useState<BluetoothDevice | null>(null)
//     const [btServer, setBtServer] = useState<BluetoothRemoteGATTServer | null>(null)
//     const [isBtConnecting, setIsBtConnecting] = useState(false)
//     const [isBtSending, setIsBtSending] = useState(false)

//     useEffect(() => {
//       onStatusChange?.({
//         printerConnected,
//         btDevice,
//         isBtConnecting,
//         isBtSending,
//       })
//     }, [printerConnected, btDevice, isBtConnecting, isBtSending])

//     const printCallback = useCallback(
//       (deviceObj: EpsonDevice | null, errorCode: number) => {
//         if (deviceObj) {
//           setEpsonPrinter(deviceObj)
//           setPrinterConnected(true)
//           setMessage("USB printer connected")
//         } else {
//           setPrinterConnected(false)
//           setMessage(`USB connect failed: ${errorCode}`)
//         }
//       },
//       [setMessage]
//     )

//     const connectCallback = useCallback(
//       (result: string) => {
//         if (result === "OK") {
//           // @ts-ignore
//           window.epsonPrinter.createDevice(
//             "local_printer",
//             window.epsonPrinter.DEVICE_TYPE_PRINTER,
//             { crypto: false, buffer: false },
//             printCallback
//           )
//           setMessage("Connected to printer service")
//         } else {
//           setPrinterConnected(false)
//           setMessage(`USB service error: ${result}`)
//         }
//       },
//       [printCallback, setMessage]
//     )

//     const initializeEpsonPrinter = useCallback(() => {
//       try {
//         // @ts-ignore
//         if (window.epson && window.epson.ePOSDevice) {
//           // @ts-ignore
//           window.epsonPrinter = new window.epson.ePOSDevice()
//           // @ts-ignore
//           window.epsonPrinter.connect("localhost", 8008, connectCallback)
//         } else {
//           setMessage("Epson SDK not available")
//         }
//       } catch (e) {
//         setMessage(`USB init error: ${(e as Error).message}`)
//       }
//     }, [connectCallback, setMessage])

//     useEffect(() => {
//       if (scriptLoaded) {
//         initializeEpsonPrinter()
//       }
//       return () => {
//         // @ts-ignore
//         window.epsonPrinter?.disconnect?.()
//       }
//     }, [scriptLoaded])

//     const scanAndConnectBluetooth = async () => {
//       setMessage(null)
//       setIsBtConnecting(true)
//       try {
//         const device = await navigator.bluetooth.requestDevice({
//           filters: [{ namePrefix: "TM" }], // Epson TM-m30 usually begins with "TM"
//           optionalServices: ["0000ffe0-0000-1000-8000-00805f9b34fb"],
//         })
//         if (!device.gatt) throw new Error("No GATT")
//         const server = await device.gatt.connect()
//         await server.getPrimaryService("0000ffe0-0000-1000-8000-00805f9b34fb")
//         setBtDevice(device)
//         setBtServer(server)
//         device.addEventListener("gattserverdisconnected", () => {
//           setBtDevice(null)
//           setBtServer(null)
//           setMessage("Bluetooth disconnected")
//         })
//         setMessage("Bluetooth connected")
//       } catch (e) {
//         setMessage(`Bluetooth failed: ${(e as Error).message}`)
//       } finally {
//         setIsBtConnecting(false)
//       }
//     }

//     const sendDataBluetooth = async (data: Uint8Array) => {
//       if (!btServer) return
//       setIsBtSending(true)
//       try {
//         const service = await btServer.getPrimaryService("0000ffe0-0000-1000-8000-00805f9b34fb")
//         const char = await service.getCharacteristic("0000ffe1-0000-1000-8000-00805f9b34fb")
//         await char.writeValue(data)
//         setMessage("Bluetooth data sent")
//       } catch (e) {
//         setMessage(`Bluetooth send error: ${(e as Error).message}`)
//       } finally {
//         setIsBtSending(false)
//       }
//     }

//     const handleEpsonPrint = (
//       queue: PrintQueueItem[],
//       ALLERGENS: string[],
//       customExpiry: Record<string, string>,
//       MAX_INGREDIENTS_TO_FIT: number
//     ) => {
//       if (!epsonPrinter) return setMessage("No USB printer")
//       if (!queue.length) return setMessage("Queue empty")
//       queue.forEach((item) => {
//         for (let i = 0; i < item.quantity; i++) {
//           const labelText = formatLabelForPrint(
//             item,
//             ALLERGENS,
//             customExpiry,
//             MAX_INGREDIENTS_TO_FIT
//           )
//           epsonPrinter.addTextAlign(epsonPrinter.ALIGN_LEFT)
//           epsonPrinter.addText(labelText + "\n")
//           epsonPrinter.addFeedLine(2)
//           epsonPrinter.addCut(epsonPrinter.CUT_FEED)
//         }
//       })
//       epsonPrinter.send()
//       setMessage("USB print sent")
//     }

//     const handleBluetoothPrint = async (
//       queue: PrintQueueItem[],
//       ALLERGENS: string[],
//       customExpiry: Record<string, string>,
//       MAX_INGREDIENTS_TO_FIT: number
//     ) => {
//       if (!btServer) return setMessage("No Bluetooth printer")
//       const encoder = new TextEncoder()
//       for (const item of queue) {
//         for (let i = 0; i < item.quantity; i++) {
//           const labelText = formatLabelForPrint(
//             item,
//             ALLERGENS,
//             customExpiry,
//             MAX_INGREDIENTS_TO_FIT
//           )
//           const cut = new Uint8Array([0x1d, 0x56, 0x01])
//           const body = encoder.encode(labelText + "\n")
//           const payload = new Uint8Array(body.length + cut.length)
//           payload.set(body)
//           payload.set(cut, body.length)
//           await sendDataBluetooth(payload)
//         }
//       }
//       setMessage("Bluetooth print sent")
//     }

//     useImperativeHandle(ref, () => ({
//       handleEpsonPrint,
//       handleBluetoothPrint,
//       scanAndConnectBluetooth,
//       initializeEpsonPrinter,
//       printerConnected,
//       btServer,
//     }))

//     return null
//   }
// )

// export default PrinterManager
