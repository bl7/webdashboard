"use client"

import React from "react"
import * as Tooltip from "@radix-ui/react-tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { KpiTrend, TrendDirection } from "@/types/bossAnalytics"
import { ArrowDownRight, ArrowUpRight, HelpCircle, Minus } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string
  subtitle?: string
  tooltip?: string
  trend?: KpiTrend
  icon: React.ReactNode
  isDarkMode?: boolean
  invertTrend?: boolean
}

function trendColor(direction: TrendDirection, invert = false): string {
  const effective =
    direction === "neutral" ? "neutral" : invert ? (direction === "up" ? "down" : "up") : direction
  if (effective === "up") return "text-emerald-400"
  if (effective === "down") return "text-red-400"
  return "text-gray-400"
}

function TrendIcon({ direction }: { direction: TrendDirection }) {
  if (direction === "up") return <ArrowUpRight className="h-3.5 w-3.5" />
  if (direction === "down") return <ArrowDownRight className="h-3.5 w-3.5" />
  return <Minus className="h-3.5 w-3.5" />
}

export function KpiCard({
  title,
  value,
  subtitle,
  tooltip,
  trend,
  icon,
  isDarkMode,
  invertTrend,
}: KpiCardProps) {
  return (
    <Card className={cn(isDarkMode && "border-gray-700 bg-gray-800")}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </CardTitle>
          {tooltip && (
            <Tooltip.Provider>
              <Tooltip.Root delayDuration={200}>
                <Tooltip.Trigger asChild>
                  <button type="button" className="text-gray-400 hover:text-gray-300">
                    <HelpCircle className="h-3.5 w-3.5" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="top"
                    className="z-50 max-w-xs rounded-md bg-gray-900 px-3 py-2 text-xs text-gray-100 shadow-lg"
                    sideOffset={6}
                  >
                    {tooltip}
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}
        </div>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {value}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <div
            className={cn(
              "mt-2 flex items-center gap-1 text-xs font-medium",
              trendColor(trend.direction, invertTrend)
            )}
          >
            <TrendIcon direction={trend.direction} />
            <span>{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
