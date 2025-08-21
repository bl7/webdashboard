import { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | InstaLabel",
    default: "Authentication | InstaLabel",
  },
  description:
    "Sign in or register for your InstaLabel account to access our kitchen labeling system.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "https://www.instalabel.co",
  },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
