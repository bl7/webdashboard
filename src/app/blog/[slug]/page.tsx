import { notFound } from "next/navigation"
import { Metadata } from "next"
import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import remarkToc from "remark-toc"
import { Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"

interface BlogPostMeta {
  title: string
  description: string
  date: string
  category: string
  readTime: string
  author: string
  slug: string
  featured: boolean
  image?: string
}

interface BlogPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "src/content/blog");
  const files = await fs.readdir(dir);
  console.log("[generateStaticParams] Files in blog dir:", files);
  const slugs = files
    .filter(file => typeof file === "string" && file.endsWith(".md"))
    .map(file => ({
      slug: file.replace(/\.md$/, "")
    }));
  console.log("[generateStaticParams] Blog slugs:", slugs);
  return slugs;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  const url = `https://instalabel.co/blog/${post.meta.slug}`
  const image = post.meta.image ? `https://instalabel.co${post.meta.image}` : undefined
  return {
    title: post.meta.title,
    description: post.meta.description,
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      url,
      type: "article",
      images: image ? [{ url: image, alt: post.meta.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.meta.title,
      description: post.meta.description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: url,
    },
  }
}

async function getPostBySlug(slug: string) {
  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.md`)
  console.log("[getPostBySlug] Reading:", filePath)
  try {
    const raw = await fs.readFile(filePath, "utf8")
    const { data, content } = matter(raw)
    return { meta: data as BlogPostMeta, content }
  } catch (e) {
    console.error("[getPostBySlug] Error reading file:", filePath, e)
    return null
  }
}

async function getAllBlogPostsMeta(): Promise<BlogPostMeta[]> {
  const blogDir = path.join(process.cwd(), "src/content/blog")
  const files = await fs.readdir(blogDir)
  const posts: BlogPostMeta[] = []
  for (const file of files) {
    if (!file.endsWith(".md")) continue
    const raw = await fs.readFile(path.join(blogDir, file), "utf8")
    const { data } = matter(raw)
    posts.push(data as BlogPostMeta)
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1))
  return posts
}

// Helper to extract headings from markdown
function extractHeadings(markdown: string): { text: string; id: string; level: number }[] {
  const headingRegex = /^(#{2,6})\s+(.+)$/gm
  const headings: { text: string; id: string; level: number }[] = []
  let match
  while ((match = headingRegex.exec(markdown))) {
    const level = match[1].length
    const text = match[2].replace(/[#*`~]+/g, "").trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    headings.push({ text, id, level })
  }
  return headings
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post = await getPostBySlug(params.slug)
  if (!post) return notFound()
  const processedContent = await remark().use(html).process(post.content)
  const contentHtml = processedContent.toString()

  // JSON-LD Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.meta.title,
    "description": post.meta.description,
    "datePublished": post.meta.date,
    "author": {
      "@type": "Person",
      "name": post.meta.author || "InstaLabel Team"
    },
    "image": post.meta.image ? `https://instalabel.co${post.meta.image}` : undefined,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://instalabel.co/blog/${post.meta.slug}`
    }
  }

  // Related Articles
  const allPosts = await getAllBlogPostsMeta()
  // Prefer same category, fallback to recent
  let related = allPosts.filter(p => p.slug !== post.meta.slug && p.category === post.meta.category)
  if (related.length < 2) {
    related = allPosts.filter(p => p.slug !== post.meta.slug)
  }
  related = related.slice(0, 3)

  // Find next/previous posts by date
  const currentIndex = allPosts.findIndex(p => p.slug === post.meta.slug)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  const headings = extractHeadings(post.content)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-12 px-4 sm:px-8 md:px-16">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Related Articles Sidebar */}
          {related.length > 0 && (
            <aside className="md:w-1/3 w-full md:sticky md:top-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-3 text-gray-900">Related Articles</h2>
                <div className="flex flex-col gap-3">
                  {related.map(r => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="block rounded-lg border border-gray-200 bg-purple-50 hover:bg-purple-100 transition p-3 shadow-sm">
                      <div className="text-xs text-primary font-medium mb-1">{r.category}</div>
                      <div className="font-semibold text-gray-900 mb-1 line-clamp-2">{r.title}</div>
                      <div className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()} • {r.readTime}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          )}
          {/* Main Blog Content */}
          <main className="flex-1 min-w-0">
            {/* Breadcrumbs */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                  <Link href="/" className="hover:underline text-primary font-medium">Home</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="inline h-4 w-4 mx-1 text-gray-400" />
                </li>
                <li>
                  <Link href="/blog" className="hover:underline text-primary font-medium">Blog</Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="inline h-4 w-4 mx-1 text-gray-400" />
                </li>
                <li className="truncate text-gray-700 font-semibold" aria-current="page">{post.meta.title}</li>
              </ol>
            </nav>
            {/* Table of Contents */}
            {/* TOC hidden for now
          {headings.length > 2 && (
            <nav className="mb-8" aria-label="Table of contents">
              <div className="font-bold text-gray-800 mb-2">Table of Contents</div>
              <ul className="space-y-1 text-sm text-purple-700">
                {headings.map(h => (
                  <li key={h.id} className={h.level > 2 ? "ml-4" : ""}>
                    <a href={`#${h.id}`} className="hover:underline">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          */}
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1 text-primary font-medium">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.meta.date).toLocaleDateString()}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>{post.meta.category}</span>
                <span className="hidden sm:inline">•</span>
                <span>{post.meta.readTime}</span>
              </div>
              <div className="text-xs text-gray-400">By {post.meta.author}</div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-snug">{post.meta.title}</h1>
            {post.meta.image && (
              <img src={post.meta.image} alt={post.meta.title} className="rounded-lg mb-6 w-full max-h-56 object-cover border" />
            )}
            <article className="prose prose-base max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            {/* Next/Previous Navigation */}
            {(prevPost || nextPost) && (
              <div className="flex justify-between items-center mt-16 gap-4">
                {prevPost ? (
                  <Link href={`/blog/${prevPost.slug}`} className="flex-1 group block rounded-lg border border-gray-200 bg-purple-50 hover:bg-purple-100 transition p-4 shadow-sm text-left">
                    <div className="text-xs text-primary font-medium mb-1">Previous</div>
                    <div className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:underline">{prevPost.title}</div>
                    <div className="text-xs text-gray-500">{new Date(prevPost.date).toLocaleDateString()} • {prevPost.readTime}</div>
                  </Link>
                ) : <div className="flex-1" />}
                {nextPost ? (
                  <Link href={`/blog/${nextPost.slug}`} className="flex-1 group block rounded-lg border border-gray-200 bg-purple-50 hover:bg-purple-100 transition p-4 shadow-sm text-right">
                    <div className="text-xs text-primary font-medium mb-1">Next</div>
                    <div className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:underline">{nextPost.title}</div>
                    <div className="text-xs text-gray-500">{new Date(nextPost.date).toLocaleDateString()} • {nextPost.readTime}</div>
                  </Link>
                ) : <div className="flex-1" />}
              </div>
            )}
            {/* Author Bio Box */}
            <div className="mt-16 flex items-center gap-4 bg-purple-50 border border-gray-200 rounded-lg p-4">
              <img
                src={post.meta.author === "InstaLabel Team" ? "/avatar1.png" : "/avatar2.png"}
                alt={post.meta.author}
                className="w-14 h-14 rounded-full border object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900">{post.meta.author}</div>
                <div className="text-sm text-gray-600">
                  {post.meta.author === "InstaLabel Team"
                    ? "Expert tips and insights from the InstaLabel team, dedicated to food safety, kitchen efficiency, and smart labeling."
                    : "Written by a guest contributor."}
                </div>
                {/* Social links could go here if available */}
              </div>
            </div>
            <div className="mt-6">
              <Link href="/blog" className="text-purple-500 hover:underline text-xs">← Back to Blog</Link>
            </div>
          </main>
        </div>
      </div>
    </>
  )
} 