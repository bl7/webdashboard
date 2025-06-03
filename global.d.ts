declare global {
  interface Window {
    epson?: any;
    epsonPrinter?: any;
    printer?: any;
  }
  interface Navigator {
    bluetooth: any;
  }
  interface Window {
    btSendData?: (data: Uint8Array) => Promise<void>;
  }
}
export {};
