import type { Metadata } from "next"
import { Manrope, Oxygen } from "next/font/google"
import "./globals.css"
import og from "./opengraph-image.png"
import { Toaster } from "sonner"

const base_font = Manrope({ subsets: ["latin"] })
const accent_font = Oxygen({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-accent",
})

export const metadata: Metadata = {
  title: { default: "instaLabel", template: "%s - instaLabel" },
  metadataBase: new URL("https://instalabeldemo.vercel.app/"),
  description: "Streamlined Kitchen Labeling for Food Safety and Expiry Tracking",
  icons: {
    icon: [
      {
        url: "/public/logo_sm.png",
        href: "/logo_sm.png",
      },
    ],
  },
  openGraph: {
    type: "website",
    url: "https://instalabeldemo.vercel.app/",
    title: "instaLabel",
    description: "Streamlined Kitchen Labeling for Food Safety and Expiry Tracking",
    siteName: "instaLabel",
    images: [og.src],
  },
  twitter: {
    title: "instaLabel",
    description: "Streamlined Kitchen Labeling for Food Safety and Expiry Tracking",
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${base_font.className} ${accent_font.variable}`}>
      {children}
      <Toaster />
    </div>
  )
}
