import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Clock } from "lucide-react"

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
}

const blogPosts = [
  {
    id: 1,
    title: "Complete Guide to HACCP Compliance in Restaurant Kitchens",
    description: "Learn everything you need to know about implementing HACCP principles in your restaurant kitchen, including critical control points and monitoring procedures.",
    category: "Food Safety",
    readTime: "8 min read",
    date: "2024-12-19",
    slug: "haccp-compliance-restaurant-kitchens",
    featured: true
  },
  {
    id: 2,
    title: "InstaLabel vs labl.it: Which Kitchen Labeling System is Right for You?",
    description: "Comprehensive comparison of the top kitchen labeling systems. Discover which solution offers the best features, pricing, and value for your restaurant.",
    category: "Product Comparison",
    readTime: "6 min read",
    date: "2024-12-18",
    slug: "instalabel-vs-labli-comparison",
    featured: true
  },
  {
    id: 3,
    title: "10 Essential Food Safety Labels Every Restaurant Needs",
    description: "Discover the critical food safety labels that help prevent foodborne illnesses and ensure compliance with health regulations.",
    category: "Food Safety",
    readTime: "5 min read",
    date: "2024-12-17",
    slug: "essential-food-safety-labels-restaurants",
    featured: false
  },
  {
    id: 4,
    title: "How to Implement Allergen Labeling in Your Kitchen",
    description: "Step-by-step guide to creating an effective allergen labeling system that protects your customers and your business.",
    category: "Allergen Management",
    readTime: "7 min read",
    date: "2024-12-16",
    slug: "implement-allergen-labeling-kitchen",
    featured: false
  },
  {
    id: 5,
    title: "The ROI of Kitchen Automation: Real Restaurant Case Studies",
    description: "See how restaurants are saving time and money with automated kitchen labeling systems. Real numbers from real businesses.",
    category: "Case Studies",
    readTime: "9 min read",
    date: "2024-12-15",
    slug: "roi-kitchen-automation-case-studies",
    featured: false
  },
  {
    id: 6,
    title: "Thermal Printer vs Inkjet: Which is Best for Kitchen Labels?",
    description: "Compare thermal and inkjet printing technologies for kitchen labeling. Find out which option offers the best durability and cost-effectiveness.",
    category: "Technology",
    readTime: "4 min read",
    date: "2024-12-14",
    slug: "thermal-vs-inkjet-kitchen-labels",
    featured: false
  }
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Kitchen Labeling Blog
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">
              Expert insights on food safety, kitchen management, and restaurant technology
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <Button variant="outline" className="rounded-full text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-2">
                Food Safety
              </Button>
              <Button variant="outline" className="rounded-full text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-2">
                Technology
              </Button>
              <Button variant="outline" className="rounded-full text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-2">
                Case Studies
              </Button>
              <Button variant="outline" className="rounded-full text-xs sm:text-base px-3 sm:px-6 py-1.5 sm:py-2">
                Best Practices
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Featured Articles</h2>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <span className="text-xs sm:text-sm font-medium text-primary">{post.category}</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-3 sm:mb-4">
                    {post.description}
                  </CardDescription>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      {post.readTime}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">All Articles</h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <span className="text-xs sm:text-sm font-medium text-primary">{post.category}</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold text-gray-900 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-3 sm:mb-4 line-clamp-3">
                    {post.description}
                  </CardDescription>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      {post.readTime}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
} 