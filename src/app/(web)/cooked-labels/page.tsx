import { Metadata } from "next"
import { CookedLabelsPage } from "@/components/blocks/cooked-labels"

export const metadata: Metadata = {
  title: "Cooked Labels | Hot Food HACCP Labels | InstaLabel",
  description:
    "Log cooking times, temperatures, and allergens for every batch automatically. Track food safety with hot food HACCP labels.",
  keywords: [
    "cooked food labels",
    "hot food HACCP labels",
    "cook temperature labels",
    "cooked labels",
    "hot food labels",
    "cooking temperature tracking",
    "HACCP compliance labels",
    "food safety labels",
    "cook time tracking",
    "kitchen temperature logs",
    "hot food safety",
    "cooking batch tracking",
    "food service labels",
    "restaurant safety labels",
    "cook temperature monitoring",
    "hot food management",
    "kitchen safety compliance",
    "cooking process labels",
    "food temperature tracking",
    "cook batch labels",
    "kitchen labeling software",
    "best cook label software",
    "instalabel software",
  ],
  authors: [{ name: "InstaLabel Team" }],
  creator: "InstaLabel",
  publisher: "InstaLabel",
  robots: "index, follow",
  alternates: {
    canonical: "https://www.instalabel.co/cooked-labels",
  },
  openGraph: {
    title: "Cooked Labels | Hot Food HACCP Labels",
    description:
      "Log cooking times, temperatures, and allergens for every batch automatically. Track food safety with hot food HACCP labels.",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Cooked Labels - Hot Food HACCP Labels",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cooked Labels | Hot Food HACCP Labels",
    description:
      "Log cooking times, temperatures, and allergens for every batch automatically. Track food safety with hot food HACCP labels.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  category: "Food Service Technology",
  metadataBase: new URL("https://www.instalabel.co"),
}

export default function Page() {
  return <CookedLabelsPage />
}

const schemaData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Cooked Labels",
  description:
    "Log cooking times, temperatures, and allergens for every batch automatically. Track food safety with hot food HACCP labels.",
  url: "https://www.instalabel.co/cooked-labels",
  mainEntity: {
    "@type": "SoftwareApplication",
    name: "InstaLabel Cooked Labels",
    description:
      "Software for creating hot food HACCP labels with cooking times, temperatures, and allergen tracking",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web-based",
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
        name: "Cooked Labels",
        item: "https://www.instalabel.co/cooked-labels",
      },
    ],
  },
}
