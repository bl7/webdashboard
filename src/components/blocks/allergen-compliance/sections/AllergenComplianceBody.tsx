"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/PPDSLabelRenderer"

const steps = [
  {
    title: "Check the source.",
    body: "Use the current supplier specification and the recipe your team actually follows.",
  },
  {
    title: "Record the information.",
    body: "Add the ingredient and allergen details to the correct item in InstaLabel.",
  },
  {
    title: "Review the label.",
    body: "Check the information and the allergen emphasis in the preview and on a test print.",
  },
  {
    title: "Keep it current.",
    body: "Update affected items when a supplier, ingredient or recipe changes.",
  },
]

const helps = [
  {
    title: "Reusable item information",
    body: "Start with the details already recorded for the item.",
  },
  {
    title: "Readable allergen emphasis",
    body: "Make the relevant recorded allergens visible in the label layout.",
    allergen: true,
  },
  {
    title: "A repeatable printing process",
    body: "Review the item and label before printing another batch.",
  },
]

const faqs = [
  {
    question: "Can InstaLabel find every allergen from a dish name?",
    answer:
      "No dish name provides a complete recipe. Check actual ingredients and supplier information before relying on a label.",
  },
  {
    question: "What happens when a supplier changes?",
    answer:
      "Review the new specification, update the affected records and check subsequent labels. Follow your procedure for items already prepared or labelled.",
  },
  {
    question: "Does a label prevent allergen cross-contact?",
    answer:
      "A label communicates information. Your kitchen still needs appropriate handling, cleaning and separation procedures.",
  },
]

const shortbreadItem = {
  uid: "allergen-ppds-shortbread",
  id: "allergen-ppds-shortbread",
  type: "menu",
  name: "Butter shortbread",
  quantity: 1,
  labelType: "ppds",
  ingredients: ["flour", "butter", "sugar"],
}

const shortbreadIngredients = [
  { uuid: "s1", ingredientName: "flour", allergens: [{ allergenName: "Wheat" }] },
  { uuid: "s2", ingredientName: "butter", allergens: [{ allergenName: "Milk" }] },
  { uuid: "s3", ingredientName: "sugar", allergens: [] },
]

const matrixPoints = [
  {
    title: "One source to review",
    body: "Use the item and ingredient records already maintained in InstaLabel.",
  },
  {
    title: "A clearer menu-wide view",
    body: "See recorded allergens across all included dishes.",
  },
  {
    title: "A controlled export",
    body: "Show the review date, reviewer and generated date without pretending the document updates itself after printing.",
  },
]

export const AllergenComplianceBody = () => (
  <>
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Start with the ingredients.
        </h2>
        <ol className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-mkt-steel1 bg-mkt-canvas p-5">
              <div className="mb-2 text-xs font-semibold text-mkt-teal">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mb-2 text-base font-bold text-mkt-ink">{step.title}</div>
              <p className="text-sm leading-relaxed text-mkt-ink8">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <figure>
            <div className="overflow-hidden rounded-xl border border-mkt-steel1 bg-white shadow-sm">
              <Image
                src="/webdashboard/dashboard.png"
                alt="Saved item records in the InstaLabel dashboard"
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-mkt-steel">
              Source: dashboard showing recorded custom allergens, ingredients and menu items. Counts
              are from this screenshot, not a published statistic.
            </figcaption>
          </figure>
          <figure className="flex flex-col items-center lg:items-end">
            <div>
              <PPDSLabelRenderer
                item={shortbreadItem}
                storageInfo=""
                businessName=""
                allIngredients={shortbreadIngredients}
              />
            </div>
            <figcaption className="mt-3 max-w-sm text-center text-xs text-mkt-steel lg:text-right">
              Illustrative ingredient layout, using the same Butter shortbread example as the
              Natasha&apos;s Law page. Not a production-ready label.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section
      id="matrix"
      className="scroll-mt-24 bg-mkt-canvas px-4 py-20 sm:px-6 md:px-12 lg:px-16 sm:py-24"
      style={{ scrollMarginTop: "7rem" }}
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          From menu records to a printable allergen matrix.
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-mkt-ink8">
          Your allergen records should do more than feed one label at a time. Choose the dishes on
          your current menu, review the 14 allergen categories and generate a matrix your team can
          keep available and update when the menu changes.
        </p>
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {matrixPoints.map((item) => (
            <div key={item.title} className="rounded-xl border border-mkt-steel1 bg-white p-6">
              <div className="mb-2 text-base font-bold text-mkt-ink">{item.title}</div>
              <p className="text-sm leading-relaxed text-mkt-ink8">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 grid min-w-0 items-start gap-6 lg:grid-cols-3">
          <div className="min-w-0 overflow-hidden rounded-xl border border-mkt-steel1 bg-white p-3 sm:p-4 lg:col-span-2">
            <MatrixChart />
          </div>
          <aside className="rounded-xl border border-mkt-steel1 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-mkt-teal">
              Source record
            </p>
            <h3 className="mt-2 text-xl font-extrabold text-mkt-ink">Cheddar sandwich</h3>
            <p className="mt-3 font-mono text-sm leading-relaxed text-mkt-ink8">
              Ingredients: <strong>WHEAT</strong> bread, cheddar (<strong>MILK</strong>), butter (
              <strong>MILK</strong>)
            </p>
            <p className="mt-3 text-sm text-mkt-ink8">
              Recorded allergens: <strong>Gluten</strong>, <strong>Milk</strong>
            </p>
            <p className="mt-4 text-xs leading-relaxed text-mkt-steel">
              Example extract from demonstration records. The matrix uses the same item records as
              your labels.
            </p>
          </aside>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-mkt-steel">
          Review the matrix against current recipes and supplier information. A blank cell does not
          mean allergen-free.
        </p>
        <p className="mt-2 text-xs text-mkt-steel">
          Example matrix generated from demonstration records. Always check your own recipes and
          supplier information before use.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/register">
            <Button
              size="lg"
              className="border-0 font-semibold text-white"
              style={{ backgroundColor: "#142124", backgroundImage: "none" }}
            >
              Start free trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/bookdemo">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-mkt-steel1 font-semibold text-mkt-ink hover:border-mkt-ink hover:bg-mkt-ink hover:text-white"
            >
              Book a matrix demo
            </Button>
          </Link>
        </div>

        <div className="mt-12 max-w-3xl border-t border-mkt-steel1 pt-10">
          <h3 className="mb-3 text-xl font-bold tracking-tight text-mkt-ink sm:text-2xl">
            A matrix is not a PPDS ingredient label.
          </h3>
          <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
            An allergen matrix can help communicate allergens for non-prepacked dishes. PPDS food
            has separate ingredient-list and allergen-emphasis requirements. Choose the output that
            matches how the food is packed and sold.
          </p>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-8">
            <TextLink href="/natashas-law">Read the PPDS guide</TextLink>
            <TextLink href="/allergen-guide">Read the allergen reference</TextLink>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          A consistent place to work from.
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {helps.map((item) => (
            <div
              key={item.title}
              className={`rounded-xl border bg-white p-6 ${
                item.allergen ? "border-[#d8cce8]" : "border-mkt-steel1"
              }`}
            >
              {item.allergen ? (
                <div className="mb-3 inline-flex rounded-full bg-mkt-allergen1 px-3 py-1 text-xs font-semibold text-mkt-allergen">
                  Allergen emphasis
                </div>
              ) : null}
              <div className="mb-2 text-base font-bold text-mkt-ink">{item.title}</div>
              <p className="text-sm leading-relaxed text-mkt-ink8">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Accurate inputs still matter.
        </h2>
        <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
          A menu description cannot reveal every ingredient in a sauce, dressing or bought-in
          component. Check compound ingredients and substitutions against their source information.
          Labelling also sits alongside your kitchen&apos;s handling, cleaning and staff-training
          procedures.
        </p>
        <a
          href="https://www.gov.uk/government/publications/allergen-checklist-for-food-businesses"
          className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official allergen checklist
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Match the label to how the food is sold.
        </h2>
        <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
          Internal container labels and customer-facing PPDS labels do different jobs. Use the PPDS
          guide when food is packed before customers select it, and check the official rules for
          other sales methods.
        </p>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-8">
          <TextLink href="/natashas-law">PPDS labels</TextLink>
          <TextLink href="/allergen-guide">Allergen reference</TextLink>
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Questions about allergen information
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`item-${index}`}
              className="rounded-lg border border-mkt-steel1 bg-mkt-canvas px-4"
            >
              <AccordionTrigger className="text-left text-sm font-semibold text-mkt-ink hover:text-mkt-teal">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-mkt-ink8">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          See the allergen workflow with a real item.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Bring a sample recipe or supplier specification to a demo and see how the information
          reaches the label.
        </p>
        <Link href="/bookdemo">
          <Button
            size="lg"
            className="border-0 font-semibold text-white"
            style={{ backgroundColor: "#142124", backgroundImage: "none" }}
          >
            Book a demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <div className="mt-8">
          <TextLink href="/kitchen-label-printer">Printer compatibility</TextLink>
        </div>
      </div>
    </section>
  </>
)

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
    >
      {children}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  )
}

const ink = "#141414"
const rule = "#1c1c1c"
const empty = "#efeae0"
const contains = "#1a1a1a"
const accent = "#9b1c1c"

const COLUMNS = [
  { id: "celery", code: "Ce", label: "Celery" },
  { id: "gluten", code: "G", label: "Gluten" },
  { id: "crustaceans", code: "Cr", label: "Crustaceans" },
  { id: "eggs", code: "E", label: "Eggs" },
  { id: "fish", code: "F", label: "Fish" },
  { id: "lupin", code: "L", label: "Lupin" },
  { id: "milk", code: "Mk", label: "Milk" },
  { id: "molluscs", code: "Mo", label: "Molluscs" },
  { id: "mustard", code: "Mu", label: "Mustard" },
  { id: "nuts", code: "N", label: "Nuts" },
  { id: "peanuts", code: "P", label: "Peanuts" },
  { id: "sesame", code: "Se", label: "Sesame" },
  { id: "soya", code: "So", label: "Soya" },
  { id: "sulphites", code: "SD", label: "Sulphites" },
] as const

const DISHES: { name: string; contains: string[] }[] = [
  { name: "Cheddar sandwich", contains: ["gluten", "milk"] },
  { name: "Fish and chips", contains: ["gluten", "fish"] },
  { name: "Prawn linguine", contains: ["gluten", "eggs", "crustaceans"] },
  { name: "Chicken satay", contains: ["peanuts", "soya", "gluten"] },
  { name: "Apple crumble", contains: ["gluten", "milk", "eggs", "nuts"] },
]

function MatrixChart() {
  return (
    <>
      <div className="max-w-full overflow-x-auto">
        <table
          style={{
            width: "100%",
            minWidth: 560,
            borderCollapse: "collapse",
            tableLayout: "fixed",
            fontFamily: "Arial, Helvetica, sans-serif",
            background: "#fbf8f1",
            color: ink,
          }}
        >
          <caption className="sr-only">
            Demonstration allergen matrix for five dishes across the 14 regulated allergen
            categories
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                style={{
                  width: 150,
                  textAlign: "left",
                  padding: "8px 10px",
                  border: `1px solid ${rule}`,
                  background: ink,
                  color: "#fff",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Dish
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.id}
                  scope="col"
                  style={{
                    border: `1px solid ${rule}`,
                    background: ink,
                    color: "#fff",
                    padding: "8px 2px 10px",
                    verticalAlign: "bottom",
                    height: 108,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        minWidth: 20,
                        padding: "1px 3px",
                        background: accent,
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {col.code}
                    </span>
                    <span
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        fontSize: 10,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.label}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DISHES.map((dish, index) => (
              <tr key={dish.name} style={{ background: index % 2 === 0 ? "#fff" : "#f3eee4" }}>
                <th
                  scope="row"
                  style={{
                    textAlign: "left",
                    padding: "7px 10px",
                    border: `1px solid ${rule}`,
                    fontSize: 13,
                    fontWeight: 600,
                    color: ink,
                    background: "inherit",
                  }}
                >
                  {dish.name}
                </th>
                {COLUMNS.map((col) => {
                  const has = dish.contains.includes(col.id)
                  return (
                    <td
                      key={col.id}
                      style={{
                        border: `1px solid ${rule}`,
                        textAlign: "center",
                        verticalAlign: "middle",
                        background: has ? "#fff7f7" : empty,
                        height: 28,
                      }}
                    >
                      {has ? (
                        <span
                          aria-label={`${col.label} recorded as present`}
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: contains,
                          }}
                        />
                      ) : (
                        <span className="sr-only">{col.label} not currently recorded</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs text-mkt-steel">
        <span className="inline-flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: contains }}
          />
          Recorded as present
        </span>
        <span aria-hidden>·</span>
        <span>Blank: no allergen currently recorded</span>
      </p>
    </>
  )
}
