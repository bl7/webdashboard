"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const RELATED: Record<string, { href: string; label: string }[]> = {
  "/": [
    { href: "/features", label: "Features" },
    { href: "/uses", label: "Label workflows" },
    { href: "/printer-compatibility", label: "Printer compatibility" },
    { href: "/plan", label: "Pricing" },
  ],
  "/features": [
    { href: "/uses", label: "Label workflows" },
    { href: "/allergen-matrix", label: "Allergen matrix" },
    { href: "/cleaning-checklists", label: "Cleaning checklists" },
    { href: "/plan", label: "Pricing" },
  ],
  "/prep-labels": [
    { href: "/expiry-date-labels", label: "Expiry date labels" },
    { href: "/cooked-labels", label: "Cooked food labels" },
    { href: "/printer-compatibility", label: "Printer compatibility" },
    { href: "/guides/food-labelling-checklist", label: "Food labelling checklist" },
  ],
  "/cooked-labels": [
    { href: "/prep-labels", label: "Prep labels" },
    { href: "/expiry-date-labels", label: "Expiry date labels" },
    { href: "/haccp-labels", label: "Labels and procedures" },
  ],
  "/defrost-labels": [
    { href: "/expiry-date-labels", label: "Expiry date labels" },
    { href: "/opened-food-labels", label: "Opened food labels" },
    { href: "/label-sizes", label: "Label sizes" },
  ],
  "/use-first-labels": [
    { href: "/guides/fifo-food-storage", label: "FIFO food storage" },
    { href: "/expiry-date-labels", label: "Expiry date labels" },
    { href: "/prep-labels", label: "Prep labels" },
  ],
  "/expiry-date-labels": [
    { href: "/prep-labels", label: "Prep labels" },
    { href: "/opened-food-labels", label: "Opened food labels" },
    { href: "/guides/use-by-vs-best-before", label: "Use-by and best-before" },
  ],
  "/ingredient-labels": [
    { href: "/allergen-compliance", label: "Allergen labelling" },
    { href: "/allergen-matrix", label: "Allergen matrix" },
    { href: "/csv-import", label: "CSV import" },
    { href: "/natashas-law", label: "PPDS labels" },
  ],
  "/natashas-law": [
    { href: "/guides/ppds-labelling-requirements", label: "PPDS requirements" },
    { href: "/ingredient-labels", label: "Ingredient labels" },
    { href: "/label-sizes", label: "Label sizes" },
  ],
  "/allergen-compliance": [
    { href: "/ingredient-labels", label: "Ingredient labels" },
    { href: "/allergen-matrix", label: "Allergen matrix" },
    { href: "/allergen-guide", label: "The 14 allergens" },
    { href: "/natashas-law", label: "PPDS labels" },
  ],
  "/allergen-guide": [
    { href: "/allergen-compliance", label: "Allergen labelling" },
    { href: "/tools", label: "Free allergen matrix" },
    { href: "/guides/allergen-information-for-restaurants", label: "Restaurant allergen information" },
  ],
  "/allergen-matrix": [
    { href: "/tools", label: "Free allergen matrix" },
    { href: "/ingredient-labels", label: "Ingredient labels" },
    { href: "/allergen-compliance", label: "Allergen labelling" },
  ],
  "/haccp-labels": [
    { href: "/features", label: "Features" },
    { href: "/cleaning-checklists", label: "Cleaning checklists" },
    { href: "/guides/food-labelling-checklist", label: "Food labelling checklist" },
  ],
  "/dissolvable-kitchen-labels": [
    { href: "/guides/food-labelling-checklist", label: "Food labelling checklist" },
    { href: "/label-sizes", label: "Label sizes" },
    { href: "/kitchen-label-printer", label: "Kitchen label printer" },
  ],
  "/label-printer-uk-comparison": [
    { href: "/guides/handwritten-vs-printed-food-labels", label: "Handwritten and printed labels" },
    { href: "/kitchen-label-printer", label: "Kitchen label printer" },
    { href: "/printer-compatibility", label: "Printer compatibility" },
  ],
  "/kitchen-label-printer": [
    { href: "/printer-compatibility", label: "Printer compatibility" },
    { href: "/printbridge", label: "PrintBridge" },
    { href: "/mobile-app", label: "Android app" },
    { href: "/label-sizes", label: "Label sizes" },
  ],
  "/printer-compatibility": [
    { href: "/printbridge", label: "PrintBridge" },
    { href: "/mobile-app", label: "Android app" },
    { href: "/label-sizes", label: "Label sizes" },
  ],
  "/printbridge": [
    { href: "/printer-compatibility", label: "Printer compatibility" },
    { href: "/label-sizes", label: "Label sizes" },
    { href: "/mobile-app", label: "Android app" },
  ],
  "/mobile-app": [
    { href: "/printer-compatibility", label: "Printer compatibility" },
    { href: "/cleaning-checklists", label: "Cleaning checklists" },
    { href: "/printbridge", label: "PrintBridge" },
  ],
  "/plan": [
    { href: "/christmas", label: "Christmas offer" },
    { href: "/features", label: "Features" },
    { href: "/printer-compatibility", label: "Printer compatibility" },
  ],
  "/christmas": [
    { href: "/plan", label: "Pricing" },
    { href: "/features", label: "Features" },
    { href: "/register", label: "Start free trial" },
  ],
  "/faqs": [
    { href: "/plan", label: "Pricing" },
    { href: "/printer-compatibility", label: "Printer compatibility" },
    { href: "/bookdemo", label: "Book a demo" },
  ],
  "/about": [
    { href: "/features", label: "Features" },
    { href: "/for/restaurants", label: "Restaurants" },
    { href: "/bookdemo", label: "Book a demo" },
  ],
  "/uses": [
    { href: "/features", label: "Features" },
    { href: "/opened-food-labels", label: "Opened food labels" },
    { href: "/label-sizes", label: "Label sizes" },
  ],
  "/blog": [
    { href: "/guides", label: "Practical guides" },
    { href: "/faqs", label: "FAQs" },
    { href: "/features", label: "Features" },
  ],
  "/terms": [
    { href: "/privacy-policy", label: "Privacy policy" },
    { href: "/plan", label: "Pricing" },
  ],
  "/privacy-policy": [
    { href: "/cookie-policy", label: "Cookie policy" },
    { href: "/terms", label: "Terms" },
  ],
  "/cookie-policy": [
    { href: "/privacy-policy", label: "Privacy policy" },
    { href: "/terms", label: "Terms" },
  ],
}

export function PageRelated() {
  const pathname = usePathname()
  const links = RELATED[pathname]
  if (!links) return null
  return (
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-6 text-3xl font-black tracking-tight text-mkt-ink">Related pages</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-lg border border-mkt-steel1 bg-mkt-canvas px-4 py-3 text-sm font-semibold text-mkt-ink hover:text-mkt-teal"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
