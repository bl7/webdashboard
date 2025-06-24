import React from "react"

export default function SidebarSkeleton() {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col overflow-y-auto border-r bg-[hsl(var(--primary))] p-4 text-[hsl(var(--primary-foreground))] shadow-xl">
      <div className="mb-6 flex">
        <div className="h-10 w-32 animate-pulse rounded bg-white/20" />
      </div>
      <nav className="flex flex-grow flex-col space-y-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-8 w-full animate-pulse rounded bg-white/10" />
        ))}
      </nav>
      <div className="mb-4 mt-auto">
        <div className="flex items-center gap-3 rounded-lg bg-white/10 p-3 text-sm text-white">
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
          <div className="h-4 w-24 animate-pulse rounded bg-white/20" />
        </div>
      </div>
      <div>
        <div className="h-8 w-full animate-pulse rounded bg-red-400/10" />
      </div>
    </aside>
  )
}
