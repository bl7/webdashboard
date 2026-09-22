import { About } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: { absolute: "About InstaLabel | Kitchen labelling software" },
  description:
    "Learn why InstaLabel focuses on clear kitchen labels, reusable item information and flexible printing. Contact the team in Bournemouth.",
  openGraph: {
    title: "About InstaLabel | Kitchen labelling software",
    description:
      "Learn why InstaLabel focuses on clear kitchen labels, reusable item information and flexible printing. Contact the team in Bournemouth.",
    url: "https://www.instalabel.co/about",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "About InstaLabel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About InstaLabel | Kitchen labelling software",
    description:
      "Learn why InstaLabel focuses on clear kitchen labels, reusable item information and flexible printing. Contact the team in Bournemouth.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/about",
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
    name: "About InstaLabel | Kitchen labelling software",
    description:
      "Learn why InstaLabel focuses on clear kitchen labels, reusable item information and flexible printing. Contact the team in Bournemouth.",
    url: "https://www.instalabel.co/about",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <About />
    </>
  )
}

export default Page
