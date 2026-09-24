import { Homepage } from "@/components/blocks"
import { Metadata } from "next"
import "./home-life.css"

export const metadata: Metadata = {
  title: "Kitchen labelling software",
  description:
    "Create clear, consistent kitchen labels from the ingredient, allergen and date information you already manage.",
  openGraph: {
    title: "Kitchen labelling software | InstaLabel",
    description:
      "Create clear, consistent kitchen labels from the ingredient, allergen and date information you already manage.",
    url: "https://www.instalabel.co",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel kitchen labelling software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen labelling software | InstaLabel",
    description:
      "Create clear, consistent kitchen labels from the ingredient, allergen and date information you already manage.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co",
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

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Kitchen labelling software | InstaLabel",
    description:
      "Create clear, consistent kitchen labels from the ingredient, allergen and date information you already manage.",
    url: "https://www.instalabel.co",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Homepage />
    </>
  )
}
