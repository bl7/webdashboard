import { MetadataRoute } from "next"
import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.instalabel.co"
  const currentDate = new Date().toISOString()
  
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

  // Add static pages with current date
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
      lastModified: new Date(),
      changeFrequency,
      priority,
    }
  })

  // Add blog posts with actual file modification dates
  const blogDir = path.join(process.cwd(), "src/content/blog")
  const files = await fs.readdir(blogDir)

  for (const file of files) {
    if (!file.endsWith(".md")) continue
    const filePath = path.join(blogDir, file)
    const raw = await fs.readFile(filePath, "utf8")
    const { data } = matter(raw)
    const slug = data.slug || file.replace(/\.md$/, "")

    // Get actual file modification date
    const stats = await fs.stat(filePath)
    const lastModified = stats.mtime

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

// Add custom headers for better caching
export async function GET() {
  const sitemapData = await sitemap()
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapData
  .map(
    (url) => {
      const lastMod = url.lastModified ? new Date(url.lastModified).toISOString() : new Date().toISOString()
      return `  <url>
    <loc>${url.url}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    }
  )
  .join("\n")}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
