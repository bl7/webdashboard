declare global {
  interface Window {
    epson?: any
    epsonPrinter?: any
    printer?: any
    btSendData?: (data: Uint8Array) => Promise<void>
  }
  interface BluetoothDevice {}
  interface BluetoothRemoteGATTServer {}

  interface Navigator {
    bluetooth: any
  }
}

// Add this to the top of your file

export {}
