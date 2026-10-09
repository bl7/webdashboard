"use client"

import { useEffect, useRef, useState } from "react"
import LabelRender from "@/app/dashboard/print/LabelRender"
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/PPDSLabelRenderer"
import { AllergenMatrixSheet } from "@/components/dashboard/AllergenMatrixSheet"
import { buildAllergenMatrix } from "@/lib/allergen-matrix"

const PRINTED = "2026-09-21T09:00:00Z"
const EXPIRY = "2026-09-22T09:00:00Z"

type Kind = "prep" | "cooked" | "ppds" | "ingredient" | "defrost"

type ExampleLabel = {
  name: string
  kind: Kind
  ingredients: { name: string; allergens: string[] }[]
}

type MenuDish = { name: string; allergens: string[] }

type Pack = {
  business: string
  file: string
  photos: { src: string; alt: string }[]
  labels: ExampleLabel[]
  dishes: MenuDish[]
  cleaning: { task: string; when: string }[]
  temperatures: { check: string; reading: string }[]
}

const PACKS: Record<string, Pack> = {
  restaurants: {
    business: "Restaurant kitchen",
    file: "restaurant-kitchen-example.pdf",
    photos: [
      { src: "/marketing/prep-on-container.png", alt: "Prep label on a kitchen container" },
      { src: "/marketing/cooked-on-container.jpg", alt: "Cooked food label on a container" },
    ],
    labels: [
      {
        name: "Tomato sauce",
        kind: "prep",
        ingredients: [
          { name: "Tomatoes", allergens: [] },
          { name: "Celery", allergens: ["Celery"] },
        ],
      },
      {
        name: "Roast chicken",
        kind: "cooked",
        ingredients: [
          { name: "Chicken", allergens: [] },
          { name: "Butter", allergens: ["Milk"] },
        ],
      },
      {
        name: "Double cream",
        kind: "ingredient",
        ingredients: [{ name: "Double cream", allergens: ["Milk"] }],
      },
    ],
    dishes: [
      { name: "Roast chicken", allergens: ["Milk"] },
      { name: "Fish and chips", allergens: ["Fish", "Wheat"] },
      { name: "Prawn linguine", allergens: ["Crustaceans", "Eggs", "Wheat"] },
      { name: "Beef gravy", allergens: ["Celery", "Wheat"] },
      { name: "Caesar salad", allergens: ["Milk", "Eggs", "Fish", "Wheat"] },
      { name: "Tomato sauce", allergens: ["Celery"] },
      { name: "Sticky toffee pudding", allergens: ["Milk", "Wheat", "Eggs"] },
      { name: "Chicken satay", allergens: ["Peanuts", "Soya"] },
    ],
    cleaning: [
      { task: "Wipe the pass and sauce bench", when: "Daily" },
      { task: "Clean the fryer", when: "Daily" },
      { task: "Clean fridge door seals", when: "Weekly" },
      { task: "Clean extraction filters", when: "Monthly" },
    ],
    temperatures: [
      { check: "Fridge 1", reading: "3°C" },
      { check: "Freezer", reading: "−18°C" },
      { check: "Roast chicken, cook", reading: "75°C" },
      { check: "Milk delivery", reading: "4°C" },
    ],
  },
  cafes: {
    business: "Café kitchen",
    file: "cafe-kitchen-example.pdf",
    photos: [
      { src: "/marketing/ppds-tall-close.jpg", alt: "Taller PPDS label on a packed California roll" },
      { src: "/marketing/prep-on-container.png", alt: "Prep label on a filling container" },
    ],
    labels: [
      {
        name: "Tuna filling",
        kind: "prep",
        ingredients: [
          { name: "Tuna", allergens: ["Fish"] },
          { name: "Mayonnaise", allergens: ["Eggs", "Mustard"] },
        ],
      },
      {
        name: "Cheddar sandwich",
        kind: "ppds",
        ingredients: [
          { name: "Bread", allergens: ["Wheat"] },
          { name: "Cheddar", allergens: ["Milk"] },
          { name: "Butter", allergens: ["Milk"] },
        ],
      },
      {
        name: "Oat milk",
        kind: "ingredient",
        ingredients: [{ name: "Oat milk", allergens: [] }],
      },
    ],
    dishes: [
      { name: "Cheddar sandwich", allergens: ["Wheat", "Milk"] },
      { name: "Tuna melt", allergens: ["Fish", "Eggs", "Milk", "Mustard", "Wheat"] },
      { name: "Egg mayo sandwich", allergens: ["Eggs", "Mustard", "Wheat"] },
      { name: "Salad pot", allergens: ["Mustard"] },
      { name: "Ham toastie", allergens: ["Wheat", "Milk"] },
      { name: "Chocolate brownie", allergens: ["Wheat", "Eggs", "Milk", "Soya"] },
      { name: "Soup of the day", allergens: ["Celery"] },
      { name: "Almond croissant", allergens: ["Wheat", "Milk", "Eggs", "Almonds"] },
    ],
    cleaning: [
      { task: "Clean sandwich boards", when: "Daily" },
      { task: "Clean the coffee machine", when: "Daily" },
      { task: "Clean the display fridge", when: "Weekly" },
      { task: "Descale the machine", when: "Monthly" },
    ],
    temperatures: [
      { check: "Display fridge", reading: "4°C" },
      { check: "Milk fridge", reading: "3°C" },
      { check: "Soup, hot hold", reading: "78°C" },
      { check: "Sandwich filling delivery", reading: "5°C" },
    ],
  },
  takeaways: {
    business: "Takeaway kitchen",
    file: "takeaway-kitchen-example.pdf",
    photos: [
      { src: "/marketing/cooked-on-container.jpg", alt: "Cooked food label on a container" },
      { src: "/marketing/defrost-on-container.png", alt: "Label on food leaving the freezer" },
    ],
    labels: [
      {
        name: "Curry base",
        kind: "cooked",
        ingredients: [
          { name: "Onions", allergens: [] },
          { name: "Cream", allergens: ["Milk"] },
          { name: "Mustard", allergens: ["Mustard"] },
        ],
      },
      {
        name: "Chicken thighs",
        kind: "defrost",
        ingredients: [{ name: "Chicken thighs", allergens: [] }],
      },
      {
        name: "Soy marinade",
        kind: "ingredient",
        ingredients: [{ name: "Soy sauce", allergens: ["Soya", "Wheat"] }],
      },
    ],
    dishes: [
      { name: "Chicken curry", allergens: ["Milk", "Mustard"] },
      { name: "Fried rice", allergens: ["Eggs", "Soya"] },
      { name: "Prawn toast", allergens: ["Crustaceans", "Wheat", "Sesame"] },
      { name: "Salt and pepper chicken", allergens: ["Wheat", "Soya"] },
      { name: "Spring rolls", allergens: ["Wheat", "Soya", "Sesame"] },
      { name: "Pad thai", allergens: ["Peanuts", "Eggs", "Fish", "Soya"] },
      { name: "Chicken satay", allergens: ["Peanuts", "Soya"] },
      { name: "Naan", allergens: ["Wheat", "Milk"] },
    ],
    cleaning: [
      { task: "Clean the wok station", when: "Daily" },
      { task: "Clean the fryer", when: "Daily" },
      { task: "Clean the rice hold", when: "Daily" },
      { task: "Clean extraction filters", when: "Weekly" },
    ],
    temperatures: [
      { check: "Sauce fridge", reading: "4°C" },
      { check: "Freezer", reading: "−19°C" },
      { check: "Curry, cook", reading: "75°C" },
      { check: "Rice, hot hold", reading: "68°C" },
    ],
  },
  caterers: {
    business: "Catering kitchen",
    file: "catering-kitchen-example.pdf",
    photos: [
      { src: "/marketing/prep-on-container.png", alt: "Prep label on a batch container" },
      { src: "/marketing/cooked-on-container.jpg", alt: "Cooked batch label on a container" },
    ],
    labels: [
      {
        name: "Batch gravy",
        kind: "prep",
        ingredients: [
          { name: "Stock", allergens: ["Celery"] },
          { name: "Flour", allergens: ["Wheat"] },
        ],
      },
      {
        name: "Beef stew",
        kind: "cooked",
        ingredients: [
          { name: "Beef", allergens: [] },
          { name: "Celery", allergens: ["Celery"] },
        ],
      },
      {
        name: "Veg lasagne",
        kind: "prep",
        ingredients: [
          { name: "Pasta", allergens: ["Wheat"] },
          { name: "Cheese sauce", allergens: ["Milk"] },
        ],
      },
    ],
    dishes: [
      { name: "Beef stew", allergens: ["Celery"] },
      { name: "Veg lasagne", allergens: ["Wheat", "Milk"] },
      { name: "Batch gravy", allergens: ["Celery", "Wheat"] },
      { name: "Salmon en croute", allergens: ["Fish", "Wheat", "Milk", "Eggs"] },
      { name: "Roast potatoes", allergens: [] },
      { name: "Chicken satay skewers", allergens: ["Peanuts", "Soya"] },
      { name: "Bread rolls", allergens: ["Wheat", "Sesame"] },
      { name: "Chocolate tart", allergens: ["Milk", "Wheat", "Eggs", "Soya"] },
    ],
    cleaning: [
      { task: "Wash batch pans", when: "Daily" },
      { task: "Clean transport boxes", when: "Daily" },
      { task: "Clean the oven", when: "Weekly" },
      { task: "Clean the blast chiller", when: "Weekly" },
    ],
    temperatures: [
      { check: "Walk-in fridge", reading: "3°C" },
      { check: "Beef stew, cook", reading: "75°C" },
      { check: "Chilled delivery", reading: "4°C" },
      { check: "Hot box on arrival", reading: "70°C" },
    ],
  },
}

function allergensOf(label: ExampleLabel) {
  return [...new Set(label.ingredients.flatMap((item) => item.allergens))]
}

function matrixFor(dishes: MenuDish[]) {
  return buildAllergenMatrix(
    dishes.map((dish, index) => ({
      menuItemID: String(index),
      menuItemName: dish.name,
      allergens: dish.allergens.map((allergenName) => ({ allergenName })),
    }))
  )
}

function ExampleMatrix({ business, dishes }: { business: string; dishes: MenuDish[] }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [height, setHeight] = useState<number>()
  const { columns, rows } = matrixFor(dishes)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return
    const update = () => {
      const next = Math.min(1, outer.clientWidth / 1512)
      setScale(next)
      setHeight(inner.offsetHeight * next)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(outer)
    observer.observe(inner)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={outerRef} className="w-full min-w-0">
      <div className="relative w-full overflow-hidden" style={{ height: height || undefined }}>
        <div
          ref={innerRef}
          className="absolute left-0 top-0"
          style={{ width: 1512, transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
          <AllergenMatrixSheet
            businessName={business}
            updatedAt="21 September 2026"
            columns={columns}
            rows={rows}
            page={1}
            pageCount={1}
          />
        </div>
      </div>
    </div>
  )
}

function renderLabel(label: ExampleLabel) {
  const ingredients = label.ingredients.map((item, index) => ({
    uuid: String(index),
    ingredientName: item.name,
    allergens: item.allergens.map((allergenName) => ({ allergenName })),
  }))
  const names = label.ingredients.map((item) => item.name)
  const allergens = allergensOf(label)
  if (label.kind === "ppds") {
    return (
      <PPDSLabelRenderer
        item={{
          uid: label.name,
          id: label.name,
          type: "menu",
          name: label.name,
          quantity: 1,
          labelType: "ppds",
          ingredients: names,
        }}
        storageInfo=""
        businessName=""
        allIngredients={ingredients}
      />
    )
  }
  const labelType = label.kind === "cooked" ? "cooked" : label.kind === "prep" ? "prep" : "default"
  const type = label.kind === "ingredient" || label.kind === "defrost" ? "ingredients" : "menu"
  return (
    <LabelRender
      item={{
        uid: label.name,
        id: label.name,
        type,
        name: label.name,
        quantity: 1,
        ingredients: names,
        allergens: allergens.map((allergenName, index) => ({
          uuid: index,
          allergenName,
          category: "",
          status: "Active" as const,
          addedAt: "",
          isCustom: false,
        })),
        printedOn: PRINTED,
        expiryDate: EXPIRY,
        labelType,
      }}
      expiry={EXPIRY}
      useInitials={false}
      selectedInitial=""
      allergens={allergens}
      labelHeight="40mm"
      allIngredients={ingredients}
    />
  )
}

export function SectorPack({ slug }: { slug: string }) {
  const pack = PACKS[slug]
  if (!pack) return null

  return (
    <section className="bg-white px-4 py-16 sm:px-6 md:px-12 lg:px-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-3 text-3xl font-black tracking-tight text-mkt-ink sm:text-4xl">
          Example records for a {pack.business.toLowerCase()}.
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-mkt-ink8">
          Labels, an allergen matrix, the cleaning list and temperature checks for this kind of kitchen. The figures are samples. Your own items and readings replace them.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {pack.labels.map((label) => (
            <div key={label.name}>
              <div className="mb-3" style={{ color: "#000" }}>
                {renderLabel(label)}
              </div>
              <p className="text-sm font-semibold text-mkt-ink">{label.name}</p>
              <p className="text-xs text-mkt-steel">
                {label.kind === "ingredient"
                  ? "Ingredient label"
                  : label.kind === "defrost"
                    ? "Food leaving the freezer"
                    : label.kind === "ppds"
                      ? "PPDS label"
                      : label.kind === "cooked"
                        ? "Cooked label"
                        : "Prep label"}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {pack.photos.map((photo) => (
            <img key={photo.src} src={photo.src} alt={photo.alt} className="h-48 w-full rounded-lg object-cover" />
          ))}
        </div>
        <div className="mt-10">
          <h3 className="mb-3 text-lg font-extrabold text-mkt-ink">Allergen matrix</h3>
          <ExampleMatrix business={pack.business} dishes={pack.dishes} />
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 text-lg font-extrabold text-mkt-ink">Cleaning list</h3>
            <p className="mb-4 text-sm leading-relaxed text-mkt-ink8">
              Set the cleaning tasks the kitchen already runs, grouped by area. In the Android app,
              staff choose their name and mark each task done.
            </p>
            <img
              src="/marketing/cleaning-app.jpg?v=20261009"
              alt="Cleaning tasks in the InstaLabel Android app"
              className="aspect-[3/4] w-full max-w-sm rounded-lg object-cover"
            />
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-mkt-ink8">
              <li>Tasks repeat daily, weekly or monthly.</li>
              <li>Today’s list shows what is due, who completed it, and what is still pending.</li>
              <li>One checklist is kept for the day, and one diary email goes out at the time the kitchen chooses.</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-lg font-extrabold text-mkt-ink">Temperature checks</h3>
            <p className="mb-4 text-sm leading-relaxed text-mkt-ink8">
              Staff record equipment, food and delivery temperatures in the Android app. The
              dashboard shows today’s record and what is still to enter.
            </p>
            <img
              src="/marketing/temperature-app.jpg?v=20261009"
              alt="Temperature checks in the InstaLabel Android app"
              className="aspect-[3/4] w-full max-w-sm rounded-lg object-cover"
            />
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-mkt-ink8">
              <li>Each check shows who recorded it and whether it is still due.</li>
              <li>Temperature checks stay separate from the cleaning list.</li>
              <li>They are included in the diary, and in the one email sent at the time the kitchen chooses.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
