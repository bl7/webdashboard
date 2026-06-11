import { Suspense } from "react"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading…</div>}>{children}</Suspense>
}
