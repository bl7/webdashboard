/**
 * Recolour marketing pages to Scheme A. Does not touch dashboard, auth, billing, or button.tsx.
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const DIRS = [
  path.join(ROOT, "src/components/blocks"),
  path.join(ROOT, "src/app/(web)"),
  path.join(ROOT, "src/app/blog"),
]
const EXTRA_FILES = [path.join(ROOT, "src/components/Chatbot.tsx")]

const SKIP = /node_modules|[\\/]\.next[\\/]|[\\/]dashboard[\\/]|[\\/]bossdashboard[\\/]|[\\/]\(auth\)[\\/]|button\.tsx$/

/** Most-specific first. Colours only. */
const REPLACEMENTS = [
  ["bg-gradient-to-br from-purple-50 via-white to-pink-50", "bg-mkt-canvas"],
  ["bg-gradient-to-br from-purple-100 via-purple-50 to-pink-50", "bg-mkt-canvas"],
  ["bg-gradient-to-r from-purple-50 to-pink-50", "bg-mkt-canvas"],
  ["bg-gradient-to-br from-purple-50 to-pink-50", "bg-mkt-canvas"],
  ["bg-gradient-to-r from-purple-600 to-pink-600", "text-white"],
  ["bg-gradient-to-br from-purple-600 to-pink-600", "text-white"],
  ["bg-gradient-to-r from-purple-700 to-pink-600", "text-mkt-ink"],
  ["hover:from-purple-700 hover:to-pink-700", "hover:opacity-90"],
  ["from-purple-600 to-pink-600", "from-mkt-ink to-mkt-ink8"],
  ["from-purple-700 to-pink-600", "from-mkt-ink to-mkt-ink8"],
  ["from-purple-700 to-pink-700", "from-mkt-ink to-mkt-ink8"],
  ["from-blue-600 to-purple-600", "from-mkt-ink to-mkt-ink8"],
  ["bg-gradient-to-r from-purple-100 to-pink-100", "bg-mkt-canvas"],
  ["bg-gradient-to-br from-purple-100 to-pink-100", "bg-mkt-canvas"],
  ["from-purple-100 to-pink-100", "from-mkt-canvas to-mkt-teal1"],
  ["bg-purple-400 opacity-15", "bg-mkt-steel1 opacity-60"],
  ["bg-purple-400 opacity-10", "bg-mkt-steel1 opacity-50"],
  ["bg-purple-400 opacity-5", "bg-mkt-steel1 opacity-40"],
  ["bg-purple-600 opacity-15", "bg-mkt-ink opacity-10"],
  ["bg-pink-300 opacity-15", "bg-mkt-canvas opacity-80"],
  ["bg-pink-300 opacity-10", "bg-mkt-canvas opacity-80"],
  ["bg-purple-600", "bg-mkt-ink"],
  ["bg-purple-700", "bg-mkt-ink"],
  ["bg-purple-800", "bg-mkt-ink8"],
  ["bg-purple-900", "bg-mkt-ink"],
  ["bg-purple-950", "bg-mkt-ink"],
  ["bg-purple-50", "bg-mkt-canvas"],
  ["bg-purple-100", "bg-mkt-canvas"],
  ["bg-purple-200", "bg-mkt-steel1"],
  ["hover:bg-purple-700", "hover:bg-mkt-ink8"],
  ["hover:bg-purple-600", "hover:bg-mkt-ink"],
  ["hover:bg-purple-100", "hover:bg-mkt-canvas"],
  ["hover:bg-purple-50", "hover:bg-mkt-canvas"],
  ["text-purple-800", "text-mkt-ink"],
  ["text-purple-700", "text-mkt-ink"],
  ["text-purple-600", "text-mkt-teal"],
  ["text-purple-500", "text-mkt-teal"],
  ["text-purple-400", "text-mkt-teal1"],
  ["text-purple-300", "text-[#E4F1EE]"],
  ["hover:text-purple-800", "hover:text-mkt-ink"],
  ["hover:text-purple-700", "hover:text-mkt-teal"],
  ["hover:text-purple-600", "hover:text-mkt-teal"],
  ["hover:text-purple-300", "hover:text-[#E4F1EE]"],
  ["border-purple-600", "border-mkt-ink"],
  ["border-purple-500", "border-mkt-ink"],
  ["border-purple-400", "border-mkt-steel1"],
  ["border-purple-300", "border-mkt-steel1"],
  ["border-purple-200", "border-mkt-steel1"],
  ["border-purple-100", "border-mkt-steel1"],
  ["hover:border-purple-400", "hover:border-mkt-ink"],
  ["hover:border-purple-300", "hover:border-mkt-ink"],
  ["ring-purple-500", "ring-mkt-ink"],
  ["ring-purple-400", "ring-mkt-ink"],
  ["ring-purple-200", "ring-mkt-steel1"],
  ["ring-1 ring-purple-200", "ring-1 ring-mkt-steel1"],
  ["from-purple-400", "from-mkt-steel1"],
  ["via-purple-200", "via-mkt-steel1"],
  ["via-purple-50", "via-white"],
  ["to-pink-50", "to-mkt-canvas"],
  ["to-pink-100", "to-mkt-canvas"],
  ["to-pink-600", "to-mkt-ink8"],
  ["bg-pink-50", "bg-mkt-canvas"],
  ["bg-pink-100", "bg-mkt-canvas"],
  ["text-pink-600", "text-mkt-teal"],
  ["text-pink-700", "text-mkt-ink"],
  ["shadow-purple-500/25", "shadow-sm"],
  ["shadow-purple-200", "shadow-sm"],
  ["focus:text-purple-600", "focus:text-mkt-teal"],
  ["focus:ring-purple-500", "focus:ring-mkt-ink"],
  ["focus:ring-purple-400", "focus:ring-mkt-ink"],
]

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (SKIP.test(full.replace(/\\/g, "/"))) continue
    if (entry.isDirectory()) walk(full, acc)
    else if (/\.(tsx|ts|css)$/.test(entry.name)) acc.push(full)
  }
  return acc
}

const files = DIRS.flatMap((d) => walk(d)).concat(EXTRA_FILES.filter((f) => fs.existsSync(f)))
let changed = 0
for (const file of files) {
  let src = fs.readFileSync(file, "utf8")
  const orig = src
  for (const [from, to] of REPLACEMENTS) {
    if (src.includes(from)) src = src.split(from).join(to)
  }
  if (src !== orig) {
    fs.writeFileSync(file, src)
    changed++
    console.log("updated", path.relative(ROOT, file))
  }
}
console.log("files changed:", changed)
