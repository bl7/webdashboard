"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer } from "lucide-react"

const AnalyticsDashboard: React.FC = () => {
  const [labelsPrintedThisMonth, setLabelsPrintedThisMonth] = useState<number>(0)

  // Simulate fetching data from an API
  useEffect(() => {
    // In real-world usage, fetch this from your API or backend
    const fetchPrintedLabels = async () => {
      // Example placeholder value
      const printedLabels = 125 // Replace with actual API call later
      setLabelsPrintedThisMonth(printedLabels)
    }

    fetchPrintedLabels()
  }, [])

  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
            <Printer className="h-5 w-5 text-primary" />
            Labels Printed This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-foreground">{labelsPrintedThisMonth}</div>
        </CardContent>
      </Card>
    </section>
  )
}

export default AnalyticsDashboard
