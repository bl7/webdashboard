import { Homepage } from "@/components/blocks";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "InstaLabel - Smart Kitchen Labeling System | Food Safety Labels & Expiry Tracking",
  description: "Professional kitchen labeling system for restaurants, cafes, and food businesses. Print food safety labels, allergen warnings, expiry dates, and prep labels instantly. Thermal printer compatible, HACCP compliant. Start free trial today.",
  keywords: [
    "kitchen labeling system",
    "food safety labels",
    "restaurant labeling",
    "allergen labels",
    "expiry date labels",
    "thermal printer labels",
    "kitchen management",
    "food prep labels",
    "HACCP compliance",
    "restaurant technology",
    "kitchen automation",
    "food labeling software",
    "chef tools",
    "kitchen efficiency",
    "food safety compliance",
    "restaurant management",
    "kitchen organization",
    "food service labels",
    "kitchen printer",
    "restaurant labeling system",
    "Natasha's Law compliance",
    "PPDS labels",
    "kitchen workflow automation"
  ],
  openGraph: {
    title: "InstaLabel - Smart Kitchen Labeling System | Food Safety & Expiry Tracking",
    description: "Professional kitchen labeling system for restaurants and food businesses. Print food safety labels, allergen warnings, and expiry dates instantly. Thermal printer compatible and HACCP compliant.",
    url: "https://instalabel.co",
    type: "website",
    images: [
      {
        url: "https://instalabel.co/og-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "InstaLabel - Smart Kitchen Labeling System"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaLabel - Smart Kitchen Labeling System",
    description: "Professional kitchen labeling system for restaurants and food businesses. Print food safety labels, allergen warnings, and expiry dates instantly.",
    images: ["https://instalabel.co/og-homepage.jpg"]
  },
  alternates: {
    canonical: "https://instalabel.co",
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
  }
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "InstaLabel - Smart Kitchen Labeling System",
    "description": "Professional kitchen labeling system for restaurants and food businesses. Print food safety labels, allergen warnings, and expiry dates instantly.",
    "url": "https://instalabel.co",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "InstaLabel",
      "description": "Professional kitchen labeling system for restaurants and food businesses",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free trial available"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "150"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://instalabel.co"
        }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Homepage/>
    </>
  );
}
