/**
 * Second pass: leftover purple/pink classes in marketing files.
 */
const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const DIRS = [
  path.join(ROOT, "src/components/blocks"),
  path.join(ROOT, "src/app/(web)"),
  path.join(ROOT, "src/app/blog"),
]
const EXTRA = [path.join(ROOT, "src/components/Chatbot.tsx")]
const SKIP = /node_modules|[\\/]\.next[\\/]|[\\/]dashboard[\\/]|marketing\.css$/

const REPLACEMENTS = [
  ["bg-gradient-to-br from-purple-600 via-purple-700 to-mkt-ink8", "text-white"],
  ["bg-gradient-to-br from-purple-50 via-pink-50 to-white", "bg-mkt-canvas"],
  ["bg-gradient-to-br from-purple-50 to-blue-50", "bg-mkt-canvas"],
  ["bg-gradient-to-br from-gray-50 via-white to-purple-50", "bg-mkt-canvas"],
  ["bg-gradient-to-br from-gray-50 via-white to-purple-50/30", "bg-mkt-canvas"],
  ["bg-gradient-to-tl from-purple-50 via-white to-mkt-canvas", "bg-mkt-canvas"],
  ["bg-gradient-to-br from-purple-50/30 via-white to-mkt-canvas/30", "bg-mkt-canvas"],
  ["bg-gradient-to-r from-purple-50 to-purple-100", "bg-mkt-canvas"],
  ["bg-gradient-to-br from-purple-50 to-purple-100", "bg-mkt-canvas"],
  ["bg-gradient-to-r from-blue-50 to-purple-50", "bg-mkt-canvas"],
  ["bg-gradient-to-r from-blue-100 to-purple-100", "bg-mkt-canvas"],
  ["bg-gradient-to-r from-purple-500 to-purple-600", "text-white"],
  ["bg-gradient-to-r from-pink-300 to-purple-300", "text-white"],
  ["bg-gradient-to-r from-purple-600/20 to-mkt-ink8/20", "bg-mkt-steel1/40"],
  ["bg-gradient-to-r from-blue-600/20 to-purple-600/20", "bg-mkt-steel1/40"],
  ["bg-gradient-to-br from-purple-600/5 to-mkt-ink8/5", "bg-mkt-canvas"],
  ["bg-gradient-to-b from-blue-200 via-green-200 to-purple-200", "bg-mkt-steel1"],
  ["from-purple-500 to-mkt-canvas0", "from-mkt-ink to-mkt-teal"],
  ["bg-purple-400 opacity-20", "bg-mkt-steel1 opacity-60"],
  ["bg-pink-300 opacity-20", "bg-mkt-canvas opacity-80"],
  ["bg-pink-300 opacity-5", "bg-mkt-canvas opacity-80"],
  ["rounded-full bg-pink-200/30", "rounded-full bg-mkt-steel1/40"],
  ["rounded-full bg-pink-200/20", "rounded-full bg-mkt-steel1/30"],
  ["rounded-full bg-pink-400", "rounded-full bg-mkt-teal"],
  ["rounded-full bg-purple-400", "rounded-full bg-mkt-ink"],
  ["ring-1 ring-purple-100", "ring-1 ring-mkt-steel1"],
  ["text-purple-100", "text-white/80"],
  ["text-purple-200", "text-white/70"],
  ["text-purple-900", "text-mkt-ink"],
  ["bg-purple-300", "bg-mkt-steel1"],
  ["color: \"purple\"", "color: \"teal\""],
  ["color: \"purple\"", "color: \"teal\""],
]

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (SKIP.test(full.replace(/\\/g, "/"))) continue
    if (entry.isDirectory()) walk(full, acc)
    else if (/\.(tsx|ts)$/.test(entry.name)) acc.push(full)
  }
  return acc
}

const files = DIRS.flatMap((d) => walk(d)).concat(EXTRA.filter((f) => fs.existsSync(f)))
let changed = 0
for (const file of files) {
  let src = fs.readFileSync(file, "utf8")
  const orig = src
  for (const [from, to] of REPLACEMENTS) src = src.split(from).join(to)
  if (src !== orig) {
    fs.writeFileSync(file, src)
    changed++
    console.log("updated", path.relative(ROOT, file))
  }
}
console.log("files changed:", changed)
