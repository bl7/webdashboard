import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kitchen Labeling Blog | Food Safety Tips & Restaurant Management",
  description: "Expert insights on kitchen labeling, food safety compliance, HACCP implementation, and restaurant management. Stay updated with the latest industry trends and best practices.",
  keywords: [
    "kitchen labeling blog",
    "food safety tips",
    "restaurant management",
    "HACCP compliance",
    "kitchen efficiency",
    "food labeling regulations",
    "restaurant technology",
    "kitchen best practices"
  ],
  openGraph: {
    title: "Kitchen Labeling Blog | Food Safety Tips & Restaurant Management",
    description: "Expert insights on kitchen labeling, food safety compliance, HACCP implementation, and restaurant management.",
    url: "https://instalabel.co/blog",
  },
  alternates: {
    canonical: "https://instalabel.co/blog",
  },
};

export default function Head() {
  // Defensive: ensure all fields are strings
  const title = String(metadata.title ?? "Blog");
  const description = String(metadata.description ?? "");
  let keywords = "";
  if (Array.isArray(metadata.keywords)) {
    keywords = metadata.keywords.join(", ");
  } else if (typeof metadata.keywords === "string") {
    keywords = metadata.keywords;
  }
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href="https://instalabel.co/blog" />
      {/* Add more meta tags as needed */}
    </>
  );
} 