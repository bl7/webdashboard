"use client"

import { NavLink } from "@/components/ui"
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
            <NavLink
              key={item.path}
              href={item.path}
              exact
              className={`text-sm font-medium ${
                pathname === item.path ? "text-mkt-ink" : "text-mkt-steel hover:text-mkt-ink"
              }`}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        {children}
      </div>
    </div>
  )
}
