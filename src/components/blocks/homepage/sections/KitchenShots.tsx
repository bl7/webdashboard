import React from "react"
import { ShotStrip } from "@/components/marketing/MediaSlot"

export const KitchenShots = () => (
  <div className="home-life">
    <ShotStrip
      title="See it in a kitchen."
      shots={[
        {
          file: "desktop-print.mp4",
          poster: "installed-printer.png",
          alt: "A label printing from a computer to an installed printer",
          label: "From a computer, through PrintBridge, to the printer already installed.",
        },
        {
          file: "android-print.mp4",
          poster: "android-printer.png",
          alt: "Printing from the Android app to a supported Bluetooth printer",
          label: "From Android, on a MUNBYN RW411B or Born4Ship DB403.",
        },
        {
          file: "label-on-tub.mp4",
          poster: "prep-on-container.png",
          alt: "A printed prep label on a kitchen container",
          label: "The label on the container, after the team has checked it.",
        },
        {
          file: "shelf.jpg",
          alt: "A prep shelf of labelled containers",
          label: "A real fridge or prep shelf.",
        },
      ]}
    />
  </div>
)
