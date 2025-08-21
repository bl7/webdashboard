import React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui"
import { ArrowRight, CheckCircle, Zap, Shield, RefreshCw } from "lucide-react"

export const metadata: Metadata = {
  title: "Square Integration | Menu Sync",
  description:
    "Connect InstaLabel with Square POS for automatic menu synchronization, smart allergen detection, and bidirectional data flow. Keep your kitchen labels always up-to-date with your Square menu.",
  keywords: [
    "Square integration",
    "Square POS integration",
    "menu synchronization",
    "allergen detection",
    "restaurant POS integration",
    "kitchen labeling Square",
    "automatic menu sync",
    "Square menu labels",
    "restaurant technology integration",
    "POS system integration",
    "kitchen automation Square",
    "food safety Square integration",
    "allergen compliance Square",
    "restaurant management integration",
  ],
  openGraph: {
    title: "Square Integration | Menu Sync",
    description:
      "Connect InstaLabel with Square POS for automatic menu synchronization, smart allergen detection, and bidirectional data flow.",
    url: "https://www.instalabel.co/square-integration",
    type: "website",
    images: [
      {
        url: "https://www.instalabel.co/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Square Integration - Menu Sync & Allergen Detection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Square Integration | Seamless Menu Sync & Allergen Detection",
    description:
      "Connect InstaLabel with Square POS for automatic menu synchronization and smart allergen detection.",
    images: ["https://www.instalabel.co/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.instalabel.co/square-integration",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const Page = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Square Integration",
    description:
      "Connect InstaLabel with Square POS for automatic menu synchronization, smart allergen detection, and bidirectional data flow.",
    url: "https://www.instalabel.co/square-integration",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "InstaLabel Square Integration",
      description:
        "Seamless integration between InstaLabel and Square POS for menu synchronization",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Included with InstaLabel subscription",
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

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
              <Zap className="mr-2 h-4 w-4" />
              Seamless Integration
            </div>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Square Integration
              </span>
              <br />
              <span className="text-gray-900">That Just Works</span>
            </h1>
            <p className="text-xl leading-relaxed text-gray-700">
              Connect your Square POS with InstaLabel. Get automatic menu sync. Smart allergen
              detection. Two-way data flow. Keep your kitchen labels always up-to-date with your
              Square menu.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-green-600" />
                <div>
                  <div className="font-semibold text-gray-900">Automatic Menu Sync</div>
                  <div className="text-sm text-gray-600">
                    Menu changes in Square instantly update your labels
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="mt-1 h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-semibold text-gray-900">Smart Allergen Detection</div>
                  <div className="text-sm text-gray-600">
                    AI finds allergens in your ingredients
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw className="mt-1 h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-semibold text-gray-900">Bidirectional Flow</div>
                  <div className="text-sm text-gray-600">Safe mode prevents data conflicts</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="mt-1 h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-semibold text-gray-900">Real-time Updates</div>
                  <div className="text-sm text-gray-600">
                    Changes sync instantly across all devices
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6 md:justify-start">
              <Link href="/bookdemo">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
                >
                  Book Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-purple-200 font-semibold text-purple-700 transition-all duration-300 hover:border-purple-600 hover:bg-purple-600 hover:text-white"
                >
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full max-w-lg">
            <div className="relative rounded-2xl bg-white p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-8 rounded-full bg-purple-600"></div>
                  <div className="text-sm font-medium text-gray-600">Square POS</div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 w-3/4 rounded-full bg-purple-600"></div>
                </div>
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-2 text-purple-600">
                    <RefreshCw className="h-6 w-6 animate-spin" />
                    <span className="font-medium">Syncing...</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 w-1/2 rounded-full bg-green-600"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-600">InstaLabel</div>
                  <div className="h-8 w-8 rounded-full bg-green-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How Square Integration Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple setup, powerful results. Connect once and enjoy seamless synchronization.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Connect</h3>
              <p className="mt-2 text-gray-600">
                Give InstaLabel permission to access your Square menu data.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Sync</h3>
              <p className="mt-2 text-gray-600">
                Your menu items sync automatically with allergen detection.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Print</h3>
              <p className="mt-2 text-gray-600">
                Print labels instantly with current menu information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-purple-100 to-pink-100 px-4 py-16 sm:px-6 md:px-12 lg:px-16">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Ready to Connect Your Square POS?
          </h3>
          <p className="mt-4 text-lg text-gray-600">
            Join hundreds of restaurants already using InstaLabel with Square integration.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/bookdemo">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
              >
                Book Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-purple-200 font-semibold text-purple-700 transition-all duration-300 hover:border-purple-600 hover:bg-purple-600 hover:text-white"
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Page
