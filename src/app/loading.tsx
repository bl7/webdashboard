import type { Metadata } from "next"
import { Manrope, Oxygen } from "next/font/google"
import "./globals.css"

const base_font = Manrope({ subsets: ["latin"] })
const accent_font = Oxygen({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-accent",
})

export const metadata: Metadata = {
  title: { default: "Loading... | InstaLabel", template: "%s | InstaLabel" },
  metadataBase: new URL("https://www.instalabel.co"),
  description: "Loading InstaLabel — kitchen labelling software",
  robots: {
    index: false,
    follow: false,
  },
}

export default function Loading() {
  return (
    <div
      className={`${base_font.className} ${accent_font.variable} flex min-h-screen items-center justify-center`}
    >
      <div className="text-center">
        <div className="mx-auto mb-4 h-32 w-32 animate-spin rounded-full border-b-2 border-primary"></div>
        <p className="text-xl font-semibold" role="status">
          Loading InstaLabel…
        </p>
        <p className="text-muted-foreground">Please wait while we prepare your experience</p>
      </div>
    </div>
  )
}
