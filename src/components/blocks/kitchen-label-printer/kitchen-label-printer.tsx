import React from "react"
import { KitchenLabelPrinterHero } from "./sections/KitchenLabelPrinterHero"
import { KitchenLabelPrinterBody } from "./sections/KitchenLabelPrinterBody"
import { ShotStrip } from "@/components/marketing/MediaSlot"

export const KitchenLabelPrinterPage = () => {
  return (
    <>
      <KitchenLabelPrinterHero />
      <ShotStrip
        title="The setups we can show."
        shots={[
          {
            file: "installed-printer.png",
            alt: "A label printer installed beside a computer",
            label: "Desktop: the printer already installed on Windows or macOS.",
          },
          {
            file: "rw411b.png",
            alt: "MUNBYN RW411B",
            label: "Android: MUNBYN RW411B.",
          },
          {
            file: "db403.png",
            alt: "Born4Ship DB403",
            label: "Android: Born4Ship DB403.",
          },
        ]}
      />
      <KitchenLabelPrinterBody />
    </>
  )
}
