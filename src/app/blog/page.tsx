import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { Calendar, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import featureHeroImg from "@/assets/images/featurehero.png"
import { Metadata } from "next"

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

interface BlogPost {
  meta: BlogPostMeta
  slug: string
}

async function getAllBlogPosts(): Promise<BlogPost[]> {
  const dir = path.join(process.cwd(), "src/content/blog")
  const files = await fs.readdir(dir)
  const posts: BlogPost[] = []
  for (const file of files) {
    if (!file.endsWith(".md")) continue
    const raw = await fs.readFile(path.join(dir, file), "utf8")
    const { data } = matter(raw)
    posts.push({ meta: data as BlogPostMeta, slug: data.slug })
  }
  posts.sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1))
  return posts
}

export const metadata: Metadata = {
  title: "Kitchen Labeling Blog | Food Safety & Compliance",
  description:
    "Expert insights on food safety, kitchen management, and restaurant technology. Stay up to date with the latest trends and best practices for your kitchen and business.",
  keywords: [
    "kitchen labeling blog",
    "food safety articles",
    "restaurant technology",
    "kitchen management",
    "HACCP compliance",
    "allergen labeling",
    "restaurant best practices",
    "kitchen automation",
    "food service technology",
    "kitchen efficiency",
  ],
  openGraph: {
    title: "Kitchen Labeling Blog | Food Safety & Compliance",
    description:
      "Expert insights on food safety, kitchen management, and restaurant technology. Stay up to date with the latest trends and best practices for your kitchen and business.",
    url: "https://www.instalabel.co/blog",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kitchen Labeling Blog - Food Safety & Restaurant Technology",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kitchen Labeling Blog | Food Safety & Compliance",
    description: "Expert insights on food safety, kitchen management, and restaurant technology.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/blog",
  },
}

export default async function BlogPage() {
  const posts = await getAllBlogPosts()
  const featuredPosts = posts.filter((post) => post.meta.featured)
  const regularPosts = posts.filter((post) => !post.meta.featured)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        {/* Background blobs */}
        <div className="absolute left-0 top-0 isolate -z-10 h-80 w-80 scale-125 rounded-full bg-purple-400 opacity-15 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 isolate -z-10 h-96 w-96 rounded-full bg-purple-600 opacity-15 blur-3xl" />
        <div className="absolute left-[40%] top-[30%] isolate -z-10 h-96 w-96 scale-150 rounded-full bg-pink-300 opacity-15 blur-3xl" />

        <div className="container relative z-10 mx-auto flex flex-col-reverse items-center justify-between gap-16 md:flex-row">
          {/* Hero Content */}
          <div className="w-full max-w-2xl space-y-6 text-center md:text-left">
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-800 ring-1 ring-purple-200">
              <Calendar className="mr-2 h-4 w-4" />
              Blog & Insights
            </div>

            <h1 className="font-accent text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              <span className="text-purple-600">Kitchen Labeling</span>
              <br className="hidden md:block" />
              <span className="">Blog & Resources</span>
            </h1>

            <p className="max-w-xl text-base text-gray-600 sm:text-lg md:text-xl">
              Expert insights on food safety, kitchen management, and restaurant technology. Stay up
              to date with the latest trends and best practices for your kitchen and business.
            </p>

            {/* Blog Categories */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 md:justify-start">
              <Button
                variant="outline"
                className="rounded-full px-3 py-1.5 text-xs sm:px-6 sm:py-2 sm:text-base"
              >
                Food Safety
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-3 py-1.5 text-xs sm:px-6 sm:py-2 sm:text-base"
              >
                Technology
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-3 py-1.5 text-xs sm:px-6 sm:py-2 sm:text-base"
              >
                Case Studies
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-3 py-1.5 text-xs sm:px-6 sm:py-2 sm:text-base"
              >
                Best Practices
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mx-auto w-full max-w-xs sm:max-w-md md:max-w-lg">
            <img
              src={featureHeroImg.src}
              alt="Blog Hero"
              className="rounded-xl border border-gray-200 shadow-lg"
              loading="eager"
            />
          </div>
        </div>
        {/* Bottom fade overlay */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 100%)" }}
        />
      </section>

      {/* Featured Posts Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Featured Articles</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <div
                key={post.slug}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6 shadow-lg"
              >
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">{post.meta.category}</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.meta.date).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    <Link href={`/blog/${post.slug}`}>{post.meta.title}</Link>
                  </h3>
                  <p className="mb-4 line-clamp-3 text-gray-600">{post.meta.description}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {post.meta.readTime}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">All Articles</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => (
              <div
                key={post.slug}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-md"
              >
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-primary">{post.meta.category}</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.meta.date).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    <Link href={`/blog/${post.slug}`}>{post.meta.title}</Link>
                  </h3>
                  <p className="mb-4 line-clamp-3 text-gray-600">{post.meta.description}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {post.meta.readTime}
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
