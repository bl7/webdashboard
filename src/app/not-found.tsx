import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center space-y-4 text-center">
        <div className="text-5xl font-bold">404</div>
        <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div>
          <Button asChild variant="default">
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
