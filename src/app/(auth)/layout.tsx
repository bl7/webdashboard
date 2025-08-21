import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import React from "react"
import FloatingParticles from "@/app/boss/login/FloatingParticles"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | InstaLabel",
    default: "Authentication | InstaLabel",
  },
  description:
    "Sign in or register for your InstaLabel account to access our kitchen labeling system.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.instalabel.co",
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea className="h-screen w-full">
      <ScrollBar />
      <main className="relative flex min-h-screen w-screen items-center justify-center bg-primary">
        <FloatingParticles />
        <Link
          href="/"
          className="group absolute left-4 top-4 z-10 flex items-center gap-2 text-white"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <p>Back to Home</p>
        </Link>
        <div className="relative z-10 flex h-full w-full max-w-md flex-col justify-center rounded-lg bg-white/90 px-4 shadow-2xl md:px-8">
          {children}
        </div>
      </main>
    </ScrollArea>
  )
}
