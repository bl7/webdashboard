import type { Metadata } from "next"
import { DefrostLabelsPage } from "@/components/blocks/defrost-labels/defrost-labels"

export const metadata: Metadata = {
  title: "Defrost Labels | Frozen Food Defrost Tracking Labels | InstaLabel",
  description:
    "Track defrost dates, times, and responsible staff to keep frozen food compliant and safe. HACCP freezer labels for food safety.",
  keywords: [
    "defrost labels",
    "frozen food defrost tracking labels",
    "HACCP freezer labels",
    "defrost tracking",
    "frozen food labels",
    "freezer management",
    "defrost date tracking",
    "frozen food safety",
    "defrost compliance",
    "freezer labels",
    "frozen food management",
    "defrost time tracking",
    "food safety labels",
    "HACCP compliance labels",
    "defrost monitoring",
    "frozen food tracking",
    "kitchen labeling software",
    "best defrost label software",
    "instalabel software",
  ],
  authors: [{ name: "InstaLabel Team" }],
  creator: "InstaLabel",
  publisher: "InstaLabel",
  robots: "index, follow",
  category: "Food Service Technology",

  alternates: {
    canonical: "https://www.instalabel.co/defrost-labels",
  },
  openGraph: {
    title: "Defrost Labels | Frozen Food Defrost Tracking Labels",
    description:
      "Track defrost dates, times, and responsible staff to keep frozen food compliant and safe. HACCP freezer labels for food safety.",
    url: "https://www.instalabel.co/defrost-labels",
    siteName: "InstaLabel",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Defrost Labels - Frozen Food Defrost Tracking Labels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Defrost Labels | Frozen Food Defrost Tracking Labels",
    description:
      "Track defrost dates, times, and responsible staff to keep frozen food compliant and safe. HACCP freezer labels for food safety.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16" },
      { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo_sm.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export default function DefrostLabels() {
  return <DefrostLabelsPage />
}
