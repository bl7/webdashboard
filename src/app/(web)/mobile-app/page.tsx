import { Metadata } from "next"
import { MobileAppPage } from "@/components/blocks/mobile-app/mobile-app"

export const metadata: Metadata = {
  title: "InstaLabel Mobile App – Kitchen Labelling Made Simple",
  description:
    "Download the InstaLabel app to label food, manage allergens, and print compliance labels directly from your smartphone. Save time, stay Natasha's Law compliant.",
  keywords: [
    "instalabel app",
    "kitchen labelling app",
    "food labelling app",
    "allergen label app",
    "natasha's law app",
    "label food for compliance with your phone",
    "print allergen labels from mobile",
    "easy kitchen labelling app for restaurants",
    "mobile app for prep/cook/PPDS labels",
    "print labels from your smartphone",
    "kitchen labeling software",
    "food safety app",
    "thermal printer mobile app",
    "kitchen compliance app",
  ],
  openGraph: {
    title: "InstaLabel Mobile App – Kitchen Labelling Made Simple",
    description:
      "Download the InstaLabel app to label food, manage allergens, and print compliance labels directly from your smartphone. Save time, stay Natasha's Law compliant.",
    url: "https://www.instalabel.co/mobile-app",
    siteName: "InstaLabel",
    images: [
      {
        url: "https://www.instalabel.co/og-mobile-app.jpg",
        width: 1200,
        height: 630,
        alt: "InstaLabel Mobile App - Kitchen Labelling Made Simple",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "InstaLabel Mobile App – Kitchen Labelling Made Simple",
    description:
      "Download the InstaLabel app to label food, manage allergens, and print compliance labels directly from your smartphone. Save time, stay Natasha's Law compliant.",
    images: ["https://www.instalabel.co/og-mobile-app.jpg"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/mobile-app",
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
    name: "InstaLabel Mobile App",
    description:
      "Download the InstaLabel app to label food, manage allergens, and print compliance labels directly from your smartphone.",
    url: "https://www.instalabel.co/mobile-app",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "InstaLabel Mobile App",
      description: "Kitchen labelling app for food safety and compliance",
      applicationCategory: "MobileApplication",
      operatingSystem: "iOS, Android",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
        description: "Free trial available",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "500",
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
          name: "Mobile App",
          item: "https://www.instalabel.co/mobile-app",
        },
      ],
    },
    faq: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Which printers work with the mobile app?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The InstaLabel mobile app supports all USB label printers.",
          },
        },
        {
          "@type": "Question",
          name: "Does it require internet?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, the app works offline. Your data syncs automatically when you're back online.",
          },
        },
        {
          "@type": "Question",
          name: "Is it suitable for large kitchens?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, the InstaLabel mobile app is perfect for kitchens of any size, from small cafes to large restaurant chains.",
          },
        },
        {
          "@type": "Question",
          name: "Can I print labels directly from my phone?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can send labels directly to your USB or Sunmi printer straight from your mobile device—no desktop needed.",
          },
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
      <MobileAppPage />
    </>
  )
}

export default Page
