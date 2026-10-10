import type { Metadata } from "next"
import { Manrope, Oxygen } from "next/font/google"
import "./globals.css"
import og from "./opengraph-image.png"
import { Toaster } from "sonner"
import { AuthProvider } from "@/context/AuthContext"
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer"
import { Analytics } from "@/components/Analytics"
import { PerformanceMonitor } from "@/components/PerformanceMonitor"
import { CampaignCodeCapture } from "@/components/CampaignCodeCapture"

const base_font = Manrope({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

const accent_font = Oxygen({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-accent",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  title: {
    default: "Kitchen Labelling Software for UK Food Businesses | InstaLabel",
    template: "%s | InstaLabel",
  },
  metadataBase: new URL("https://www.instalabel.co/"),
  description:
    "InstaLabel is kitchen labelling software for food businesses. Staff print prep, date and PPDS labels from saved ingredient information. The software does not guarantee compliance.",
  keywords: [
    "kitchen labelling software",
    "food labelling software UK",
    "restaurant kitchen labels",
  ],
  authors: [{ name: "InstaLabel Team" }],
  creator: "InstaLabel",
  publisher: "InstaLabel",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/logo_sm.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://www.instalabel.co/",
    title: "InstaLabel - Smart Kitchen Labeling System | Food Safety & Expiry Tracking",
    description:
      "Professional kitchen labeling system for restaurants and food businesses. Print food safety labels, allergen warnings, and expiry dates instantly. Thermal printer compatible and HACCP compliant.",
    siteName: "InstaLabel",
    images: [
      {
        url: og.src,
        width: 1200,
        height: 630,
        alt: "InstaLabel - Smart Kitchen Labeling System",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaLabel - Smart Kitchen Labeling System",
    description:
      "Professional kitchen labeling system for restaurants and food businesses. Print food safety labels, allergen warnings, and expiry dates instantly.",
    images: [og.src],
    creator: "@instalabel",
  },
  alternates: {
    canonical: "https://www.instalabel.co",
  },
  category: "Food Service Technology",
  other: {
    sitemap: "/sitemap.xml",
    "google-site-verification": "njHVl6pfnji-AMsQsDOr1R72Rn2U-fvzt9_fas2XjtI",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "InstaLabel",
    description:
      "Professional kitchen labeling system for restaurants and food businesses. Print food safety labels, allergen warnings, and expiry dates instantly.",
    url: "https://www.instalabel.co",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    provider: {
      "@type": "Organization",
      name: "InstaLabel",
      url: "https://www.instalabel.co",
    },
  }

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "InstaLabel",
    description: "Professional kitchen labelling system for restaurants and food businesses",
    url: "https://www.instalabel.co",
    telephone: "+447845447586",
    email: "contact@instalabel.co",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
      addressLocality: "Bournemouth",
      addressRegion: "England",
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    serviceArea: {
      "@type": "Country",
      name: "United Kingdom",
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${base_font.className} ${accent_font.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
        />
        <CampaignCodeCapture />
        <PerformanceOptimizer />
        <Analytics />
        <PerformanceMonitor />
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
