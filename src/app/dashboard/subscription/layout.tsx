import { Suspense } from "react"

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>
}
