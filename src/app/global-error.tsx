'use client'

import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <div className="mx-auto flex max-w-md flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Fatal Application Error</h2>
            <p className="text-sm text-muted-foreground">
              A critical error has occurred. Please try again or contact support.
            </p>
            {error.message && (
              <div className="my-4 rounded border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                {error.message}
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={reset}
                variant="default"
              >
                Try again
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 