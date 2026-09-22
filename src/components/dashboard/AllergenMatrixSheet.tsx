import type { MatrixColumn, MatrixRow } from "@/lib/allergen-matrix"

type AllergenMatrixSheetProps = {
  businessName: string
  updatedAt: string
  columns: MatrixColumn[]
  rows: MatrixRow[]
  page: number
  pageCount: number
  captureId?: string
}

const ink = "#141414"
const paper = "#fbf8f1"
const rule = "#1c1c1c"
const muted = "#5c5850"
const contains = "#1a1a1a"
const empty = "#efeae0"
const accent = "#9b1c1c"

export function AllergenMatrixSheet({
  businessName,
  updatedAt,
  columns,
  rows,
  page,
  pageCount,
  captureId,
}: AllergenMatrixSheetProps) {
  return (
    <article
      className="allergen-matrix-sheet"
      data-matrix-page={captureId}
      style={{
        width: 1512,
        minHeight: 1068,
        background: paper,
        color: ink,
        fontFamily: "Georgia, 'Times New Roman', serif",
        boxSizing: "border-box",
        padding: 28,
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${rule}`,
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 24,
          borderBottom: `4px solid ${ink}`,
          paddingBottom: 14,
          marginBottom: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <img src="/logo_sm.png" alt="" width={42} height={42} style={{ objectFit: "contain" }} />
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: "Arial, Helvetica, sans-serif",
                fontSize: 11,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: accent,
                fontWeight: 700,
              }}
            >
              Allergen information
            </p>
            <h1
              style={{
                margin: "4px 0 0",
                fontSize: 32,
                lineHeight: 1.05,
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {businessName}
            </h1>
          </div>
        </div>
        <div style={{ textAlign: "right", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 12, color: muted }}>
          <p style={{ margin: 0 }}>Kitchen chart · UK 14 allergens</p>
          <p style={{ margin: "4px 0 0", color: ink }}>Updated {updatedAt}</p>
          {pageCount > 1 && (
            <p style={{ margin: "4px 0 0" }}>
              Page {page} of {pageCount}
            </p>
          )}
        </div>
      </header>

      <p
        style={{
          margin: "0 0 12px",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 12,
          color: muted,
        }}
      >
        Please tell a member of staff if you have a food allergy or intolerance. A filled circle means
        the allergen is recorded in this dish.
      </p>

      <div style={{ flex: 1 }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            fontFamily: "Arial, Helvetica, sans-serif",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  width: 250,
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
              {columns.map((col) => (
                <th
                  key={col.id}
                  style={{
                    border: `1px solid ${rule}`,
                    background: ink,
                    color: "#fff",
                    padding: "8px 2px 10px",
                    verticalAlign: "bottom",
                    height: 118,
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
                        minWidth: 22,
                        padding: "1px 4px",
                        background: accent,
                        fontSize: 10,
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
                        fontSize: 11,
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
            {rows.map((row, index) => (
              <tr key={row.id} style={{ background: index % 2 === 0 ? "#fff" : "#f3eee4" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "7px 10px",
                    border: `1px solid ${rule}`,
                    fontSize: 13,
                    fontWeight: 600,
                    color: ink,
                  }}
                >
                  {row.name}
                </th>
                {columns.map((col) => {
                  const has = row.contains.includes(col.id)
                  return (
                    <td
                      key={col.id}
                      style={{
                        border: `1px solid ${rule}`,
                        textAlign: "center",
                        verticalAlign: "middle",
                        background: has ? "#fff7f7" : empty,
                        height: 32,
                      }}
                    >
                      {has ? (
                        <span
                          aria-label={`Contains ${col.label}`}
                          style={{
                            display: "inline-block",
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: contains,
                          }}
                        />
                      ) : (
                        <span aria-label={`No ${col.label} recorded`} />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: `2px solid ${ink}`,
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: 18,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 11,
          color: muted,
        }}
      >
        <div>
          <p style={{ margin: 0, color: ink, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Key
          </p>
          <p style={{ margin: "6px 0 0", display: "flex", alignItems: "center", gap: 8, color: ink }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: contains, display: "inline-block" }} />
            Contains
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: `1px solid ${rule}`,
                background: empty,
                display: "inline-block",
                marginLeft: 10,
              }}
            />
            Not recorded
          </p>
        </div>
        <p style={{ margin: 0, lineHeight: 1.45 }}>
          This chart is produced from allergen records held against each menu item. Recipes, suppliers
          and ingredients can change. Staff must check the current record before advising a guest.
          Guests with an allergy should always speak to a member of the team before ordering.
        </p>
      </footer>
    </article>
  )
}
