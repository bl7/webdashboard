import Link from "next/link"
import { coverageMetadata } from "@/lib/marketing/coverageMetadata"

export const metadata = coverageMetadata("/guides")

const groups = [
  {
    title: "Dates and what to use first",
    links: [
      {
        href: "/guides/use-by-vs-best-before",
        label: "Use-by and best-before",
        note: "A use-by date is a safety date. A best-before date is about quality.",
      },
      {
        href: "/guides/fifo-food-storage",
        label: "FIFO and stock rotation",
        note: "Use the older suitable stock first, after the dates have been checked.",
      },
      {
        href: "/guides/food-labelling-checklist",
        label: "Food labelling checklist",
        note: "Review the item, the date rule, the layout and a real print before a batch goes out.",
      },
    ],
  },
  {
    title: "Allergens and packed food",
    links: [
      {
        href: "/guides/ppds-labelling-requirements",
        label: "PPDS labelling requirements",
        note: "When food packed before a customer chooses it needs a name and a full ingredient list.",
      },
      {
        href: "/guides/allergen-information-for-restaurants",
        label: "Allergen information for restaurants",
        note: "Keep the recipe, the supplier packs and the person answering a customer on the same records.",
      },
      {
        href: "/allergen-guide",
        label: "The 14 food allergens",
        note: "The regulated categories a UK kitchen has to be able to identify.",
      },
    ],
  },
  {
    title: "How you label",
    links: [
      {
        href: "/guides/handwritten-vs-printed-food-labels",
        label: "Handwritten and printed labels",
        note: "When a pen is enough, and when saved details are worth printing.",
      },
      {
        href: "/guides/choosing-kitchen-labelling-software",
        label: "Choosing labelling software",
        note: "Start from the label jobs you actually print, then test the printer route.",
      },
    ],
  },
  {
    title: "Setting InstaLabel up",
    links: [
      {
        href: "/printer-compatibility",
        label: "Printer compatibility",
        note: "A computer uses the printer already installed on it. The Android app works with specific models.",
      },
      {
        href: "/printbridge",
        label: "PrintBridge",
        note: "How the browser reaches a printer installed on Windows or macOS.",
      },
      {
        href: "/label-sizes",
        label: "Label sizes",
        note: "60 × 40 mm and 56 × 80 mm, matched to the printer and the stock.",
      },
      {
        href: "/csv-import",
        label: "CSV import",
        note: "Bring a menu in from a spreadsheet, then review every row before anyone prints.",
      },
    ],
  },
]

export default function Page() {
  return (
    <section className="bg-white px-6 pb-20 pt-32 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-mkt-steel">Guides</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-mkt-ink sm:text-5xl">
          Guides for the labelling work in a kitchen.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mkt-ink8">
          These explain the job. The product pages explain what InstaLabel prints. A guide does not
          make a label compliant, and the finished print still has to be checked.
        </p>
        <div className="mt-14 space-y-12">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xl font-black tracking-tight text-mkt-ink">{group.title}</h2>
              <ul className="mt-4 divide-y divide-mkt-steel1 border-y border-mkt-steel1">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block py-4 hover:text-mkt-teal">
                      <span className="font-semibold text-mkt-ink">{item.label}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-mkt-ink8">{item.note}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
