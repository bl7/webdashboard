import { SupportLayout } from "@/components/blocks/legal/layout"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | InstaLabel Kitchen Labeling System",
    default: "Legal | InstaLabel Kitchen Labeling System",
  },
  description:
    "Legal information for InstaLabel kitchen labeling system including terms, privacy policy, cookie policy, and FAQs.",
  openGraph: {
    title: "Legal | InstaLabel Kitchen Labeling System",
    description: "Legal information for InstaLabel kitchen labeling system.",
    url: "https://instalabel.co",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "InstaLabel Legal Information",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Legal | InstaLabel Kitchen Labeling System",
    description: "Legal information for InstaLabel kitchen labeling system.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <SupportLayout>{children}</SupportLayout>
}
