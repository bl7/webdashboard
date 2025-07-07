import { MetadataRoute } from 'next'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://instalabel.co'
  const staticPages = [
    '',
    '/features',
    '/plan',
    '/about',
    '/uses',
    '/privacy-policy',
    '/terms',
    '/cookie-policy',
    '/faqs',
  ]

  // Add static pages
  const urls: MetadataRoute.Sitemap = staticPages.map((page, i) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: i === 0 ? 'weekly' : 'monthly',
    priority: i === 0 ? 1 : 0.7,
  }))

  // Add blog posts
  const blogDir = path.join(process.cwd(), 'src/content/blog')
  const files = await fs.readdir(blogDir)
  for (const file of files) {
    if (!file.endsWith('.md')) continue
    const raw = await fs.readFile(path.join(blogDir, file), 'utf8')
    const { data } = matter(raw)
    const slug = data.slug || file.replace(/\.md$/, '')
    urls.push({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: data.date ? new Date(data.date) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  }

  return urls
} 