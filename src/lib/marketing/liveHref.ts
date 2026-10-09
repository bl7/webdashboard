/** Source-folder paths that this site already owns under a live URL. */
const ALIAS: Record<string, string> = {
  "/allergen-labelling": "/allergen-compliance",
  "/food-allergen-labels": "/allergen-compliance",
  "/guides/14-food-allergens": "/allergen-guide",
  "/uk-14-allergens": "/allergen-guide",
  "/guides/kitchen-labelling-haccp": "/haccp-labels",
  "/app": "/mobile-app",
  "/faq": "/faqs",
  "/getting-started": "/bookdemo",
  "/contact": "/about#contact",
  "/resources": "/guides",
  "/dissolvable-labels": "/dissolvable-kitchen-labels",
}

export function liveHref(href: string) {
  if (href.startsWith("http")) return href
  const [path, hash] = href.split("#")
  const mapped = ALIAS[path] ?? path
  if (mapped.includes("#")) return mapped
  return hash ? `${mapped}#${hash}` : mapped
}
