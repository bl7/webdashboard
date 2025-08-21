import { PrintBridgePage } from "@/components/blocks/printbridge"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "PrintBridge Technology | Web-to-Printer Connectivity",
  description:
    "Discover PrintBridge - our local bridge app that enables seamless printing from your web dashboard to thermal printers. No complex setup, instant connectivity, and reliable printing for your kitchen labels.",
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
    "restaurant printing system",
    "thermal printer software",
    "kitchen printer setup",
    "label printing bridge",
    "restaurant technology",
    "kitchen automation",
    "thermal printer app",
    "local printing bridge",
    "web to thermal printer",
  ],
  openGraph: {
    title: "PrintBridge Technology | Web-to-Printer Connectivity",
    description:
      "PrintBridge enables seamless printing from your web dashboard to thermal printers. No complex setup, instant connectivity.",
    url: "https://www.instalabel.co/printbridge",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "PrintBridge Technology - Web to Printer Connectivity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrintBridge Technology | Seamless Web-to-Printer Connectivity",
    description:
      "PrintBridge enables seamless printing from your web dashboard to thermal printers. No complex setup, instant connectivity.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/printbridge",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const Page = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "PrintBridge Technology",
    description:
      "PrintBridge enables seamless printing from your web dashboard to thermal printers. No complex setup, instant connectivity.",
    url: "https://www.instalabel.co/printbridge",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "PrintBridge",
      description: "Local bridge app for seamless web-to-printer connectivity",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Windows, macOS",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free with InstaLabel subscription",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "200",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.instalabel.co",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "PrintBridge",
          item: "https://www.instalabel.co/printbridge",
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PrintBridgePage />
    </>
  )
}

export default Page
