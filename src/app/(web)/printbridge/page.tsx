import { PrintBridgePage } from "@/components/blocks/printbridge"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "PrintBridge Technology | Seamless Web-to-Printer Connectivity | InstaLabel",
  description: "Discover PrintBridge - our local bridge app that enables seamless printing from your web dashboard to thermal printers. No complex setup, instant connectivity, and reliable printing for your kitchen labels.",
  keywords: [
    "PrintBridge",
    "local bridge app",
    "web to printer",
    "thermal printer connectivity",
    "kitchen label printing",
    "web dashboard printing",
    "local printing solution",
    "printer bridge technology",
    "seamless printing",
    "restaurant printing system"
  ],
  openGraph: {
    title: "PrintBridge Technology | Seamless Web-to-Printer Connectivity",
    description: "PrintBridge enables seamless printing from your web dashboard to thermal printers. No complex setup, instant connectivity.",
    url: "https://instalabel.co/printbridge",
  },
  alternates: {
    canonical: "https://instalabel.co/printbridge",
  },
}

const Page = () => {
  return (
    <>
      <PrintBridgePage />
    </>
  )
}

export default Page 