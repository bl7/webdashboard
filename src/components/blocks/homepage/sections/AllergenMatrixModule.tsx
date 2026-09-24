import { ArrowRight } from "lucide-react"

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

const points = [
  "Built from your saved item records",
  "Covers all 14 regulated allergen categories",
  "Printable PDF for kitchen or customer-information use",
]

export const AllergenMatrixModule = () => (
  <section id="allergen-matrix" className="home-section min-w-0" style={{ scrollMarginTop: "7rem" }}>
    <div className="home-wrap min-w-0">
      <div className="home-eyebrow">Allergen matrix</div>
      <h2 className="home-h2 mt-4">
        One set of ingredient information.
        <br />
        More than one use.
      </h2>
      <p className="home-lead mt-4">
        The same saved ingredient and menu information can also produce an allergen matrix. Review
        what is recorded, export the PDF and keep it with your team. Check it against current
        recipes and supplier information.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {points.map((point) => (
          <li key={point} className="home-card px-4 py-3 text-sm font-semibold">
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-10 grid min-w-0 items-start gap-6 lg:grid-cols-3">
        <div className="home-card min-w-0 overflow-hidden p-3 sm:p-4 lg:col-span-2">
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
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs text-[var(--home-muted)]">
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
        </div>

        <aside className="home-card p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--home-forest)]">
            Source record
          </p>
          <h3 className="mt-2 text-xl font-extrabold">Cheddar sandwich</h3>
          <p className="mt-3 font-mono text-sm leading-relaxed">
            Ingredients: <strong>WHEAT</strong> bread, cheddar (<strong>MILK</strong>), butter (
            <strong>MILK</strong>)
          </p>
          <p className="mt-3 text-sm">
            Recorded allergens: <strong>Gluten</strong>, <strong>Milk</strong>
          </p>
          <p className="mt-4 text-xs leading-relaxed text-[var(--home-muted)]">
            Example extract from demonstration records. The matrix uses the same item records as
            your labels.
          </p>
        </aside>
      </div>

      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-[var(--home-muted)]">
        Review the matrix against current recipes and supplier information. A blank cell does not
        mean allergen-free.
      </p>
      <p className="mt-2 text-xs text-[var(--home-muted)]">
        Example matrix generated from demonstration records. Always check your own recipes and
        supplier information before use.
      </p>

      <a href="/allergen-compliance#matrix" className="home-btn home-btn-primary mt-8">
        See the allergen matrix
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  </section>
)
