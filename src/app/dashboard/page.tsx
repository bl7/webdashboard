export default function DashboardPage() {
  return (
    <section className="p-6">
      <h1 className="mb-4 text-3xl font-bold text-primary">Dashboard</h1>
      <p className="mb-8 text-muted-foreground">
        Welcome to your dashboard! Here you’ll find an overview of your projects and stats.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Example cards */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-foreground">Custom Allergens</h2>
          <p className="text-muted-foreground">You have 12 active custom allergens</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-foreground">Ingredients</h2>
          <p className="text-muted-foreground">150 ingredients being used in the restaurant</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-md">
          <h2 className="mb-2 text-xl font-semibold text-foreground">Menu Item</h2>
          <p className="text-muted-foreground">20 menu items </p>
        </div>
      </div>
    </section>
  )
}
