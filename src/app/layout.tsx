import type { Metadata } from "next"
import { Manrope, Oxygen } from "next/font/google"
import "./globals.css"
import og from "./opengraph-image.png"
import { Toaster } from "sonner"
import { AuthProvider } from "@/context/AuthContext"
import Head from "next/head"
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer"
import { Analytics } from "@/components/Analytics"
import { PerformanceMonitor } from "@/components/PerformanceMonitor"

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
    default: "InstaLabel - Smart Kitchen Labeling System | Food Safety Labels & Expiry Tracking",
    template: "%s | InstaLabel - Professional Kitchen Labeling",
  },
  metadataBase: new URL("https://www.instalabel.co/"),
  description:
    "InstaLabel: Professional kitchen labeling system for restaurants, cafes, and food businesses. Print food safety labels, allergen warnings, expiry dates, and prep labels instantly. Thermal printer compatible, HACCP compliant, and easy to use. Start free trial today.",
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
        url: "/logo_sm.png",
        href: "/logo_sm.png",
      },
    ],
    apple: "/logo_sm.png",
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
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free trial available",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "150",
    },
    provider: {
      "@type": "Organization",
      name: "InstaLabel",
      url: "https://www.instalabel.co",
    },
  }

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "InstaLabel",
    description: "Professional kitchen labeling system for restaurants and food businesses",
    url: "https://www.instalabel.co",
    telephone: "+44-20-1234-5678",
    email: "hello@instalabel.co",
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
      addressLocality: "London",
      addressRegion: "England",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "51.5074",
      longitude: "-0.1278",
    },
    openingHours: "Mo-Fr 09:00-17:00",
    priceRange: "££",
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    serviceArea: {
      "@type": "Country",
      name: "United Kingdom",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Kitchen Labeling Solutions",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Kitchen Labeling System",
            description: "Professional kitchen labeling system for restaurants",
          },
        },
      ],
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>Smart Kitchen Labeling System | Cloud-Based Food Safety Labels | InstaLabel</title>
        <meta
          name="description"
          content="Next-generation kitchen labeling system with cloud management, multi-location sync, and smart inventory tracking. More advanced than traditional label printers. Free trial."
        />
        <meta
          name="keywords"
          content="smart kitchen labeling system, cloud food labeling, multi-location kitchen management, advanced food safety labels, digital kitchen labeling, restaurant tech solutions"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </Head>
      <body className={`${base_font.className} ${accent_font.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
        />
        <PerformanceOptimizer />
        <Analytics />
        <PerformanceMonitor />
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
