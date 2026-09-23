"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"
import LabelRender from "@/app/dashboard/print/LabelRender"
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/PPDSLabelRenderer"

const tasks = [
  { href: "#store", title: "Store an ingredient", copy: "Identify a stored or decanted ingredient." },
  { href: "#prepare", title: "Prepare an item", copy: "Label ingredients or dishes prepared ahead." },
  {
    href: "#cooked",
    title: "Identify a cooked batch",
    copy: "Keep cooked items distinct between shifts.",
  },
  { href: "#defrost", title: "Manage defrosting", copy: "Identify food moving out of frozen storage." },
  { href: "#rotation", title: "Organise stock rotation", copy: "Make the applicable date easy to see." },
  { href: "#ppds", title: "Pack food for direct sale", copy: "Prepare a PPDS ingredient label." },
  {
    href: "#matrix",
    title: "Share menu allergen information",
    copy: "Review the recorded allergens across selected dishes and export a printable matrix.",
  },
]

const businesses = [
  {
    title: "Restaurants and pubs",
    copy: "Ingredient storage, daily prep and cooked-batch identification.",
  },
  {
    title: "Cafés and delis",
    copy: "Prepared items and PPDS foods packed before customers select them.",
  },
  {
    title: "Takeaways",
    copy: "Back-of-house preparation and the allergen information appropriate to the ordering process.",
  },
  {
    title: "Caterers and food trucks",
    copy: "Consistent item labels and a printing setup suitable for the workspace.",
  },
]

const printLinks = [
  { href: "/printbridge", label: "Desktop printing" },
  { href: "/mobile-app", label: "Android printing" },
  { href: "/kitchen-label-printer", label: "Printer compatibility" },
]

export const UsesBody = () => (
  <>
    <section
      id="workflows"
      className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16"
      style={{ scrollMarginTop: "7rem" }}
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          What are you labelling?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <a
              key={task.href}
              href={task.href}
              className="rounded-xl border border-mkt-steel1 bg-mkt-canvas p-5 transition-colors hover:border-mkt-ink"
            >
              <div className="text-base font-bold text-mkt-ink">{task.title}</div>
              <p className="mt-2 text-sm text-mkt-ink8">{task.copy}</p>
            </a>
          ))}
        </div>
      </div>
    </section>

    <WorkflowRow
      id="store"
      heading="Store ingredients with clear identification."
      copy="When ingredients move into storage containers, keep their identity and relevant date information visible. Use an ingredient label alongside the supplier information your kitchen retains."
      example="Decant flour into a storage container and label it with the item details used by your kitchen."
      href="/ingredient-labels"
      link="Ingredient labels"
      canvas={false}
      note="No allergen is currently recorded on this item. That is not an allergen-free claim."
    >
      <LabelRender
        item={{
          uid: "store-1",
          id: "store-1",
          type: "ingredients",
          name: "Fresh Basil",
          quantity: 1,
          allergens: [],
          printedOn: "2024-07-01T08:00:00Z",
          expiryDate: "2024-07-05T08:00:00Z",
        }}
        expiry="2024-07-05T08:00:00Z"
        useInitials={true}
        selectedInitial="BL"
        allergens={[]}
        labelHeight="40mm"
        allIngredients={[]}
      />
    </WorkflowRow>

    <WorkflowRow
      id="prepare"
      heading="Label prepared items before the next handover."
      copy="Identify chopped ingredients, prepared mixtures and items made ahead of service. Print the item's recorded information and review the date before applying the label."
      example="The morning team prepares vegetables for service and labels each container before storage."
      href="/prep-labels"
      link="Prep labels"
      canvas
    >
      <LabelRender
        item={{
          uid: "prep-1",
          id: "prep-1",
          type: "menu",
          name: "Mixed Vegetables",
          quantity: 1,
          ingredients: ["Carrots", "Broccoli", "Celery", "Peppers"],
          allergens: [
            {
              uuid: 3,
              allergenName: "Celery",
              category: "Vegetable",
              status: "Active",
              addedAt: "",
              isCustom: false,
            },
          ],
          printedOn: "2024-07-01T09:00:00Z",
          expiryDate: "2024-07-01T18:00:00Z",
          labelType: "prep",
        }}
        expiry="2024-07-01T18:00:00Z"
        useInitials={true}
        selectedInitial="BL"
        allergens={["Celery"]}
        labelHeight="40mm"
        allIngredients={[
          { uuid: "6", ingredientName: "Carrots", allergens: [] },
          { uuid: "7", ingredientName: "Broccoli", allergens: [] },
          { uuid: "8", ingredientName: "Celery", allergens: [{ allergenName: "Celery" }] },
          { uuid: "9", ingredientName: "Peppers", allergens: [] },
        ]}
      />
    </WorkflowRow>

    <WorkflowRow
      id="cooked"
      heading="Keep cooked batches easy to distinguish."
      copy="Apply a cooked label so the next shift can identify the item and read its relevant date and allergen information. Keep temperature and cooling records in your kitchen's food-safety process."
      example="Identify a cooked sauce batch before it moves to the next stage of your kitchen's procedure."
      href="/cooked-labels"
      link="Cooked labels"
      canvas={false}
    >
      <LabelRender
        item={{
          uid: "cooked-1",
          id: "cooked-1",
          type: "menu",
          name: "Chicken Curry",
          quantity: 1,
          ingredients: ["Chicken", "Coconut Milk", "Curry Powder", "Onion", "Garlic"],
          allergens: [
            {
              uuid: 1,
              allergenName: "Milk",
              category: "Dairy",
              status: "Active",
              addedAt: "",
              isCustom: false,
            },
            {
              uuid: 2,
              allergenName: "Mustard",
              category: "Spice",
              status: "Active",
              addedAt: "",
              isCustom: false,
            },
          ],
          printedOn: "2024-07-01T10:00:00Z",
          expiryDate: "2024-07-02T10:00:00Z",
          labelType: "cooked",
        }}
        expiry="2024-07-02T10:00:00Z"
        useInitials={true}
        selectedInitial="BL"
        allergens={["Milk", "Mustard"]}
        labelHeight="40mm"
        allIngredients={[
          { uuid: "1", ingredientName: "Chicken", allergens: [] },
          { uuid: "2", ingredientName: "Coconut Milk", allergens: [{ allergenName: "Milk" }] },
          { uuid: "3", ingredientName: "Curry Powder", allergens: [{ allergenName: "Mustard" }] },
          { uuid: "4", ingredientName: "Onion", allergens: [] },
          { uuid: "5", ingredientName: "Garlic", allergens: [] },
        ]}
      />
    </WorkflowRow>

    <WorkflowRow
      id="defrost"
      heading="Make the defrost workflow visible."
      copy="Identify an item as it moves through your defrosting procedure. Check its date information and label details against the actual stage of the process."
      example="Label a batch moved from frozen storage so the next shift knows which item it is handling."
      href="/defrost-labels"
      link="Defrost labels"
      canvas
      note="Recorded allergen: Fish. The label uses the same CONTAINS ALLERGENS layout as other ingredient labels."
    >
      <LabelRender
        item={{
          uid: "defrost-1",
          id: "defrost-1",
          type: "ingredients",
          name: "Frozen Cod Fillet (defrosted)",
          quantity: 1,
          allergens: [
            {
              uuid: 6,
              allergenName: "Fish",
              category: "Seafood",
              status: "Active",
              addedAt: "",
              isCustom: false,
            },
          ],
          printedOn: "2024-07-01T12:00:00Z",
          expiryDate: "2024-07-02T12:00:00Z",
        }}
        expiry="2024-07-02T12:00:00Z"
        useInitials={true}
        selectedInitial="BL"
        allergens={["Fish"]}
        labelHeight="40mm"
        allIngredients={[
          { uuid: "d1", ingredientName: "Frozen Cod Fillet (defrosted)", allergens: [{ allergenName: "Fish" }] },
        ]}
      />
    </WorkflowRow>

    <WorkflowRow
      id="rotation"
      heading="Make date checks part of stock rotation."
      copy="Print the date determined by your kitchen's settings in a consistent format. Use that information with your normal storage and stock checks to decide which items to use first."
      example="Compare labelled containers during the shift's stock check."
      href="/expiry-date-labels"
      link="Expiry date labels"
      canvas={false}
    >
      <LabelRender
        item={{
          uid: "rotation-1",
          id: "rotation-1",
          type: "menu",
          name: "USE FIRST",
          quantity: 1,
          printedOn: "2024-07-01T08:00:00Z",
          expiryDate: "2024-07-02T08:00:00Z",
          labelType: "default",
        }}
        expiry="2024-07-02T08:00:00Z"
        useInitials={false}
        selectedInitial=""
        allergens={[]}
        labelHeight="40mm"
        allIngredients={[]}
      />
    </WorkflowRow>

    <section
      id="ppds"
      className="scroll-mt-24 bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16"
      style={{ scrollMarginTop: "7rem" }}
    >
      <div className="container mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            Prepare ingredient labels for food packed for direct sale.
          </h2>
          <p className="mb-4 text-base leading-relaxed text-mkt-ink8">
            For food within the PPDS rules, prepare a label with the food name and a full ingredient
            list that emphasises the relevant allergens. Check the actual recipe and the printed
            result before offering the food for sale.
          </p>
          <p className="mb-4 text-sm italic leading-relaxed text-mkt-steel">
            Example: A café prepares and packs sandwiches on site before customers choose them from
            the display.
          </p>
          <p className="mb-6 text-sm leading-relaxed text-mkt-steel">
            Takeaway packaging alone does not determine whether food is PPDS. Check how and when the
            food is packed, ordered and sold.{" "}
            <a
              href="https://www.gov.uk/government/publications/introduction-to-allergen-labelling-for-ppds-food/introduction-to-allergen-labelling-for-ppds-food"
              className="font-semibold text-mkt-teal hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              FSA PPDS guidance
            </a>
            .
          </p>
          <TextLink href="/natashas-law">PPDS labels and Natasha&apos;s Law</TextLink>
        </div>
        <div className="flex justify-center lg:justify-end">
          <div>
            <PPDSLabelRenderer
              item={{
                uid: "ppds-shortbread-uses",
                id: "ppds-shortbread-uses",
                type: "menu",
                name: "Butter shortbread",
                quantity: 1,
                labelType: "ppds",
                ingredients: ["flour", "butter", "sugar"],
              }}
              storageInfo=""
              businessName=""
              allIngredients={[
                { uuid: "s1", ingredientName: "flour", allergens: [{ allergenName: "Wheat" }] },
                { uuid: "s2", ingredientName: "butter", allergens: [{ allergenName: "Milk" }] },
                { uuid: "s3", ingredientName: "sugar", allergens: [] },
              ]}
            />
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-mkt-steel">
              Illustrative ingredient layout, using the same Butter shortbread example as the
              Natasha&apos;s Law page. Not a production-ready label.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section
      id="matrix"
      className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16"
      style={{ scrollMarginTop: "7rem" }}
    >
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Keep menu allergen information available in writing.
        </h2>
        <p className="mb-4 text-base leading-relaxed text-mkt-ink8">
          For non-prepacked dishes, choose the active menu items, check their current allergen
          records and generate a matrix showing the 14 regulated categories. Keep the document
          current and support written information with a conversation where appropriate.
        </p>
        <p className="mb-4 text-sm italic leading-relaxed text-mkt-steel">
          Example: A restaurant updates two sauces, reviews the affected dish records and generates
          a fresh front-of-house matrix for the current menu.
        </p>
        <p className="mb-6 text-sm leading-relaxed text-mkt-steel">
          This workflow does not replace a PPDS ingredient label and does not create allergen
          information from a dish name.
        </p>
        <a
          href="/allergen-compliance#matrix"
          className="inline-flex items-center text-sm font-semibold text-mkt-teal hover:underline"
        >
          See the allergen matrix
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-8 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Use the workflows that match your service.
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {businesses.map((item) => (
            <div key={item.title} className="rounded-xl border border-mkt-steel1 bg-mkt-canvas p-5">
              <div className="text-base font-bold text-mkt-ink">{item.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-mkt-ink8">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-mkt-canvas px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Choose where the label is printed.
        </h2>
        <p className="mb-6 text-base leading-relaxed text-mkt-ink8">
          Use a computer with PrintBridge for a fixed station, or the Android app with a supported
          Bluetooth printer. Check the equipment requirements before choosing your setup.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {printLinks.map((item) => (
            <TextLink key={item.href} href={item.href}>
              {item.label}
            </TextLink>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Walk through your kitchen&apos;s labelling routine.
        </h2>
        <p className="mb-8 text-base leading-relaxed text-mkt-ink8">
          Tell us which tasks you want to improve and see the relevant workflow in a demo.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
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
          <Link href="/features">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-mkt-steel1 font-semibold text-mkt-ink hover:border-mkt-ink hover:bg-mkt-ink hover:text-white"
            >
              Explore product features
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </>
)

function WorkflowRow({
  id,
  heading,
  copy,
  example,
  href,
  link,
  canvas,
  note,
  children,
}: {
  id: string
  heading: string
  copy: string
  example: string
  href: string
  link: string
  canvas: boolean
  note?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-4 py-16 sm:px-6 md:px-12 lg:px-16 ${canvas ? "bg-mkt-canvas" : "bg-white"}`}
      style={{ scrollMarginTop: "7rem" }}
    >
      <div className="container mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
            {heading}
          </h2>
          <p className="mb-4 text-base leading-relaxed text-mkt-ink8">{copy}</p>
          <p className="mb-6 text-sm italic leading-relaxed text-mkt-steel">Example: {example}</p>
          <TextLink href={href}>{link}</TextLink>
        </div>
        <div className="flex flex-col items-center lg:items-end">
          <div className="overflow-x-auto">{children}</div>
          {note ? (
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-mkt-steel">{note}</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

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
