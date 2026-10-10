import type { Metadata } from "next"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: { absolute: "Page not found | InstaLabel" },
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center space-y-4 text-center">
        <p className="text-sm font-semibold text-gray-500">404</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          This address is not on the InstaLabel site. It may have moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="default">
            <a href="/">Back to the homepage</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/guides">Browse the guides</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
