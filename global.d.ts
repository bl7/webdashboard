declare global {
  interface Window {
    epson?: any
    epsonPrinter?: any
    printer?: any
    btSendData?: (data: Uint8Array) => Promise<void>
  }

  interface Navigator {
    bluetooth: any
  }
}

export {}
