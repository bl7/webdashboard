"use client"

import { usePathname } from "next/navigation"

const legalItems = [
  { path: "/terms", name: "Terms of service" },
  { path: "/privacy-policy", name: "Privacy policy" },
  { path: "/cookie-policy", name: "Cookie policy" },
]

export function SupportLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  return (
    <div className="bg-mkt-canvas">
      <div className="container mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6 md:px-12 lg:px-16">
        <nav
          aria-label="Legal"
          className="mb-10 flex flex-wrap border-b border-mkt-steel1 pb-4"
          style={{ gap: "1.75rem" }}
        >
          {legalItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`text-sm font-medium ${
                pathname === item.path ? "text-mkt-ink" : "text-mkt-steel hover:text-mkt-ink"
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>
        {children}
      </div>
    </div>
  )
}
