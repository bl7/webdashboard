'use client'

import { useMemo } from 'react'
import { formatEmailBody, renderInstaLabelEmail } from '@/lib/instalabel-email'

type EmailPreviewProps = {
  subject: string
  body: string
  recipientName?: string
  className?: string
}

export function EmailPreview({ subject, body, recipientName, className }: EmailPreviewProps) {
  const html = useMemo(() => {
    if (!body.trim()) return ''
    return renderInstaLabelEmail({
      subject: subject.trim() || 'Email preview',
      recipientName: recipientName || '',
      bodyHtml: formatEmailBody(body),
    })
  }, [subject, body, recipientName])

  if (!html) {
    return (
      <div className={`flex items-center justify-center rounded border border-dashed bg-muted/30 py-12 text-sm text-muted-foreground ${className || ''}`}>
        Start typing the body to see a preview
      </div>
    )
  }

  return (
    <iframe
      title="Email preview"
      srcDoc={html}
      className={`w-full rounded border bg-white ${className || ''}`}
      style={{ height: 480 }}
      sandbox=""
    />
  )
}
