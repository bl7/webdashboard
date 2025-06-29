import type { Metadata } from "next"
import { Manrope, Oxygen } from "next/font/google"
import "./globals.css"
import og from "./opengraph-image.png"
import { Toaster } from "sonner"
import { AuthProvider } from "@/context/AuthContext"

const base_font = Manrope({ subsets: ["latin"] })
const accent_font = Oxygen({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-accent",
})

export const metadata: Metadata = {
  title: { 
    default: "InstaLabel - Smart Kitchen Labeling System | Food Safety Labels & Expiry Tracking", 
    template: "%s | InstaLabel - Professional Kitchen Labeling" 
  },
  metadataBase: new URL("https://instalabel.co/"),
  description: "InstaLabel: Professional kitchen labeling system for restaurants, cafes, and food businesses. Print food safety labels, allergen warnings, expiry dates, and prep labels instantly. Thermal printer compatible, HACCP compliant, and easy to use. Start free trial today.",
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
    "restaurant labeling system"
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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
    url: "https://instalabel.co/",
    title: "InstaLabel - Smart Kitchen Labeling System | Food Safety & Expiry Tracking",
    description: "Professional kitchen labeling system for restaurants and food businesses. Print food safety labels, allergen warnings, and expiry dates instantly. Thermal printer compatible and HACCP compliant.",
    siteName: "InstaLabel",
    images: [
      {
        url: og.src,
        width: 1200,
        height: 630,
        alt: "InstaLabel - Smart Kitchen Labeling System",
      }
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaLabel - Smart Kitchen Labeling System",
    description: "Professional kitchen labeling system for restaurants and food businesses. Print food safety labels, allergen warnings, and expiry dates instantly.",
    images: [og.src],
    creator: "@instalabel",
  },
  alternates: {
    canonical: "https://instalabel.co/",
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
    "name": "InstaLabel",
    "description": "Professional kitchen labeling system for restaurants and food businesses. Print food safety labels, allergen warnings, and expiry dates instantly.",
    "url": "https://instalabel.co",
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
    },
    "provider": {
      "@type": "Organization",
      "name": "InstaLabel",
      "url": "https://instalabel.co"
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#7C3AED" />
        <meta name="msapplication-TileColor" content="#7C3AED" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="InstaLabel" />
      </head>
      <body className={`${base_font.className} ${accent_font.variable}`}>
        <AuthProvider> {children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
