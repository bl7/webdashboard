export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.instalabel.co.app"

export const ANDROID_PRINTERS = ["MUNBYN RW411B", "Born4Ship DB403", "Rongta RP425"] as const

export function formatAndroidPrinters(conjunction: "and" | "or" = "or") {
  const names = [...ANDROID_PRINTERS]
  if (names.length <= 1) return names[0] ?? ""
  return `${names.slice(0, -1).join(", ")} ${conjunction} ${names[names.length - 1]}`
}

export const TRIAL_PERIOD_DAYS = 14

export const CONTACT = {
  location: "Bournemouth, England",
  email: "contact@instalabel.co",
  phoneDisplay: "+44 7845 447586",
  phoneHref: "tel:+447845447586",
  whatsapp: "https://wa.me/447845447586",
} as const

export const PRODUCT_NAV = [
  { label: "All features", href: "/features" },
  { label: "Label workflows", href: "/uses" },
  { label: "Allergen matrix", href: "/allergen-matrix" },
  { label: "Cleaning checklists", href: "/cleaning-checklists" },
  { label: "Printer compatibility", href: "/printer-compatibility" },
  { label: "Desktop printing", href: "/printbridge" },
  { label: "Android app", href: "/mobile-app" },
] as const

export const BUSINESS_NAV = [
  { label: "Restaurants and pubs", href: "/for/restaurants" },
  { label: "Cafés and food to go", href: "/for/cafes" },
  { label: "Takeaways", href: "/for/takeaways" },
  { label: "Caterers", href: "/for/caterers" },
] as const

export const RESOURCES_NAV = [
  { label: "Guides and setup help", href: "/guides" },
  { label: "Free tools and templates", href: "/tools" },
  { label: "Choosing software", href: "/guides/choosing-kitchen-labelling-software" },
  { label: "Getting started", href: "/bookdemo" },
  { label: "Frequently asked questions", href: "/faqs" },
  { label: "Allergen guide", href: "/allergen-guide" },
  { label: "PPDS labels", href: "/natashas-law" },
  { label: "Blog", href: "/blog" },
] as const

export const WORKFLOW_NAV = [
  { label: "All workflows", href: "/uses" },
  { label: "Ingredient", href: "/ingredient-labels" },
  { label: "Prep", href: "/prep-labels" },
  { label: "Use first", href: "/use-first-labels" },
  { label: "Cooked", href: "/cooked-labels" },
  { label: "Defrost", href: "/defrost-labels" },
  { label: "Expiry date", href: "/expiry-date-labels" },
  { label: "Opened food", href: "/opened-food-labels" },
  { label: "PPDS labels", href: "/natashas-law" },
] as const

export const FOOTER_PRODUCT = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/plan" },
  { label: "Christmas offer", href: "/christmas" },
  { label: "PrintBridge", href: "/printbridge" },
  { label: "Android app", href: "/mobile-app" },
  { label: "Printer compatibility", href: "/printer-compatibility" },
  { label: "Printer buying guide", href: "/kitchen-label-printer" },
  { label: "Label sizes", href: "/label-sizes" },
  { label: "CSV import", href: "/csv-import" },
] as const

export const FOOTER_RESOURCES = [
  { label: "Allergen labelling", href: "/allergen-compliance" },
  { label: "Allergen matrix", href: "/allergen-matrix" },
  { label: "Allergen guide", href: "/allergen-guide" },
  { label: "HACCP and labelling", href: "/haccp-labels" },
  { label: "Label materials", href: "/dissolvable-kitchen-labels" },
  { label: "Compare labelling methods", href: "/label-printer-uk-comparison" },
  { label: "Cleaning checklists", href: "/cleaning-checklists" },
  { label: "Practical guides", href: "/guides" },
  { label: "PPDS labelling requirements", href: "/guides/ppds-labelling-requirements" },
  { label: "Choosing labelling software", href: "/guides/choosing-kitchen-labelling-software" },
  { label: "Free tools", href: "/tools" },
  { label: "Free allergen matrix", href: "/tools/allergen-matrix" },
  { label: "Restaurants", href: "/for/restaurants" },
  { label: "Cafés", href: "/for/cafes" },
  { label: "Takeaways", href: "/for/takeaways" },
  { label: "Caterers", href: "/for/caterers" },
  { label: "Blog", href: "/blog" },
  { label: "FAQs", href: "/faqs" },
] as const

export const FOOTER_COMPANY = [
  { label: "About", href: "/about" },
  { label: "Book a demo", href: "/bookdemo" },
  { label: "Contact", href: "/about#contact" },
] as const

export const LEGAL_NAV = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Terms of Service", href: "/terms" },
] as const
