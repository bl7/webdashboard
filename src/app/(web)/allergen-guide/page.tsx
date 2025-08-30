import { AllergenGuidePage } from "@/components/blocks/allergen-guide"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "The Complete UK Allergen Guide (with Free Quiz) | Natasha's Law",
  description:
    "Complete UK 14 allergens guide with interactive quiz, HACCP compliance tips, and detailed allergen information. Test your knowledge and download training materials. Essential for Natasha's Law compliance.",
  keywords: [
    "UK 14 allergens",
    "allergen guide",
    "allergen quiz",
    "Natasha's Law allergens",
    "food allergens list",
    "allergen compliance guide",
    "HACCP compliance",
    "allergen training quiz",
    "hidden allergens",
    "cross contamination allergens",
    "kitchen allergen reference",
    "restaurant allergen guide",
    "cafe allergen compliance",
    "pub allergen requirements",
    "takeaway allergen guide",
    "catering allergen compliance",
    "EHO allergen requirements",
    "allergen labeling guide",
    "food safety allergens",
    "allergen ingredients list",
    "allergen sources guide",
    "kitchen allergen poster",
    "allergen reference card",
    "allergen training materials",
    "staff allergen training",
    "allergen compliance quiz",
  ],
  openGraph: {
    title: "The Complete UK Allergen Guide (with Free Quiz) | Natasha's Law",
    description:
      "Complete UK 14 allergens guide with interactive quiz, HACCP compliance tips, and detailed allergen information. Test your knowledge and download training materials.",
    url: "https://www.instalabel.co/allergen-guide",
    type: "article",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "UK Allergen Guide with Interactive Quiz - Complete Reference",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Complete UK Allergen Guide (with Free Quiz) | Natasha's Law",
    description:
      "Complete UK 14 allergens guide with interactive quiz, HACCP compliance tips, and detailed allergen information. Test your knowledge and download training materials.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/allergen-guide",
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
    name: "The Complete UK Allergen Guide (with Free Quiz) | Natasha's Law | InstaLabel",
    description:
      "Complete UK 14 allergens guide with interactive quiz, HACCP compliance tips, and detailed allergen information. Test your knowledge and download training materials.",
    url: "https://www.instalabel.co/allergen-guide",
    mainEntity: {
      "@type": "EducationalResource",
      name: "UK Allergen Guide with Interactive Quiz",
      description:
        "Complete allergen guide with interactive quiz, HACCP compliance tips, and training materials for UK food businesses",
      educationalLevel: "Professional",
      learningResourceType: "Quiz",
      teaches: "Allergen Compliance",
      inLanguage: "en-GB",
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
          name: "Allergen Guide",
          item: "https://www.instalabel.co/allergen-guide",
        },
      ],
    },
    faq: {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What are the 14 allergens under UK law?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The 14 allergens that must be declared in the UK are: 1. Celery, 2. Cereals containing gluten, 3. Crustaceans, 4. Eggs, 5. Fish, 6. Lupin, 7. Milk, 8. Molluscs, 9. Mustard, 10. Nuts, 11. Peanuts, 12. Sesame seeds, 13. Soya, 14. Sulphur dioxide/sulphites. These must be clearly highlighted on all food labels and menus.",
          },
        },
        {
          "@type": "Question",
          name: "What is Natasha's Law?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Natasha's Law requires all food businesses to provide full ingredient lists and allergen information on pre-packed for direct sale (PPDS) foods. This law came into effect in October 2021 and affects all UK food businesses, requiring clear allergen labeling on all food items that are pre-packed for direct sale.",
          },
        },
        {
          "@type": "Question",
          name: "How can restaurants stay compliant with HACCP?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "To stay HACCP compliant, restaurants should: 1. Identify all allergen hazards in their kitchen, 2. Establish critical control points for allergen management, 3. Set up monitoring procedures, 4. Train all staff on allergen awareness, 5. Keep detailed records of allergen information, 6. Have procedures to prevent cross-contamination, 7. Regularly review and update allergen procedures.",
          },
        },
        {
          "@type": "Question",
          name: "What are the penalties for allergen non-compliance?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Penalties for allergen non-compliance can include unlimited fines and potential imprisonment. The severity depends on the nature of the violation and whether it resulted in harm to customers. Environmental Health Officers (EHOs) can also issue improvement notices, prohibition orders, or prosecute businesses that fail to comply with allergen regulations.",
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
      <AllergenGuidePage />
    </>
  )
}

export default Page
