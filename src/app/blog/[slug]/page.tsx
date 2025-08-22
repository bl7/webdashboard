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
import Image from "next/image"
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

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "src/content/blog")
  const files = await fs.readdir(dir)
  console.log("[generateStaticParams] Files in blog dir:", files)
  const slugs = files
    .filter((file) => typeof file === "string" && file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.md$/, ""),
    }))
  console.log("[generateStaticParams] Blog slugs:", slugs)
  return slugs
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const url = `https://www.instalabel.co/blog/${slug}`

  // Use the default Open Graph image as fallback
  const defaultImage = "https://www.instalabel.co/opengraph-image.png"
  const image = post.meta.image ? `https://www.instalabel.co${post.meta.image}` : defaultImage

  return {
    title: post.meta.title,
    description: post.meta.description,
    keywords: [
      "kitchen labeling",
      "food safety",
      "restaurant technology",
      "HACCP compliance",
      "allergen labeling",
      "kitchen management",
      "restaurant best practices",
      post.meta.category.toLowerCase(),
    ],
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      url: `https://www.instalabel.co/blog/${slug}`,
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.meta.title,
        },
      ],
      publishedTime: post.meta.date,
      authors: [post.meta.author],
      section: post.meta.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
      images: [image],
    },
    alternates: {
      canonical: `https://www.instalabel.co/blog/${slug}`,
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
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    headings.push({ text, id, level })
  }
  return headings
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return notFound()
  // Process content and convert H1 tags to H2 to avoid duplicate H1s
  let processedContent = await remark().use(html).process(post.content)
  let contentHtml = processedContent.toString()

  // Convert H1 tags in content to H2 tags to avoid duplicate H1s
  contentHtml = contentHtml.replace(/<h1/g, "<h2").replace(/<\/h1>/g, "</h2>")

  // JSON-LD Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    author: {
      "@type": "Person",
      name: post.meta.author || "InstaLabel Team",
    },
    image: post.meta.image ? `https://www.instalabel.co${post.meta.image}` : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.instalabel.co/blog/${slug}`,
    },
  }

  // Related Articles
  const allPosts = await getAllBlogPostsMeta()
  // Prefer same category, fallback to recent
  let related = allPosts.filter((p) => p.slug !== slug && p.category === post.meta.category)
  if (related.length < 2) {
    related = allPosts.filter((p) => p.slug !== slug)
  }
  related = related.slice(0, 3)

  // Find next/previous posts by date
  const currentIndex = allPosts.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

  const headings = extractHeadings(post.content)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-12 sm:px-8 md:px-16">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-xl border border-gray-200 bg-white p-4 shadow-lg md:flex-row md:p-8">
          {/* Related Articles Sidebar */}
          {related.length > 0 && (
            <aside className="w-full md:sticky md:top-8 md:w-1/3">
              <div className="mb-6">
                <h3 className="mb-6 text-2xl font-bold text-gray-900">Related Articles</h3>
                <div className="flex flex-col gap-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="block rounded-lg border border-gray-200 bg-purple-50 p-3 shadow-sm transition hover:bg-purple-100"
                    >
                      <div className="mb-1 text-xs font-medium text-primary">{r.category}</div>
                      <div className="mb-1 line-clamp-2 font-semibold text-gray-900">{r.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(r.date).toLocaleDateString()} • {r.readTime}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          )}
          {/* Main Blog Content */}
          <main className="min-w-0 flex-1">
            {/* Breadcrumbs */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                  <Link href="/" className="font-medium text-primary hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="mx-1 inline h-4 w-4 text-gray-400" />
                </li>
                <li>
                  <Link href="/blog" className="font-medium text-primary hover:underline">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="mx-1 inline h-4 w-4 text-gray-400" />
                </li>
                <li className="truncate font-semibold text-gray-700" aria-current="page">
                  {post.meta.title}
                </li>
              </ol>
            </nav>

            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1 font-medium text-primary">
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
            <h1 className="mb-4 text-2xl font-bold leading-snug text-gray-900">
              {post.meta.title}
            </h1>
            {post.meta.image && (
              <Image
                src={post.meta.image}
                alt={post.meta.title}
                width={1200}
                height={630}
                className="mb-6 max-h-56 w-full rounded-lg border object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            )}
            <article
              className="prose prose-base max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
            {/* Next/Previous Navigation */}
            {(prevPost || nextPost) && (
              <div className="mt-16 flex items-center justify-between gap-4">
                {prevPost ? (
                  <Link
                    href={`/blog/${prevPost.slug}`}
                    className="group block flex-1 rounded-lg border border-gray-200 bg-purple-50 p-4 text-left shadow-sm transition hover:bg-purple-100"
                  >
                    <div className="mb-1 text-xs font-medium text-primary">Previous</div>
                    <div className="mb-1 line-clamp-2 font-semibold text-gray-900 group-hover:underline">
                      {prevPost.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(prevPost.date).toLocaleDateString()} • {prevPost.readTime}
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
                {nextPost ? (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group block flex-1 rounded-lg border border-gray-200 bg-purple-50 p-4 text-right shadow-sm transition hover:bg-purple-100"
                  >
                    <div className="mb-1 text-xs font-medium text-primary">Next</div>
                    <div className="mb-1 line-clamp-2 font-semibold text-gray-900 group-hover:underline">
                      {nextPost.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(nextPost.date).toLocaleDateString()} • {nextPost.readTime}
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            )}
            {/* Author Bio Box */}
            <div className="mt-16 flex items-center gap-4 rounded-lg border border-gray-200 bg-purple-50 p-4">
              <Image
                src={post.meta.author === "InstaLabel Team" ? "/avatar1.png" : "/avatar2.png"}
                alt={post.meta.author}
                width={1024}
                height={1024}
                className="h-14 w-14 rounded-full border object-cover"
                sizes="56px"
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
              <Link href="/blog" className="text-xs text-purple-500 hover:underline">
                ← Back to Blog
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
