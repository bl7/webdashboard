"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function Bone({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-gray-700/60", className)} />
}

export function AnalyticsSkeleton({ isDarkMode }: { isDarkMode?: boolean }) {
  const cardClass = isDarkMode ? "border-gray-700 bg-gray-800" : ""

  return (
    <div className="space-y-8 p-6 md:p-10">
      <div className="space-y-2">
        <Bone className="h-8 w-64" />
        <Bone className="h-4 w-96 max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className={cardClass}>
            <CardHeader className="pb-2">
              <Bone className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Bone className="h-8 w-20" />
              <Bone className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className={cardClass}>
            <CardHeader>
              <Bone className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Bone className="h-[260px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
