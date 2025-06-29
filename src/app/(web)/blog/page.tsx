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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Kitchen Labeling Blog
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Expert insights on food safety, kitchen management, and restaurant technology
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="rounded-full">
                Food Safety
              </Button>
              <Button variant="outline" className="rounded-full">
                Technology
              </Button>
              <Button variant="outline" className="rounded-full">
                Case Studies
              </Button>
              <Button variant="outline" className="rounded-full">
                Best Practices
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-primary">{post.category}</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {post.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-primary">{post.category}</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                    {post.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Kitchen Labeling?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of restaurants using InstaLabel to improve food safety and kitchen efficiency.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/plan">
                Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/features">
                View Features
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 