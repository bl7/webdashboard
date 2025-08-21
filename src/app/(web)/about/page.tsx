import { About } from "@/components/blocks"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "About InstaLabel | Kitchen Labeling Innovation & Food Safety Technology",
  description:
    "Learn about InstaLabel's mission to revolutionize kitchen labeling. Founded by food industry experts, we provide smart labeling solutions for restaurants, cafes, and food businesses worldwide.",
  keywords: [
    "about InstaLabel",
    "kitchen labeling innovation",
    "food safety technology",
    "restaurant labeling company",
    "kitchen management software",
    "food industry technology",
    "restaurant automation",
    "kitchen efficiency solutions",
    "food safety compliance",
    "restaurant technology company",
    "kitchen labeling experts",
    "food service innovation",
    "restaurant management software",
    "kitchen workflow automation",
    "food labeling technology",
  ],
  openGraph: {
    title: "About InstaLabel | Kitchen Labeling Innovation & Food Safety Technology",
    description:
      "Learn about InstaLabel's mission to revolutionize kitchen labeling. Founded by food industry experts, we provide smart labeling solutions for restaurants, cafes, and food businesses worldwide.",
    url: "https://www.instalabel.co/about",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "About InstaLabel - Kitchen Labeling Innovation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About InstaLabel | Kitchen Labeling Innovation & Food Safety Technology",
    description:
      "Learn about InstaLabel's mission to revolutionize kitchen labeling. Founded by food industry experts, we provide smart labeling solutions for restaurants, cafes, and food businesses worldwide.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/about",
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

const Page = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "About InstaLabel",
    description:
      "Learn about InstaLabel's mission to revolutionize kitchen labeling. Founded by food industry experts, we provide smart labeling solutions for restaurants, cafes, and food businesses worldwide.",
    url: "https://www.instalabel.co/about",
    mainEntity: {
      "@type": "Organization",
      name: "InstaLabel",
      description: "Kitchen labeling innovation company",
      url: "https://www.instalabel.co",
      foundingDate: "2023",
      industry: "Food Service Technology",
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
          name: "About",
          item: "https://www.instalabel.co/about",
        },
      ],
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <About />
    </>
  )
}

export default Page
