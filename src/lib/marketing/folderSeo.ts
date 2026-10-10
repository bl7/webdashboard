import type { Metadata } from "next"

const ORIGIN = "https://www.instalabel.co"

export const FOLDER_SEO = {
  "/features": {
    title: "Kitchen & Food Labelling Software Features | InstaLabel",
    description: "Create food labels from saved items, ingredients, allergens and date settings. Manage your allergen matrix and recurring cleaning tasks in the same dashboard.",
    keywords: ["kitchen labelling software features", "food labelling software for kitchens", "food label printing software", "restaurant labelling software"],
  },
  "/prep-labels": {
    title: "Prep Label Software for Restaurant Kitchens | InstaLabel",
    description: "Print the item name, preparation details, use-by information and saved allergens in a consistent format, ready for the next person who uses the food.",
    keywords: ["prep label software", "prep labels", "food prep labels", "restaurant prep labels"],
  },
  "/cooked-labels": {
    title: "Cooked Food Label Software & Date Labels | InstaLabel",
    description: "Label cooked sauces, fillings and other prepared food with the item name, cooking-stage details, use-by information and saved allergens.",
    keywords: ["cooked food labels", "cooked food label software", "cooked food date labels"],
  },
  "/defrost-labels": {
    title: "Defrost & Thaw Label Software for Kitchens | InstaLabel",
    description: "Identify the item and its defrost stage, then print the date information your kitchen uses for thawing and subsequent storage.",
    keywords: ["defrost labels", "thaw labels", "defrost label software", "defrost food labelling"],
  },
  "/opened-food-labels": {
    title: "Opened Food Label Software & Date Labels | InstaLabel",
    description: "Print an ingredient label for a pack you have opened. The date comes from the shelf-life days saved for that ingredient.",
    keywords: ["opened food labels", "opened product labels", "opened food date label software"],
  },
  "/use-first-labels": {
    title: "Use-First Labels for Kitchen Stock Rotation | InstaLabel",
    description: "Show your team which suitable item to use next with a clear use-first label, alongside its existing dates and storage information.",
    keywords: ["use first labels", "use first food labels", "FIFO kitchen labels", "stock rotation labels"],
  },
  "/expiry-date-labels": {
    title: "Expiry Date & Use-By Label Software for Kitchens | InstaLabel",
    description: "Print clear preparation, opening and use-by information from your saved date settings, so every shift can read the same format.",
    keywords: ["expiry date label software", "expiry date labels", "use by labels", "food date labelling software"],
  },
  "/ingredient-labels": {
    title: "Ingredient management for kitchens | InstaLabel",
    description: "Organise ingredients and menu items once, then use the saved information when you print labels or create an allergen matrix.",
    keywords: ["ingredient management for kitchens", "ingredient labels", "ingredient information software", "food ingredient labelling"],
  },
  "/natashas-law": {
    title: "PPDS & Natasha’s Law Label Software | InstaLabel",
    description: "Create labels for food packaged for direct sale, using your item name and ingredient list with allergens emphasised. Preview the label before printing.",
    keywords: ["PPDS labelling software", "PPDS labels", "Natasha’s Law labels", "Natasha’s Law label software"],
  },
  "/allergen-compliance": {
    title: "Food Allergen Labelling Software for UK Kitchens | InstaLabel",
    description: "Keep allergens with your ingredient and menu records, then use that information in kitchen labels, PPDS layouts and your allergen matrix.",
    keywords: ["food allergen labelling software", "allergen labelling", "food allergen labels", "allergen label software"],
  },
  "/allergen-matrix": {
    title: "Allergen Matrix Software & Printable PDF | InstaLabel",
    description: "Generate a printable PDF across the 14 regulated allergen categories using the ingredient and menu information saved for your labels.",
    keywords: ["allergen matrix software", "restaurant allergen matrix", "printable allergen matrix", "allergen matrix PDF"],
  },
  "/cleaning-checklists": {
    title: "Recurring Kitchen Cleaning Checklist Software | InstaLabel",
    description: "Set recurring daily, weekly and monthly cleaning tasks. Staff mark them done in the Android app, and you can review or print the checklist for that day.",
    keywords: ["kitchen cleaning checklist software", "restaurant cleaning schedule software", "recurring cleaning tasks"],
  },
  "/csv-import": {
    title: "CSV Ingredient & Menu Import for Kitchen Labels | InstaLabel",
    description: "Use CSV import to build your item records from a spreadsheet, then review the ingredients, allergens and date settings before printing.",
    keywords: ["CSV ingredient import", "menu data import", "ingredient CSV import", "food labelling CSV import"],
  },
  "/kitchen-label-printer": {
    title: "Kitchen Label Printer Guide: Desktop & Android | InstaLabel",
    description: "Compare the desktop and Android printing routes, supported models, label sizes and the equipment you need to print with InstaLabel.",
    keywords: ["kitchen label printer", "food label printer UK", "restaurant label printer", "kitchen printer software"],
  },
  "/printer-compatibility": {
    title: "InstaLabel Printer Compatibility: Windows, Mac & Android",
    description: "Choose your printing device and check the route it uses: Windows or macOS with PrintBridge, or Android with a supported Bluetooth printer.",
    keywords: ["InstaLabel printer compatibility", "MUNBYN RW411B InstaLabel", "Born4Ship DB403 InstaLabel", "Rongta RP425 InstaLabel"],
  },
  "/printbridge": {
    title: "Windows & Mac Kitchen Label Printing with PrintBridge | InstaLabel",
    description: "PrintBridge connects the InstaLabel browser workflow to a label printer installed on your computer, so you can select an item, preview and print.",
    keywords: ["Windows kitchen label printing", "Mac kitchen label printing", "InstaLabel PrintBridge", "desktop food label printing"],
  },
  "/mobile-app": {
    title: "Android Kitchen Label Printing App | InstaLabel",
    description: "Use the InstaLabel Android app with a supported Bluetooth label printer to select items, review label details and print at your kitchen station.",
    keywords: ["Android kitchen label printing app", "Android food label app", "Bluetooth kitchen label printing", "InstaLabel Android app"],
  },
  "/label-sizes": {
    title: "Supported Food Label Sizes: 60×40 & 56×80 mm | InstaLabel",
    description: "Choose between 60 × 40 mm and 56 × 80 mm InstaLabel layouts, then match the printer settings and physical stock to the size you select.",
    keywords: ["InstaLabel label sizes", "60x40 kitchen labels", "56x80 food labels", "PPDS label sizes"],
  },
  "/for/restaurants": {
    title: "Kitchen Labelling Software for Restaurants | InstaLabel",
    description: "Label sauces, fillings and prepared food so the next shift can identify the item, read its dates and find the ingredient information behind it.",
    keywords: ["kitchen labelling software for restaurants", "restaurant food labelling", "pub kitchen labelling software", "restaurant prep labels"],
  },
  "/for/cafes": {
    title: "Food Labelling Software for Cafés & Food to Go | InstaLabel",
    description: "Keep ingredient information behind your fillings, sandwiches and salad pots, then print the kitchen or PPDS label the job needs.",
    keywords: ["food labelling software for cafes", "cafe PPDS labels", "sandwich label software", "food to go labelling"],
  },
  "/for/takeaways": {
    title: "Kitchen Labelling Software for Takeaways | InstaLabel",
    description: "Print labels for prepared sauces, cooked food, opened ingredients and defrosting stock, with saved ingredient and allergen information behind each item.",
    keywords: ["kitchen labelling software for takeaways", "takeaway food labels", "takeaway prep labels", "takeaway allergen information"],
  },
  "/for/caterers": {
    title: "Kitchen Label Printing Software for Caterers | InstaLabel",
    description: "Print the quantity of prep, cooked or packed-food labels your catering job needs, using the saved information for each ingredient and menu item.",
    keywords: ["kitchen labelling software for caterers", "catering food labels", "bulk kitchen label printing", "catering allergen matrix"],
  },
  "/guides/ppds-labelling-requirements": {
    title: "PPDS Labelling Requirements & Natasha’s Law Guide | InstaLabel",
    description: "Understand which food may be prepacked for direct sale, what its ingredient label needs and how to review a finished pack.",
    keywords: ["PPDS labelling requirements", "Natasha’s Law requirements", "what must a PPDS label include"],
  },
  "/allergen-guide": {
    title: "The 14 Regulated Food Allergens: UK Reference | InstaLabel",
    description: "A reference for reviewing recipes, ingredient labels and menu information, with links to official guidance on naming, thresholds and exemptions.",
    keywords: ["14 food allergens UK", "14 allergens list", "UK food allergen categories"],
  },
  "/guides/use-by-vs-best-before": {
    title: "Use-By vs Best-Before Dates in Kitchen Labelling | InstaLabel",
    description: "Keep safety dates and quality dates distinct when reviewing supplier packs and setting your kitchen’s label information.",
    keywords: ["use by vs best before", "food date labels", "use by and best before difference"],
  },
  "/guides/fifo-food-storage": {
    title: "FIFO Food Storage & Kitchen Stock Rotation Guide | InstaLabel",
    description: "Combine readable dates, sensible shelf organisation and visible use-first cues so staff can follow your stock-rotation routine.",
    keywords: ["FIFO food storage", "kitchen stock rotation", "FIFO food labels", "use first stock rotation"],
  },
  "/haccp-labels": {
    title: "Kitchen Labelling & HACCP-Based Procedures | InstaLabel",
    description: "Labels help staff identify food and read its dates and ingredient information. They sit alongside the controls, checks and records your business uses to manage food safety.",
    keywords: ["kitchen labelling and HACCP", "HACCP food labels", "food safety labelling procedures"],
  },
  "/guides/food-labelling-checklist": {
    title: "Kitchen Food Labelling Checklist: Before You Print | InstaLabel",
    description: "Check the item information, date rule, label layout and physical output before you print a batch for the kitchen or a pack for sale.",
    keywords: ["kitchen food labelling checklist", "food label checks", "kitchen label printing checklist"],
  },
  "/guides/allergen-information-for-restaurants": {
    title: "Restaurant Allergen Information & Matrix Guide | InstaLabel",
    description: "Connect recipe records, supplier information, a reviewed matrix and staff communication so customer questions reach the right information.",
    keywords: ["allergen information for restaurants", "restaurant allergen matrix guidance", "restaurant allergen records"],
  },
  "/guides/handwritten-vs-printed-food-labels": {
    title: "Handwritten vs Printed Food Labels for Kitchens | InstaLabel",
    description: "Compare readability, repeated information, equipment and the effort of keeping item details current before choosing a labelling method.",
    keywords: ["handwritten vs printed food labels", "printed kitchen labels", "food labelling alternatives"],
  },
  "/guides/choosing-kitchen-labelling-software": {
    title: "How to Choose Kitchen Labelling Software | InstaLabel",
    description: "Compare label workflows, ingredient records, printer compatibility, setup and the complete ongoing cost using your own kitchen’s requirements.",
    keywords: ["how to choose kitchen labelling software", "best kitchen labelling software UK", "food labelling software comparison"],
  },
  "/": {
    title: "Kitchen Labelling Software for UK Food Businesses | InstaLabel",
    description: "Print clear kitchen labels from saved ingredients, allergens and date settings. Keep your allergen matrix and recurring cleaning tasks in the same dashboard.",
    keywords: ["kitchen labelling software", "food labelling software UK", "restaurant kitchen labels"],
  },
  "/uses": {
    title: "Kitchen food label types | InstaLabel",
    description: "Choose the workflow for the food you are preparing, cooking, opening, defrosting or packing. Use saved item information and print the quantity you need.",
    keywords: ["kitchen food label types", "prep cooked defrost labels", "food label workflows"],
  },
  "/for": {
    title: "Kitchen Labelling for Restaurants, Cafés & Caterers | InstaLabel",
    description: "See how InstaLabel fits restaurant, café, takeaway and catering preparation, with label examples and ingredient information for each setting.",
    keywords: ["InstaLabel for food businesses", "restaurant cafe takeaway catering labels"],
  },
  "/guides": {
    title: "Kitchen Labelling Guides, Templates & Setup Help | InstaLabel",
    description: "Find PPDS and allergen guides, printing setup help and practical notes for choosing labelling software.",
    keywords: ["InstaLabel resources", "kitchen labelling guides", "food labelling templates"],
  },
  "/tools": {
    title: "Free kitchen labelling tools | InstaLabel",
    description: "Build a manual allergen matrix and download the same PDF chart the dashboard generates. No account is required.",
    keywords: ["free kitchen labelling tools", "allergen matrix template", "allergen matrix PDF"],
  },
  "/plan": {
    title: "InstaLabel Pricing: £15.99/Month & 14-Day Trial",
    description: "One subscription for kitchen labels, ingredient and allergen information, an allergen matrix and recurring cleaning tasks. Start with a 14-day trial.",
    keywords: ["InstaLabel pricing", "kitchen labelling software price", "food labelling software trial"],
  },
  "/about": {
    title: "About InstaLabel | UK Kitchen Labelling Software",
    description: "InstaLabel helps UK food businesses create consistent labels from the ingredient, allergen and date information they already manage.",
    keywords: ["about InstaLabel", "InstaLabel UK", "InstaLabel Bournemouth"],
  },
  "/bookdemo": {
    title: "Book an InstaLabel Kitchen Labelling Demo",
    description: "Walk through the software, item information and printing route before choosing a setup. Bring a typical label job and your printer model if you have one.",
    keywords: ["InstaLabel demo", "kitchen labelling software demo"],
  },
  "/faqs": {
    title: "InstaLabel FAQs: Labels, Printers, Trial & Allergens",
    description: "The practical details about labels, ingredient information, printers, cleaning checklists and the 14-day trial.",
    keywords: ["InstaLabel FAQ", "InstaLabel printer trial labels allergens"],
  },
  "/tools/allergen-matrix": {
    title: "Free Allergen Matrix Template: Download PDF | InstaLabel",
    description: "Add your menu items, review the 14 allergen categories and record the result for each cell. Download the same allergen matrix PDF the dashboard generates.",
    keywords: ["free allergen matrix template", "printable allergen matrix", "restaurant allergen matrix worksheet"],
  },
  "/tools/restaurant-cleaning-checklist": {
    title: "Kitchen cleaning checklists in the InstaLabel app | InstaLabel",
    description: "Set daily, weekly and monthly cleaning tasks in InstaLabel. Staff mark them done in the Android app, and the day's checklist can be reviewed from the account.",
    keywords: ["kitchen cleaning checklist software", "restaurant cleaning schedule software", "recurring cleaning tasks"],
  },
} as const

export type FolderSeoPath = keyof typeof FOLDER_SEO

export function folderMetadata(path: FolderSeoPath, imageAlt: string): Metadata {
  const row = FOLDER_SEO[path]
  const url = path === "/" ? ORIGIN : ORIGIN + path
  return {
    title: { absolute: row.title },
    description: row.description,
    keywords: [...row.keywords],
    openGraph: {
      title: row.title,
      description: row.description,
      url,
      type: "website",
      images: [{ url: ORIGIN + "/opengraph-image.png", width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: row.title,
      description: row.description,
      images: [ORIGIN + "/opengraph-image.png"],
    },
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
  }
}
