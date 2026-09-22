export type MatrixColumn = {
  id: string
  code: string
  label: string
  aliases: string[]
  custom?: boolean
}

export type MatrixRow = {
  id: string
  name: string
  contains: string[]
}

const UK_14: MatrixColumn[] = [
  { id: "celery", code: "Ce", label: "Celery", aliases: ["celery", "celeriac"] },
  {
    id: "gluten",
    code: "G",
    label: "Gluten",
    aliases: [
      "gluten",
      "wheat",
      "rye",
      "barley",
      "oats",
      "spelt",
      "kamut",
      "cereals",
      "cereals containing gluten",
      "cereal",
    ],
  },
  {
    id: "crustaceans",
    code: "Cr",
    label: "Crustaceans",
    aliases: ["crustaceans", "crustacean", "prawn", "prawns", "shrimp", "crab", "lobster", "crayfish"],
  },
  { id: "eggs", code: "E", label: "Eggs", aliases: ["egg", "eggs"] },
  {
    id: "fish",
    code: "F",
    label: "Fish",
    aliases: ["fish", "salmon", "tuna", "cod", "sardine", "sardines", "anchovy", "anchovies"],
  },
  { id: "lupin", code: "L", label: "Lupin", aliases: ["lupin", "lupine"] },
  {
    id: "milk",
    code: "Mk",
    label: "Milk",
    aliases: ["milk", "dairy", "lactose", "cheese", "butter", "cream", "yogurt", "yoghurt"],
  },
  {
    id: "molluscs",
    code: "Mo",
    label: "Molluscs",
    aliases: ["mollusc", "molluscs", "mollusk", "mollusks", "mussel", "mussels", "clam", "clams", "oyster", "oysters", "scallop", "scallops", "squid", "octopus", "snail", "snails"],
  },
  { id: "mustard", code: "Mu", label: "Mustard", aliases: ["mustard"] },
  {
    id: "nuts",
    code: "N",
    label: "Nuts",
    aliases: [
      "nuts",
      "nut",
      "tree nuts",
      "tree nut",
      "nuts tree nuts",
      "almond",
      "almonds",
      "hazelnut",
      "hazelnuts",
      "walnut",
      "walnuts",
      "cashew",
      "cashews",
      "pecan",
      "pecans",
      "brazil",
      "brazil nut",
      "brazil nuts",
      "pistachio",
      "pistachios",
      "macadamia",
      "chestnut",
      "chestnuts",
    ],
  },
  {
    id: "peanuts",
    code: "P",
    label: "Peanuts",
    aliases: ["peanut", "peanuts", "groundnut", "groundnuts"],
  },
  { id: "sesame", code: "Se", label: "Sesame", aliases: ["sesame", "sesame seeds", "sesame seed"] },
  { id: "soya", code: "So", label: "Soya", aliases: ["soya", "soy", "soybean", "soybeans"] },
  {
    id: "sulphites",
    code: "SD",
    label: "Sulphites",
    aliases: ["sulphites", "sulfites", "sulphite", "sulfite", "sulphur dioxide", "sulfur dioxide", "so2"],
  },
]

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

function matchesColumn(allergenName: string, column: MatrixColumn) {
  const n = normalize(allergenName)
  if (!n) return false

  if (column.id === "nuts" && (n.includes("peanut") || n.includes("groundnut"))) {
    return false
  }

  if (column.aliases.includes(n)) return true

  if (column.id === "nuts") {
    if (n.includes("tree nut") || /(^| )nuts?( |$)/.test(n)) return true
  }
  if (column.id === "gluten" && n.includes("gluten")) return true
  if (column.id === "sulphites" && (n.includes("sulphit") || n.includes("sulfit") || n.includes("sulphur") || n.includes("sulfur"))) {
    return true
  }
  if (column.id === "sesame" && n.includes("sesame")) return true
  if (column.id === "crustaceans" && n.includes("crustacean")) return true
  if (column.id === "molluscs" && (n.includes("mollusc") || n.includes("mollusk"))) return true

  return false
}

export function buildAllergenMatrix(
  menuItems: { menuItemID: string; menuItemName: string; allergens: { allergenName: string }[] }[],
  extraAllergens: { name: string }[] = []
) {
  const unmatched = new Map<string, MatrixColumn>()

  const considerName = (name: string) => {
    if (!name.trim()) return
    if (UK_14.some((col) => matchesColumn(name, col))) return
    const id = `custom:${normalize(name)}`
    if (!unmatched.has(id)) {
      unmatched.set(id, {
        id,
        code: name.slice(0, 2).toUpperCase(),
        label: name,
        aliases: [normalize(name)],
        custom: true,
      })
    }
  }

  for (const item of menuItems) {
    for (const allergen of item.allergens || []) {
      considerName(allergen.allergenName)
    }
  }
  for (const allergen of extraAllergens) {
    considerName(allergen.name)
  }

  const columns = [...UK_14, ...Array.from(unmatched.values())]

  const rows: MatrixRow[] = [...menuItems]
    .sort((a, b) => a.menuItemName.localeCompare(b.menuItemName, "en-GB"))
    .map((item) => {
      const names = (item.allergens || []).map((a) => a.allergenName)
      const contains = columns
        .filter((col) => names.some((name) => matchesColumn(name, col)))
        .map((col) => col.id)
      return {
        id: item.menuItemID,
        name: item.menuItemName,
        contains,
      }
    })

  return { columns, rows }
}

export const MATRIX_ROWS_PER_PAGE = 22
