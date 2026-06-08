"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BarChart3 } from "lucide-react"

interface ChartCardProps {
  title: string
  description?: string
  isDarkMode?: boolean
  isEmpty?: boolean
  emptyMessage?: string
  children: React.ReactNode
}

export function ChartCard({
  title,
  description,
  isDarkMode,
  isEmpty,
  emptyMessage = "No data available for this period.",
  children,
}: ChartCardProps) {
  return (
    <Card className={cn(isDarkMode && "border-gray-700 bg-gray-800")}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-600/50 text-center">
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
