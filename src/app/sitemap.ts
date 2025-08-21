import { MetadataRoute } from "next"
import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.instalabel.co"
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

  // Add static pages
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
      lastModified: new Date("2024-12-19"),
      changeFrequency,
      priority,
    }
  })

  // Add blog posts
  const blogDir = path.join(process.cwd(), "src/content/blog")
  const files = await fs.readdir(blogDir)

  for (const file of files) {
    if (!file.endsWith(".md")) continue
    const raw = await fs.readFile(path.join(blogDir, file), "utf8")
    const { data } = matter(raw)
    const slug = data.slug || file.replace(/\.md$/, "")

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
      lastModified: new Date("2024-12-19"),
      changeFrequency: "monthly",
      priority: priority,
    })
  }

  return urls
}
