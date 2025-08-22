"use client"

import { useEffect } from "react"

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVitals = () => {
      if (typeof window !== "undefined" && "PerformanceObserver" in window) {
        // Track Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            const lcp = lastEntry.startTime
            // Send to analytics
            if (window.gtag) {
              window.gtag("event", "web_vitals", {
                event_category: "Web Vitals",
                event_label: "LCP",
                value: Math.round(lcp),
                non_interaction: true,
              })
            }
          }
        })
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })

        // Track First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            const fidEntry = entry as PerformanceEventTiming
            const fid = fidEntry.processingStart - fidEntry.startTime
            if (window.gtag) {
              window.gtag("event", "web_vitals", {
                event_category: "Web Vitals",
                event_label: "FID",
                value: Math.round(fid),
                non_interaction: true,
              })
            }
          })
        })
        fidObserver.observe({ entryTypes: ["first-input"] })

        // Track Cumulative Layout Shift (CLS)
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
        })
        clsObserver.observe({ entryTypes: ["layout-shift"] })

        // Report CLS when page is hidden
        const reportCLS = () => {
          if (clsValue > 0) {
            if (window.gtag) {
              window.gtag("event", "web_vitals", {
                event_category: "Web Vitals",
                event_label: "CLS",
                value: Math.round(clsValue * 1000) / 1000,
                non_interaction: true,
              })
            }
          }
        }

        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") {
            reportCLS()
          }
        })

        // Track First Contentful Paint (FCP)
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const firstEntry = entries[0]
          if (firstEntry) {
            const fcp = firstEntry.startTime
            if (window.gtag) {
              window.gtag("event", "web_vitals", {
                event_category: "Web Vitals",
                event_label: "FCP",
                value: Math.round(fcp),
                non_interaction: true,
              })
            }
          }
        })
        fcpObserver.observe({ entryTypes: ["first-contentful-paint"] })

        // Track Time to First Byte (TTFB)
        const navigationObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (entry.entryType === "navigation") {
              const ttfb = entry.responseStart - entry.requestStart
              if (window.gtag) {
                window.gtag("event", "web_vitals", {
                  event_category: "Web Vitals",
                  event_label: "TTFB",
                  value: Math.round(ttfb),
                  non_interaction: true,
                })
              }
            }
          })
        })
        navigationObserver.observe({ entryTypes: ["navigation"] })
      }
    }

    // Track resource loading performance
    const trackResourcePerformance = () => {
      if (typeof window !== "undefined" && "PerformanceObserver" in window) {
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (
              entry.initiatorType === "img" ||
              entry.initiatorType === "script" ||
              entry.initiatorType === "css"
            ) {
              const loadTime = entry.responseEnd - entry.fetchStart
              if (window.gtag) {
                window.gtag("event", "resource_timing", {
                  event_category: "Performance",
                  event_label: entry.initiatorType,
                  value: Math.round(loadTime),
                  non_interaction: true,
                })
              }
            }
          })
        })
        resourceObserver.observe({ entryTypes: ["resource"] })
      }
    }

    // Track memory usage
    const trackMemoryUsage = () => {
      if (typeof window !== "undefined" && "memory" in performance) {
        const memory = (performance as any).memory
        if (window.gtag) {
          window.gtag("event", "memory_usage", {
            event_category: "Performance",
            event_label: "Memory",
            value: Math.round(memory.usedJSHeapSize / 1024 / 1024), // Convert to MB
            non_interaction: true,
          })
        }
      }
    }

    // Initialize performance monitoring
    trackWebVitals()
    trackResourcePerformance()

    // Track memory usage every 30 seconds
    const memoryInterval = setInterval(trackMemoryUsage, 30000)

    // Cleanup
    return () => {
      clearInterval(memoryInterval)
    }
  }, [])

  return null
}
