import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function AuthLayout({ children }: { children: Readonly<React.ReactNode> }) {
  return (
    <ScrollArea>
      <main className="flex min-h-screen relative w-screen items-center justify-center bg-primary/10 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 p-4">
        <div className="absolute top-4 left-4">
          <Link href="/" className="text-primary group flex items-center gap-2">
          <ChevronLeft className="size-4"/>
          <p className="group-hover:underline">
            Back to Home
          </p>
          </Link>
        </div>
        <div className="h-full w-full max-w-md rounded-lg bg-background px-4 shadow-2xl md:px-8">
          {children}
        </div>
      </main>
      <ScrollBar />
    </ScrollArea>
  )
}
