import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import React from "react"
import FloatingParticles from "@/app/boss/login/FloatingParticles"

export default function AuthLayout({ children }: { children: Readonly<React.ReactNode> }) {
  return (
    <ScrollArea>
      <main className="flex min-h-screen relative w-screen items-center justify-center bg-primary">
        <FloatingParticles />
        <div className="absolute top-4 left-4 z-10">
          <Link href="/" className="text-white group flex items-center gap-2">
            <ChevronLeft className="size-4"/>
            <p className="group-hover:underline">
              Back to Home
            </p>
          </Link>
        </div>
        <div className="relative z-10 h-full w-full max-w-md rounded-lg bg-white/90 px-4 shadow-2xl md:px-8 flex flex-col justify-center">
          {children}
        </div>
      </main>
      <ScrollBar />
    </ScrollArea>
  )
}
