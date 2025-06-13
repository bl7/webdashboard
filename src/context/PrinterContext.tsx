// "use client"

// import React, { createContext, useContext, useRef, useState } from "react"
// // import PrinterManager, { PrinterManagerHandles } from "@/app/dashboard/print/PrinterManager"
// import { PrintQueueItem } from "@/types/print"

// type PrinterStatus = {
//   printerConnected: boolean
//   btDevice: BluetoothDevice | null
//   isBtConnecting: boolean
//   isBtSending: boolean
// }

// const PrinterContext = createContext<{
//   // managerRef: React.RefObject<PrinterManagerHandles>
//   status: PrinterStatus
//   setStatus: React.Dispatch<React.SetStateAction<PrinterStatus>>
//   message: string | null
//   setMessage: (msg: string | null) => void
// } | null>(null)

// export const usePrinter = () => {
//   const context = useContext(PrinterContext)
//   if (!context) throw new Error("usePrinter must be used inside PrinterProvider")
//   return context
// }

// export function PrinterProvider({
//   children,
//   printQueue,
// }: {
//   children: React.ReactNode
//   printQueue: PrintQueueItem[]
// }) {
//   // const managerRef = useRef<PrinterManagerHandles>(null)

//   const [status, setStatus] = useState<PrinterStatus>({
//     printerConnected: false,
//     btDevice: null,
//     isBtConnecting: false,
//     isBtSending: false,
//   })

//   const [message, setMessage] = useState<string | null>(null)

//   const scriptLoaded = typeof window !== "undefined" && !!window.epson

//   return (
//     <PrinterContext.Provider value={{ managerRef, status, setStatus, message, setMessage }}>
//       <PrinterManager
//         ref={managerRef}
//         scriptLoaded={scriptLoaded}
//         setMessage={setMessage}
//         onStatusChange={setStatus}
//       />

//       {children}
//     </PrinterContext.Provider>
//   )
// }
