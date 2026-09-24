import React from "react"
import { PrintBridgeHero } from "./sections/PrintBridgeHero"
import { PrintBridgeBody } from "./sections/PrintBridgeBody"
import { ShotStrip } from "@/components/marketing/MediaSlot"

export const PrintBridgePage = () => {
  return (
    <>
      <PrintBridgeHero />
      <ShotStrip
        shots={[
          {
            file: "desktop-print.mp4",
            poster: "installed-printer.png",
            alt: "PrintBridge sending a label to an installed printer",
            label: "Windows or macOS. The printer is installed with its own driver. PrintBridge connects the browser to that printer.",
          },
        ]}
      />
      <PrintBridgeBody />
    </>
  )
}
