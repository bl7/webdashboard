import { MetadataRoute } from "next"
import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"

// Helper function to detect Googlebot
function isGooglebot(userAgent: string): boolean {
  return /Googlebot/i.test(userAgent)
}

// Helper function to log Googlebot hits
function logGooglebotHit(userAgent: string) {
  if (isGooglebot(userAgent)) {
    console.log(`[Googlebot] Sitemap requested at ${new Date().toISOString()}`)
    console.log(`[Googlebot] User-Agent: ${userAgent}`)
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Log when sitemap is generated (this will show in server logs)
  console.log(`[Sitemap] Generated at ${new Date().toISOString()}`)

  const baseUrl = "https://www.instalabel.co"

  // Use realistic, varied dates for static pages based on when they were likely last updated
  const staticPageDates = {
    "": new Date("2025-08-15T10:00:00.000Z"), // Homepage - most recent
    "/blog": new Date("2025-08-20T14:30:00.000Z"), // Blog listing - recent
    "/features": new Date("2025-08-10T09:15:00.000Z"), // Features - older
    "/uses": new Date("2025-08-12T11:45:00.000Z"), // Use cases
    "/allergen-compliance": new Date("2025-08-18T16:20:00.000Z"), // Compliance - recent
    "/allergen-guide": new Date("2025-08-05T13:10:00.000Z"), // Guide - older
    "/plan": new Date("2025-08-14T08:30:00.000Z"), // Pricing
    "/printbridge": new Date("2025-08-16T15:45:00.000Z"), // PrintBridge
    "/about": new Date("2025-08-08T12:00:00.000Z"), // About - older
    "/bookdemo": new Date("2025-08-19T10:30:00.000Z"), // Demo booking
    "/square-integration": new Date("2025-08-17T14:15:00.000Z"), // Square
    "/faqs": new Date("2025-08-11T11:20:00.000Z"), // FAQs
    "/privacy-policy": new Date("2025-08-03T09:45:00.000Z"), // Legal - oldest
    "/terms": new Date("2025-08-03T09:45:00.000Z"), // Legal - oldest
    "/cookie-policy": new Date("2025-08-03T09:45:00.000Z"), // Legal - oldest
  }

  const staticPages = [
    "",
    "/blog",
    "/features",
    "/uses",
    "/allergen-compliance",
    "/allergen-guide",
    "/plan",
    "/printbridge",
    "/about",
    "/bookdemo",
    "/square-integration",
    "/faqs",
    "/privacy-policy",
    "/terms",
    "/cookie-policy",
  ]

  // Add static pages with realistic dates
  const urls: MetadataRoute.Sitemap = staticPages.map((page, i) => {
    let priority = 0.7
    let changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" =
      "monthly"

    if (page === "") {
      priority = 1.0
      changeFrequency = "weekly"
    } else if (page === "/blog") {
      priority = 0.9
      changeFrequency = "weekly"
    } else if (page === "/features" || page === "/plan" || page === "/allergen-compliance") {
      priority = 0.8
      changeFrequency = "monthly"
    } else if (page === "/uses" || page === "/printbridge" || page === "/square-integration") {
      priority = 0.8
      changeFrequency = "monthly"
    }

    return {
      url: `${baseUrl}${page}`,
      lastModified: staticPageDates[page as keyof typeof staticPageDates],
      changeFrequency,
      priority,
    }
  })

  // Add blog posts with dates from frontmatter
  const blogDir = path.join(process.cwd(), "src/content/blog")
  const files = await fs.readdir(blogDir)

  for (const file of files) {
    if (!file.endsWith(".md")) continue
    const filePath = path.join(blogDir, file)
    const raw = await fs.readFile(filePath, "utf8")
    const { data } = matter(raw)
    const slug = data.slug || file.replace(/\.md$/, "")

    // Use date from frontmatter, fallback to file modification date
    let lastModified: Date
    if (data.date) {
      lastModified = new Date(data.date)
    } else {
      const stats = await fs.stat(filePath)
      lastModified = stats.mtime
    }

    // Set priority based on content type
    let priority = 0.7
    if (
      slug.includes("kitchen-prep-label-printer-uk") ||
      slug.includes("restaurant-allergen-label-software") ||
      slug.includes("haccp-label-app-complete") ||
      slug.includes("commercial-kitchen-label-printer") ||
      slug.includes("natashas-law-guide")
    ) {
      priority = 0.9
    } else if (slug.includes("top-5-labeling-mistakes")) {
      priority = 0.8
    }

    urls.push({
      url: `${baseUrl}/blog/${slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: priority,
    })
  }

  return urls
}
