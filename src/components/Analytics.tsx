"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const Analytics = () => {
  const pathname = usePathname()

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pathname,
        page_title: document.title,
        page_location: window.location.href
      })
    }

    // Track custom events
    const trackEvent = (eventName: string, parameters: object = {}) => {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, {
          event_category: 'engagement',
          event_label: pathname,
          ...parameters
        })
      }
    }

    // Track form submissions
    const trackFormSubmission = (formId: string) => {
      trackEvent('form_submit', {
        form_id: formId,
        form_name: formId
      })
    }

    // Track button clicks
    const trackButtonClick = (buttonId: string, buttonText: string) => {
      trackEvent('button_click', {
        button_id: buttonId,
        button_text: buttonText
      })
    }

    // Track downloads
    const trackDownload = (fileName: string) => {
      trackEvent('file_download', {
        file_name: fileName,
        file_type: 'pdf'
      })
    }

    // Track demo bookings
    const trackDemoBooking = () => {
      trackEvent('demo_booking', {
        source: pathname
      })
    }

    // Track trial signups
    const trackTrialSignup = () => {
      trackEvent('trial_signup', {
        source: pathname
      })
    }

    // Add event listeners for tracking
    const addTrackingListeners = () => {
      // Form submissions
      document.addEventListener('submit', (e) => {
        const form = e.target as HTMLFormElement
        if (form.id) {
          trackFormSubmission(form.id)
        }
      })

      // Button clicks
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        if (target.tagName === 'BUTTON' || target.closest('button')) {
          const button = target.tagName === 'BUTTON' ? target : target.closest('button') as HTMLButtonElement
          if (button) {
            trackButtonClick(button.id || 'unknown', button.textContent || 'unknown')
          }
        }
      })

      // Download links
      document.addEventListener('click', (e) => {
        const target = e.target as HTMLElement
        const link = target.closest('a') as HTMLAnchorElement
        if (link && link.download) {
          trackDownload(link.download)
        }
      })
    }

    // Initialize tracking
    addTrackingListeners()

    // Track specific page events
    if (pathname === '/allergen-compliance') {
      trackEvent('page_view', {
        page_type: 'lead_generation',
        content_type: 'allergen_compliance'
      })
    }

    if (pathname === '/allergen-guide') {
      trackEvent('page_view', {
        page_type: 'content',
        content_type: 'allergen_guide'
      })
    }

    if (pathname === '/plan') {
      trackEvent('page_view', {
        page_type: 'pricing',
        content_type: 'pricing_page'
      })
    }

    if (pathname === '/bookdemo') {
      trackEvent('page_view', {
        page_type: 'conversion',
        content_type: 'demo_booking'
      })
    }

    // Track scroll depth
    let maxScroll = 0
    const trackScrollDepth = () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        if (maxScroll >= 25 && maxScroll < 50) {
          trackEvent('scroll_depth', { depth: '25%' })
        } else if (maxScroll >= 50 && maxScroll < 75) {
          trackEvent('scroll_depth', { depth: '50%' })
        } else if (maxScroll >= 75 && maxScroll < 100) {
          trackEvent('scroll_depth', { depth: '75%' })
        } else if (maxScroll >= 100) {
          trackEvent('scroll_depth', { depth: '100%' })
        }
      }
    }

    window.addEventListener('scroll', trackScrollDepth)

    // Track time on page
    let startTime = Date.now()
    const trackTimeOnPage = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      if (timeOnPage >= 30 && timeOnPage < 60) {
        trackEvent('time_on_page', { duration: '30s' })
      } else if (timeOnPage >= 60 && timeOnPage < 120) {
        trackEvent('time_on_page', { duration: '1m' })
      } else if (timeOnPage >= 120) {
        trackEvent('time_on_page', { duration: '2m+' })
      }
    }

    const timeInterval = setInterval(trackTimeOnPage, 30000)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', trackScrollDepth)
      clearInterval(timeInterval)
    }
  }, [pathname])

  return null
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
} 