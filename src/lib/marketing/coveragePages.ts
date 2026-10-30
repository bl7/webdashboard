export type CoverageSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
  links?: { href: string; label: string }[]
  table?: { headers: string[]; rows: string[][] }
}

export type CoveragePage = {
  path: string
  title: string
  description: string
  h1: string
  lead: string
  badge: string
  sections: CoverageSection[]
  faqs?: { question: string; answer: string }[]
  sources?: { name: string; url: string }[]
  related: { href: string; label: string }[]
}

const OFFER =
  "The standing price is £15.99 a month. Until 10 January 2027, new customers get 60 days free, and an annual plan also gets 30% off the first annual payment."

const FSA_PPDS = {
  name: "Food Standards Agency: PPDS labelling guidance",
  url: "https://www.gov.uk/government/publications/labelling-guidance-for-prepacked-for-direct-sale-ppds-food-products/labelling-guidance-for-prepacked-for-direct-sale-ppds-food-products",
}
const FSA_ALLERGENS = {
  name: "Food Standards Agency: allergen guidance for food businesses",
  url: "https://www.gov.uk/government/publications/allergen-guidance-for-food-businesses",
}
const GOV_DATES = {
  name: "GOV.UK: best before and use-by dates",
  url: "https://www.gov.uk/understanding-food-labelling/best-before-and-use-by-dates",
}
const FSA_SAFETY = {
  name: "Food Standards Agency: managing food safety",
  url: "https://www.gov.uk/government/publications/managing-food-safety/managing-food-safety",
}

function page(entry: CoveragePage) {
  return entry
}

export const coveragePages: CoveragePage[] = [
  page({
    path: "/for",
    badge: "Food businesses",
    title: "Kitchen labelling for restaurants, cafés, takeaways and caterers.",
    description:
      "See how InstaLabel fits restaurant, café, takeaway and catering preparation, with the label workflows each setting uses.",
    h1: "Kitchen labelling for the food your business prepares.",
    lead: "See how InstaLabel fits restaurant, café, takeaway and catering preparation, with label examples and ingredient information for each setting.",
    sections: [
      {
        heading: "Start with your daily preparation",
        paragraphs: [
          "The right setup depends on what you label, how you prepare it and how it is sold. These pages help you choose the workflow and printing route.",
        ],
      },
    ],
    related: [
      { href: "/for/restaurants", label: "Restaurants" },
      { href: "/for/cafes", label: "Cafés and food to go" },
      { href: "/for/takeaways", label: "Takeaways" },
      { href: "/for/caterers", label: "Caterers" },
    ],
  }),
  page({
    path: "/for/restaurants",
    badge: "Restaurants",
    title: "Kitchen labelling software for restaurants.",
    description:
      "Print consistent prep and service labels from saved item information.",
    h1: "Consistent food labels for restaurant prep and service.",
    lead: "Restaurants and pubs use one account for sauces, fillings and prepared food. The next shift can identify the item, read its dates and open the ingredient information behind the label.",
    sections: [
      {
        heading: "Give the next shift the same information",
        paragraphs: [
          "Restaurant and pub kitchens often prepare food ahead of a service or across several shifts. Use saved items and a consistent prep label so staff can distinguish batches without interpreting different handwriting.",
        ],
      },
      {
        heading: "Label the stage the food has reached",
        paragraphs: [
          "A cooked sauce uses a cooked label. A defrosting item uses the defrost label. An opened supplier pack uses an ingredient label. Set the date from the shelf-life days saved for that item.",
        ],
      },
      {
        heading: "Keep the menu’s allergen information organised",
        paragraphs: [
          "Connect ingredients to menu items and use the records to create an allergen matrix. Keep the current matrix available to the people answering customer questions, alongside your cross-contact procedures.",
        ],
      },
      {
        heading: "Put cleaning on a recurring schedule",
        paragraphs: [
          "Create daily, weekly, monthly or one-off tasks for the areas your team cleans. Staff record completion in the Android app, and you can review the checklist for the day.",
        ],
      },
      {
        heading: "Test one station before rolling it out",
        paragraphs: [
          "Use a typical sauce or prepared dish in your trial. Check the printer route, label stock, preview and physical output, then let the next shift use the same saved item.",
        ],
      },
    ],
    related: [
      { href: "/prep-labels", label: "Prep labels" },
      { href: "/cooked-labels", label: "Cooked food labels" },
      { href: "/allergen-matrix", label: "Allergen matrix" },
      { href: "/cleaning-checklists", label: "Cleaning checklists" },
      { href: "/temperature-records", label: "Temperature records" },
      { href: "/opening-closing-checks", label: "Opening and closing checks" },
    ],
  }),
  page({
    path: "/for/cafes",
    badge: "Cafés",
    title: "Food labelling software for cafés and food to go.",
    description:
      "Food labelling software for cafés covers kitchen prep and packed-food labels, including sandwiches and other food packed ahead.",
    h1: "Kitchen prep and packed-food labels for cafés.",
    lead: "Cafés and food-to-go counters keep ingredient information for fillings, sandwiches and salad pots, then print the kitchen or packed-food label that job needs.",
    sections: [
      {
        heading: "Label ingredients prepared before opening",
        paragraphs: [
          "Use prep labels for fillings, sauces and other food made ahead of service. For a supplier pack you have opened, print an ingredient label. There is no separate opened label type.",
        ],
      },
      {
        heading: "Create labels for food packed ahead",
        paragraphs: [
          "Sandwiches or salad pots packed before a customer chooses them may fall under PPDS requirements, depending on how they are made and sold. Save the full recipe and use the PPDS workflow for applicable products.",
        ],
        links: [{ href: "/guides/ppds-labelling-requirements", label: "Read the PPDS requirements guide" }],
      },
      {
        heading: "Check compound ingredients in bought-in products",
        paragraphs: [
          "Bread, dressings and spreads can contain ingredients that need to appear in the finished product’s information. Review the actual supplier pack and keep that information connected to the menu item.",
        ],
      },
      {
        heading: "Use the matrix for menu information",
        paragraphs: [
          "Generate an allergen matrix from your saved items and review it with the team. Keep it current when fillings or suppliers change.",
        ],
      },
      {
        heading: "Try your longest ingredient list",
        paragraphs: [
          "A short prep label and a packed sandwich label make a useful first test pair. Print both on the proposed stock and check readability before producing a batch.",
        ],
      },
    ],
    related: [
      { href: "/natashas-law", label: "PPDS labels" },
      { href: "/opened-food-labels", label: "Opened food labels" },
      { href: "/allergen-matrix", label: "Allergen matrix" },
      { href: "/for/takeaways", label: "Takeaways" },
    ],
  }),
  page({
    path: "/for/takeaways",
    badge: "Takeaways",
    title: "Kitchen labelling software for takeaways.",
    description:
      "Print prep, cooked, defrost and ingredient labels for the food behind each order.",
    h1: "Clear labels for the prep behind every takeaway order.",
    lead: "Takeaway kitchens print labels for the sauces, cooked food, opened ingredients and defrosting stock behind each order, using the ingredient and allergen records already saved.",
    sections: [
      {
        heading: "Keep the preparation line easy to identify",
        paragraphs: [
          "Prepared fillings, sauces and toppings can change hands during a busy service. Use the saved item name and prep details so each container stays readable.",
        ],
      },
      {
        heading: "Distinguish cooked, opened and defrosted food",
        paragraphs: [
          "Use a cooked label for cooked food, the defrost label for food leaving the freezer, and an ingredient label for a pack you have opened. Check the saved date and print for that batch.",
        ],
      },
      {
        heading: "Organise the allergens in sauces and marinades",
        paragraphs: [
          "Compound ingredients can make menu information harder to maintain. Keep the supplier details and recipe current, then review the resulting labels and matrix when a substitution is made.",
        ],
      },
      {
        heading: "Separate kitchen labels from customer pack labels",
        paragraphs: [
          "Food prepared or packed after a customer orders it is a different selling arrangement from food packaged before selection. Check which information requirements apply before choosing a PPDS workflow.",
        ],
      },
    ],
    related: [
      { href: "/prep-labels", label: "Prep labels" },
      { href: "/defrost-labels", label: "Defrost labels" },
      { href: "/allergen-compliance", label: "Allergen labelling" },
      { href: "/guides/allergen-information-for-restaurants", label: "Restaurant allergen information" },
    ],
  }),
  page({
    path: "/for/caterers",
    badge: "Caterers",
    title: "Kitchen label printing software for caterers.",
    description:
      "Print batch food labels from saved ingredients, with a matrix the event team can review.",
    h1: "Batch food labels for catering preparation.",
    lead: "Caterers print the quantity of prep, cooked or packed-food labels a job needs, then review the event menu from the same saved records.",
    sections: [
      {
        heading: "Print for several containers in one job",
        paragraphs: [
          "Set the label quantity for a prepared batch. Use a clear item name and the correct stage so your team can identify the food during storage and handover.",
        ],
      },
      {
        heading: "Prepare menu information before the event",
        paragraphs: [
          "Review the event recipes and supplier information in advance. The saved items can feed kitchen labels and an allergen matrix.",
        ],
      },
      {
        heading: "Check how packed food will be sold",
        paragraphs: [
          "Catering can involve on-site service, delivery, distance orders or packaged products. Those arrangements can have different food-information requirements.",
        ],
      },
      {
        heading: "Keep transport and handling controls alongside labels",
        paragraphs: [
          "A label identifies the item and its date. Temperature checks for equipment, food and deliveries are recorded in the compliance diary, separate from the label.",
        ],
      },
    ],
    related: [
      { href: "/prep-labels", label: "Prep labels" },
      { href: "/natashas-law", label: "PPDS labels" },
      { href: "/allergen-matrix", label: "Allergen matrix" },
      { href: "/printer-compatibility", label: "Printer compatibility" },
    ],
  }),
  page({
    path: "/opened-food-labels",
    badge: "Opened food labels",
    title: "Ingredient labels for food you have opened.",
    description:
      "Print an ingredient label for a pack you have opened. The date comes from the shelf-life days saved for that ingredient.",
    h1: "Label an opened pack with an ingredient label.",
    lead: "There is no separate opened label type. Select the ingredient, check the date from the shelf-life days you saved, and print.",
    sections: [
      {
        heading: "Record the opening of the actual pack",
        paragraphs: [
          "Cream, sauces and other bought-in products can have instructions that apply after opening. Select that ingredient and print an ingredient label.",
        ],
      },
      {
        heading: "Keep the supplier instructions with your decision",
        paragraphs: [
          "Review the original pack’s use-by date, storage conditions and after-opening instructions. Opening a product does not reset its original expiry date.",
        ],
      },
      {
        heading: "Label decanted food clearly",
        paragraphs: [
          "If your procedure allows the food to move to another container, label the new container with the right item and opening details.",
        ],
      },
      {
        heading: "Give the next shift a readable reference",
        paragraphs: [
          "Use the same label format across opened products. Print the required quantity, check the physical result and apply it to the correct pack or container.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I replace the manufacturer’s use-by date?",
        answer:
          "Keep the original date and instructions when you set the shelf-life days. The ingredient label uses those saved days. It does not replace the manufacturer’s date.",
      },
    ],
    related: [
      { href: "/expiry-date-labels", label: "Expiry date labels" },
      { href: "/ingredient-labels", label: "Ingredient labels" },
      { href: "/guides/use-by-vs-best-before", label: "Use-by and best-before dates" },
      { href: "/guides/food-labelling-checklist", label: "Food labelling checklist" },
    ],
  }),
  page({
    path: "/cleaning-checklists",
    badge: "Cleaning checklists",
    title: "Kitchen cleaning rota app for restaurants.",
    description:
      "Run a kitchen cleaning rota in the Android app. Set daily, weekly, monthly or one-off tasks. Staff finish them with their name and a photo, and you can print that day’s checklist.",
    h1: "A kitchen cleaning rota your team finishes on the phone.",
    lead: "Set each task by area, how often it repeats, and the time it is due. Staff finish it on the phone with their name and a photo of the work. You can open that day’s checklist or print it.",
    sections: [
      {
        heading: "A task for the job, not a blank form",
        paragraphs: [
          "Group tasks by area, such as the kitchen, bar or dining room. Choose daily, weekly or monthly, or a one-off for a job that should not come back.",
          "A weekly task runs on the days you pick. If a monthly date does not exist, it runs on the last day of that month. A one-off appears on the day you choose and leaves the working list once it is done. The diary still keeps who finished it.",
        ],
      },
      {
        heading: "Staff finish it during the shift",
        paragraphs: [
          "On the Android app they open the tasks that are due, choose their name, and take a photo of the finished work. An overdue task stays on the list until that duty is done.",
          "The photo is kept for seven days. The completion, the name and the time stay in the diary after the photo has gone.",
        ],
      },
      {
        heading: "See one day, then print it",
        paragraphs: [
          "The dashboard opens one day at a time, up to today. You can see what was done, what was missed, and what is still open, then download that day’s checklist as a PDF.",
        ],
      },
      {
        heading: "One email when the day should be closed",
        paragraphs: [
          "If the end-of-day email is on, one message is sent at the time the kitchen chooses, in its own timezone. It lists cleaning tasks, checklist lines and temperatures still not done, and attaches that day’s diary.",
        ],
      },
      {
        heading: "The method still belongs to the kitchen",
        paragraphs: [
          "A completion records that a named person marked the task done. It does not choose the chemical, dilution or contact time, and it does not certify the kitchen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does the cleaning checklist record temperatures?",
        answer:
          "No. Cleaning tasks are separate from temperature checks and from the opening and closing lines. The diary and the end-of-day email can include all three.",
      },
      {
        question: "Can a one-off task be used for a deep clean?",
        answer:
          "Yes. Choose Once and the day it should appear. It shows on the phone that day. When someone completes it, it leaves the working list and stays in the diary.",
      },
      {
        question: "Can the checklist be printed?",
        answer: "Yes. You can download the checklist for a day as a PDF and print it.",
      },
    ],
    related: [
      { href: "/temperature-records", label: "Temperature records" },
      { href: "/opening-closing-checks", label: "Opening and closing checks" },
      { href: "/mobile-app", label: "Android app" },
      { href: "/features", label: "Features" },
    ],
  }),
  page({
    path: "/temperature-records",
    badge: "Temperature records",
    title: "Fridge temperature log app for restaurants.",
    description:
      "Keep a fridge temperature log on the phone, with food and delivery readings on the same screen. Staff see the accepted range, and a reading outside the limit needs a note of what was done.",
    h1: "A fridge temperature log, taken on the phone.",
    lead: "Set the equipment and the limits your kitchen uses. Staff enter the reading during the shift, with the accepted range on screen. A reading outside the limit is marked, and they record what they did. The day’s temperatures stay in the diary.",
    sections: [
      {
        heading: "The units the restaurant already checks",
        paragraphs: [
          "Add each fridge, walk-in, display or sandwich unit, freezer, or other cabinet. Set how many times a day it is checked. You can set an operating target and a critical limit, or leave them blank and use the safe-method defaults.",
          "A fridge starts at twice a day. A freezer starts at once a day. On a display or sandwich unit, the cabinet is one check and each item of food on it is probed on its own.",
        ],
      },
      {
        heading: "Cooking, cooling, hot holding and deliveries",
        paragraphs: [
          "Staff can record cooking, reheating, hot holding and cooling, and the temperature of a chilled or frozen delivery. The phone shows the accepted range for the method you have set, while they enter the number.",
          "Cooling can be a blast chiller, shallow containers, an ice bath, or another method you choose. The check uses the time and final temperature set for that method.",
        ],
      },
      {
        heading: "A reading outside the limit is not left blank",
        paragraphs: [
          "A reading warmer than the critical limit is marked as failed. Staff then record what was done, such as food moved or discarded, the equipment adjusted, an engineer contacted, or the temperature rechecked.",
          "A reading warmer than the operating target, but still within the critical limit, is marked for attention. The record does not decide that the food was cooked safely. Your business sets the limits and remains responsible for the action.",
        ],
      },
      {
        heading: "The probe is checked as well",
        paragraphs: [
          "Each probe can be checked on its own interval. Staff record an ice reading and a boiling-water reading, with the accepted range shown above the keypad.",
        ],
      },
      {
        heading: "What a manager can see the same day",
        paragraphs: [
          "The dashboard shows today’s temperatures and which checks are still to record. The diary PDF brings those readings together with the opening and closing lines, the cleaning record, corrective actions and the manager sign-off.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does this replace a paper temperature log?",
        answer:
          "It keeps the readings your staff enter, with the limit that applied and what was done if a reading failed. Your business still decides the safe methods and trains the people who take the readings.",
      },
      {
        question: "Are temperature checks the same as cleaning tasks?",
        answer:
          "No. They are separate lists. A fridge check does not mark a cleaning task done, and a finished cleaning task does not record a temperature.",
      },
    ],
    related: [
      { href: "/opening-closing-checks", label: "Opening and closing checks" },
      { href: "/cleaning-checklists", label: "Cleaning checklists" },
      { href: "/mobile-app", label: "Android app" },
      { href: "/features", label: "Features" },
    ],
  }),
  page({
    path: "/opening-closing-checks",
    badge: "Opening and closing",
    title: "Opening and closing checks for restaurants.",
    description:
      "Run opening and closing checks on the phone. A line that is not done needs a note, and a supervisor can sign the day off in the same diary.",
    h1: "Opening and closing checks the team tick on the phone.",
    lead: "A new account starts with common opening and closing lines. Add, rewrite or retire any line so it matches the restaurant. Staff tick them before service and at the end of the night. A line that is not done needs a note of what they did.",
    sections: [
      {
        heading: "Lines for the start and the end of service",
        paragraphs: [
          "Opening lines cover the checks before food is served, such as fridges and freezers working, staff fit for work, and hand-wash supplies in place. Closing lines cover the end of the night, such as food put away, waste removed, and surfaces cleaned.",
          "Those starting lines are a list you can change. They are not a complete set of legal requirements, and they are not a substitute for the rest of your food-safety procedures.",
        ],
      },
      {
        heading: "Done, or a note of what was done instead",
        paragraphs: [
          "On the Android app, staff tick each line. If a line is not done, they record what they did about it. The manager can see which lines are still open before the day is signed off.",
        ],
      },
      {
        heading: "A supervisor signs the day",
        paragraphs: [
          "Sign-off uses a PIN set in the dashboard. The person who signs is a different person from the one who recorded the checks. The day can be signed off even when some tasks are still open, and a late record can still be added afterwards.",
        ],
      },
      {
        heading: "The same diary as temperatures and cleaning",
        paragraphs: [
          "Opening lines, closing lines, temperature readings and cleaning tasks are separate lists. They are written into one diary for the day, which you can download. If the end-of-day email is on, it lists checklist lines that are still not done.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can we change the opening and closing lines?",
        answer:
          "Yes. Add a line, retire one you do not use, or restore it later. Staff only see the lines that are active.",
      },
      {
        question: "Does every line have to be ticked before sign-off?",
        answer:
          "No. A supervisor can sign the day off while some lines are still open. Those open lines stay visible in the record.",
      },
    ],
    related: [
      { href: "/temperature-records", label: "Temperature records" },
      { href: "/cleaning-checklists", label: "Cleaning checklists" },
      { href: "/mobile-app", label: "Android app" },
      { href: "/features", label: "Features" },
    ],
  }),
  page({
    path: "/csv-import",
    badge: "CSV import",
    title: "CSV ingredient import for kitchen labels and menus.",
    description:
      "CSV ingredient import brings existing ingredient and menu information into InstaLabel so you can review it before printing.",
    h1: "Bring your existing ingredient and menu information into InstaLabel.",
    lead: "Use CSV import to build your item records from a spreadsheet, then review the ingredients, allergens and date settings before printing.",
    sections: [
      {
        heading: "Gather current recipes and supplier information",
        paragraphs: [
          "Start with the ingredients and products your kitchen actually uses. Resolve duplicated names and outdated recipes before uploading.",
        ],
      },
      {
        heading: "Prepare the fields used by the import",
        paragraphs: [
          "The current public import uses these fields. Use the template and accepted values in your account for the exact row format.",
        ],
        table: {
          headers: ["CSV field", "What it represents"],
          rows: [
            ["menu_item_name", "The product or dish you label"],
            ["ingredient_name", "An ingredient used in that item"],
            ["shelf_life_days", "The number of days your kitchen has set for the ingredient"],
            ["allergens", "Allergen names recorded for that ingredient"],
          ],
        },
      },
      {
        heading: "Import a small representative set first",
        paragraphs: [
          "Use a few ordinary items before the full menu. Include a compound ingredient and a longer PPDS ingredient list if you print pack labels.",
        ],
      },
      {
        heading: "Review the imported items before the first print",
        paragraphs: [
          "Check names, ingredients, recorded allergens and date settings. Importing transfers information. It does not verify that a recipe or its dates are correct.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can I upload a spreadsheet from another system unchanged?",
        answer:
          "Its columns and accepted values may differ. Use InstaLabel’s current CSV format and review a small test import before uploading the whole file.",
      },
    ],
    related: [
      { href: "/ingredient-labels", label: "Ingredient labels" },
      { href: "/allergen-matrix", label: "Allergen matrix" },
      { href: "/natashas-law", label: "PPDS labels" },
      { href: "/bookdemo", label: "Book a setup demo" },
    ],
  }),
  page({
    path: "/label-sizes",
    badge: "Label sizes",
    title: "Two sizes: 60×40 mm and 56×80 mm.",
    description:
      "Match the layout to your stock and the amount of information on the label.",
    h1: "Two label sizes for different amounts of information.",
    lead: "Choose between 60 × 40 mm and 56 × 80 mm, then match the printer settings and the physical stock to the size you select. Both sizes are used for kitchen labels, including packed-food labels.",
    sections: [
      {
        heading: "60 × 40 mm: a compact format",
        paragraphs: [
          "Use the compact layout when your item details fit comfortably. It can suit everyday prep or date labelling.",
        ],
      },
      {
        heading: "56 × 80 mm: room for more detail",
        paragraphs: [
          "The taller format provides more space for longer ingredient lists. Consider it for PPDS jobs, then inspect the actual text and print.",
        ],
      },
      {
        heading: "Match the settings to the roll",
        paragraphs: [
          "Check the size printed on the stock packaging and the printer’s orientation, margins and feed settings.",
        ],
      },
      {
        heading: "Test the longest label you need",
        paragraphs: [
          "Choose a representative long recipe, review the full preview and print it. If the information cannot remain readable, review the layout before printing a batch.",
        ],
      },
    ],
    related: [
      { href: "/printer-compatibility", label: "Printer compatibility" },
      { href: "/natashas-law", label: "PPDS labels" },
      { href: "/kitchen-label-printer", label: "Kitchen label printer" },
      { href: "/guides/food-labelling-checklist", label: "Food labelling checklist" },
    ],
  }),
  page({
    path: "/guides",
    badge: "Practical guides",
    title: "Practical guides for kitchen labelling, allergens and dates.",
    description:
      "Practical guides explain PPDS labelling, the date words kitchens use, stock rotation and how to choose labelling software.",
    h1: "Practical guides for the labelling work in a kitchen.",
    lead: "These guides separate everyday kitchen jobs from the official food-information rules. The product pages explain what InstaLabel prints.",
    sections: [
      {
        heading: "Use a guide for the question, then the product page for the workflow",
        paragraphs: [
          "A requirements guide is not a promise that software makes a label compliant. Check the official source for your location and selling arrangement, then review the finished print.",
        ],
      },
    ],
    related: [
      { href: "/guides/ppds-labelling-requirements", label: "PPDS labelling requirements" },
      { href: "/guides/use-by-vs-best-before", label: "Use-by and best-before" },
      { href: "/guides/fifo-food-storage", label: "FIFO and stock rotation" },
      { href: "/guides/food-labelling-checklist", label: "Food labelling checklist" },
      { href: "/guides/allergen-information-for-restaurants", label: "Allergen information for restaurants" },
      { href: "/guides/handwritten-vs-printed-food-labels", label: "Handwritten and printed labels" },
      { href: "/guides/choosing-kitchen-labelling-software", label: "Choosing labelling software" },
      { href: "/allergen-guide", label: "The 14 food allergens" },
      { href: "/blog", label: "Blog" },
    ],
  }),
  page({
    path: "/guides/ppds-labelling-requirements",
    badge: "PPDS guide",
    title: "PPDS labelling requirements and what Natasha’s Law asks for.",
    description:
      "PPDS labelling requirements explain which food may need a name and a full ingredient list before it is sold.",
    h1: "PPDS labelling requirements: what to check before selling.",
    lead: "PPDS labelling applies to food packed before a customer selects it, where the official guidance says the pack needs a name and a full ingredient list. Natasha’s Law is the UK rule behind that list, with allergens emphasised, and the finished pack still has to be checked against the recipe.",
    sections: [
      {
        heading: "Start with the selling arrangement",
        paragraphs: [
          "PPDS concerns food packaged before the consumer orders or selects it, under the conditions set out in the official guidance. Food sold loose, packed after an order or prepacked for sale through another business can be treated differently.",
        ],
      },
      {
        heading: "Check the full ingredient information",
        paragraphs: [
          "Build the list from the actual recipe and current supplier information. Ingredients are generally listed in descending weight order at the time of manufacture. Compound ingredients may need their own ingredients included.",
        ],
      },
      {
        heading: "Emphasise allergens within the list",
        paragraphs: [
          "Regulated allergens present in the food need emphasis in the ingredient list. A separate contains line or a menu matrix does not replace the required ingredient list.",
        ],
      },
      {
        heading: "Review the physical pack label",
        paragraphs: [
          "Print a sample using the actual stock and check the item, list, emphasis and fitting before labelling the batch.",
        ],
        table: {
          headers: ["Review point", "Practical check"],
          rows: [
            ["Product identity", "Does this label belong to this actual recipe and pack?"],
            ["Ingredient list", "Have supplier products and compound ingredients been included?"],
            ["Allergens", "Does emphasis appear where the relevant ingredients are listed?"],
            ["Readability", "Can the full label be read on the finished pack?"],
          ],
        },
      },
      {
        heading: "Use software to repeat the reviewed layout",
        paragraphs: [
          "InstaLabel uses saved ingredient information to create PPDS layouts with allergen emphasis. It does not verify your recipe or guarantee compliance. Review the source records, preview and final print before sale.",
        ],
        links: [{ href: "/natashas-law", label: "See the PPDS label workflow" }],
      },
    ],
    sources: [FSA_PPDS],
    related: [
      { href: "/natashas-law", label: "PPDS labels" },
      { href: "/allergen-compliance", label: "Allergen labelling" },
      { href: "/label-sizes", label: "Label sizes" },
      { href: "/guides/food-labelling-checklist", label: "Food labelling checklist" },
    ],
  }),
  page({
    path: "/guides/use-by-vs-best-before",
    badge: "Date guide",
    title: "Use-by versus best-before dates in kitchen labelling.",
    description:
      "Use-by versus best-before dates: a use-by date relates to safety, and a best-before date relates to quality.",
    h1: "Use-by and best-before dates mean different things.",
    lead: "A use-by date is a safety date: do not use the food after it, and follow the storage instructions that make that date applicable. A best-before date is a quality date, and it is not the same instruction as a use-by date.",
    sections: [
      {
        heading: "Use-by: a safety date",
        paragraphs: [
          "Do not use appearance or smell to judge food after its use-by date. Follow the storage instructions that make that date applicable.",
        ],
      },
      {
        heading: "Best-before: a quality date",
        paragraphs: [
          "A best-before date concerns the quality of a food. It should not be treated as the same instruction as a use-by date.",
        ],
      },
      {
        heading: "Opening adds another instruction to check",
        paragraphs: [
          "Some supplier packs specify how soon the food should be used after opening. Print an ingredient label and set the shelf-life days from those instructions. The label does not replace the original date.",
        ],
      },
      {
        heading: "Use the right date rule in your software",
        paragraphs: [
          "Set the rule for the actual food and stage, then check how it appears in the label preview. Changing or reprinting a label does not change the age of the food. InstaLabel does not decide a safe shelf life.",
        ],
      },
    ],
    sources: [GOV_DATES],
    related: [
      { href: "/expiry-date-labels", label: "Expiry date labels" },
      { href: "/opened-food-labels", label: "Opened food labels" },
      { href: "/use-first-labels", label: "Use-first labels" },
    ],
  }),
  page({
    path: "/guides/fifo-food-storage",
    badge: "Stock rotation",
    title: "FIFO food storage and kitchen stock rotation.",
    description:
      "FIFO food storage means using older suitable stock before newer stock, with dates checked when shelf lives differ.",
    h1: "FIFO food storage: make the next item to use easy to find.",
    lead: "FIFO food storage means using the older suitable stock before newer stock, after the dates have been checked. Kitchen stock rotation still needs readable labels and a shelf the team can follow, because arrival order alone does not show which item should be used next.",
    sections: [
      {
        heading: "Identify stock when it arrives or changes stage",
        paragraphs: [
          "Keep food names and relevant dates visible. Apply your procedure when food is prepared, cooked, opened or moved into defrosting.",
        ],
      },
      {
        heading: "Arrange shelves to match the priority",
        paragraphs: [
          "Place the suitable item to be used next where staff can find it. Avoid covering essential labels when stacking containers.",
        ],
      },
      {
        heading: "Compare dates when batches overlap",
        paragraphs: [
          "An older arrival may have a longer remaining shelf life than a newer one. Arrival order alone cannot establish which food should be used next.",
        ],
      },
      {
        heading: "Use a clear priority cue",
        paragraphs: [
          "A use-first label can help staff recognise the container your team has selected. The cue does not extend a use-by date.",
        ],
        links: [{ href: "/use-first-labels", label: "Print use-first labels" }],
      },
    ],
    related: [
      { href: "/use-first-labels", label: "Use-first labels" },
      { href: "/expiry-date-labels", label: "Expiry date labels" },
      { href: "/prep-labels", label: "Prep labels" },
    ],
  }),
  page({
    path: "/guides/food-labelling-checklist",
    badge: "Checklist",
    title: "A kitchen food labelling checklist before you print.",
    description:
      "A kitchen food labelling checklist reviews the item, dates, stock and physical print before a batch goes out.",
    h1: "A kitchen food labelling checklist for the first print.",
    lead: "A kitchen food labelling checklist is the review before a batch goes out: the item, its date rule, the layout and a real print. It does not replace checking the recipe, the supplier information or the pack you are about to label.",
    sections: [
      {
        heading: "1. Check the food and its stage",
        paragraphs: [
          "Identify the exact item and batch. Choose prep, cooked, defrost, use-first, ingredient or PPDS. An opened pack uses an ingredient label.",
        ],
      },
      {
        heading: "2. Review ingredients and allergens",
        paragraphs: [
          "Compare the saved information with the actual recipe and supplier packs. For PPDS, review the full ingredient list and allergen emphasis.",
        ],
      },
      {
        heading: "3. Check the event and date rule",
        paragraphs: [
          "Confirm which event the label records and which use limit applies. A new print should not reset an existing food’s life.",
        ],
      },
      {
        heading: "4. Choose suitable label stock",
        paragraphs: [
          "Match the physical dimensions to the selected layout and printer. Removable and dissolvable describe different materials. Confirm the stock supplier’s instructions before you rely on a dissolvable label.",
        ],
        links: [{ href: "/dissolvable-kitchen-labels", label: "Read about dissolvable kitchen labels" }],
      },
      {
        heading: "5. Inspect an actual print",
        paragraphs: [
          "Print a sample with the setup staff will use. Check the name, dates, ingredient list, emphasis, text size and edges.",
        ],
      },
      {
        heading: "6. Apply to the right item",
        paragraphs: [
          "Attach the label to the correct container or pack and make sure it stays visible.",
        ],
      },
    ],
    related: [
      { href: "/label-sizes", label: "Label sizes" },
      { href: "/printer-compatibility", label: "Printer compatibility" },
      { href: "/natashas-law", label: "PPDS labels" },
      { href: "/bookdemo", label: "Book a demo" },
    ],
  }),
  page({
    path: "/guides/allergen-information-for-restaurants",
    badge: "Allergen information",
    title: "Allergen information for restaurants, including the matrix.",
    description:
      "Allergen information for restaurants stays useful when recipes, the matrix and the person answering a customer all use the same records.",
    h1: "Keep restaurant allergen information current and easy to find.",
    lead: "Allergen information for restaurants stays useful when the recipe, the supplier packs and the person answering a customer all use the same records. A matrix is an overview of what is recorded, and a blank cell means nothing is recorded there, not that the dish is free of that allergen.",
    sections: [
      {
        heading: "Start with the actual recipes",
        paragraphs: [
          "Review every ingredient in a dish, including garnish, dressing and the contents of bought-in products.",
        ],
      },
      {
        heading: "Treat substitutions as information changes",
        paragraphs: [
          "A different brand or ingredient can change the allergens in an item. Update the saved records and check the labels and matrix staff will use.",
        ],
      },
      {
        heading: "Use the matrix as an overview",
        paragraphs: [
          "A matrix organises items against allergen categories. An empty cell means nothing is recorded there. It is not an allergen-free assurance.",
        ],
      },
      {
        heading: "Keep cross-contact controls alongside ingredient records",
        paragraphs: [
          "Ingredients describe what goes into the recipe. Preparation, equipment and storage can introduce separate risks. InstaLabel does not assess cross-contact.",
        ],
      },
    ],
    sources: [FSA_ALLERGENS],
    related: [
      { href: "/allergen-matrix", label: "Allergen matrix software" },
      { href: "/allergen-guide", label: "The 14 food allergens" },
      { href: "/allergen-compliance", label: "Allergen labelling" },
      { href: "/tools", label: "Free allergen matrix template" },
    ],
  }),
  page({
    path: "/guides/handwritten-vs-printed-food-labels",
    badge: "Labelling methods",
    title: "Handwritten versus printed food labels for kitchens.",
    description:
      "Handwritten versus printed food labels depends on how often you repeat the same details and how long the ingredient lists are.",
    h1: "Handwritten or printed food labels: which fits your kitchen?",
    lead: "Handwritten labels can suit a few simple jobs, while printed labels reuse saved details in a consistent format. Which fits depends on how often you repeat the same information, how long the lists are, and whether the records stay current.",
    sections: [
      {
        heading: "Start with the labels you actually produce",
        paragraphs: [
          "Count the ordinary jobs: prepared batches, opened packs, defrosted items and customer-facing packs.",
        ],
      },
      {
        heading: "Compare the working methods",
        paragraphs: [
          "Handwritten labels can suit a small number of simple jobs. Printing gives a consistent format and can reuse saved item information, but the printer, stock and source records need setup.",
        ],
        table: {
          headers: ["Consideration", "Handwritten", "Printed with software"],
          rows: [
            ["Readability", "Depends on handwriting and space", "Consistent type, subject to print quality"],
            ["Repeated details", "Written for each label", "Reused from saved item records"],
            ["Recipe changes", "Tell each person who writes labels", "Update records and review the outputs"],
            ["Equipment", "Stickers and a pen", "Device, compatible printer, stock and software"],
          ],
        },
      },
      {
        heading: "Check information quality whichever method you use",
        paragraphs: [
          "Both methods depend on correct recipes, allergens and dates. Printing an outdated record makes it clearer to read, but does not make it correct.",
        ],
      },
    ],
    related: [
      { href: "/label-printer-uk-comparison", label: "Compare labelling methods" },
      { href: "/prep-labels", label: "Prep labels" },
      { href: "/kitchen-label-printer", label: "Kitchen label printer" },
      { href: "/guides/choosing-kitchen-labelling-software", label: "Choosing software" },
    ],
  }),
  page({
    path: "/guides/choosing-kitchen-labelling-software",
    badge: "Buying guide",
    title: "How to choose kitchen labelling software.",
    description:
      "Choose kitchen labelling software by testing the label jobs, printer route and complete cost with your own items.",
    h1: "Choose kitchen labelling software around the jobs you need.",
    lead: "Choose kitchen labelling software by listing the label jobs you actually print, then testing the printer route and the full cost with your own items. A short typical label and your longest ingredient list show more than a feature list.",
    sections: [
      {
        heading: "Write down the required label jobs",
        paragraphs: [
          "Separate internal prep and date labels from customer-facing PPDS packs. Ask each vendor to demonstrate a short typical label and your longest ingredient list.",
        ],
      },
      {
        heading: "Check the hardware route",
        paragraphs: [
          "Compare a supplied all-in-one device with software used on your own computer or Android device. Confirm the exact supported models. InstaLabel does not support iOS printing.",
        ],
      },
      {
        heading: "Compare the complete offer",
        paragraphs: [
          `${OFFER} A printer and label stock are separate. Nutrition and POS connections are not part of InstaLabel. Temperature checks for equipment, food and deliveries are recorded in the dashboard.`,
        ],
      },
      {
        heading: "Run a first-print test before committing",
        paragraphs: [
          "Have the person who will use the station select the item, review the information, set a quantity and print.",
        ],
      },
    ],
    related: [
      { href: "/printer-compatibility", label: "Printer compatibility" },
      { href: "/features", label: "Features" },
      { href: "/plan", label: "Pricing" },
      { href: "/bookdemo", label: "Book a demo" },
    ],
  }),
  page({
    path: "/tools",
    badge: "Free tools",
    title: "A free allergen matrix you can download as a PDF.",
    description:
      "Build a manual allergen matrix and download the same PDF chart the dashboard generates, without signing up.",
    h1: "Build an allergen matrix and download the PDF.",
    lead: "Add dishes and the allergens recorded on them, then download the PDF. Cleaning tasks are part of the InstaLabel account, not a separate file.",
    sections: [
      {
        heading: "The matrix is filled in by hand",
        paragraphs: [
          "This page does not check recipes or guarantee a food-safety outcome. A blank cell means nothing is recorded for that dish and category.",
        ],
      },
    ],
    related: [
      { href: "/tools", label: "Free allergen matrix" },
      { href: "/allergen-matrix", label: "Allergen matrix software" },
      { href: "/cleaning-checklists", label: "Cleaning checklists" },
    ],
  }),
  page({
    path: "/tools/allergen-matrix",
    badge: "Free template",
    title: "Free allergen matrix. Add your dishes and download the chart.",
    description:
      "Add menu items and the allergens recorded on them, then preview and download the same allergen chart the InstaLabel dashboard generates.",
    h1: "See the allergen chart your kitchen would print.",
    lead: "Add your menu items and the allergens recorded on them. The preview and the PDF use the same chart as the InstaLabel dashboard.",
    sections: [
      {
        heading: "A blank cell is not an assurance",
        paragraphs: [
          "A blank cell means nothing is recorded for that dish and category. It does not mean the dish is free from that allergen. Check the recipe and the supplier information before anyone relies on the chart.",
        ],
      },
    ],
    sources: [FSA_ALLERGENS],
    related: [
      { href: "/allergen-matrix", label: "Allergen matrix software" },
      { href: "/allergen-guide", label: "The 14 food allergens" },
      { href: "/guides/allergen-information-for-restaurants", label: "Restaurant allergen information" },
    ],
  }),
  page({
    path: "/tools/restaurant-cleaning-checklist",
    badge: "Cleaning checklists",
    title: "Cleaning checklists are kept inside the InstaLabel account.",
    description:
      "Daily, weekly, monthly and one-off cleaning tasks are set in InstaLabel. Staff mark them done in the Android app.",
    h1: "Cleaning tasks live in the account, not in a download.",
    lead: "Set the tasks, areas and how often they repeat, including a one-off for a single day. Staff open the list in the Android app, choose their name and mark a task complete. The day's checklist can be reviewed from the account.",
    sections: [
      {
        heading: "The method still belongs to your kitchen",
        paragraphs: [
          "A completion mark records a staff check. It does not choose the chemical, dilution or contact time, and it is not a complete HACCP system.",
        ],
      },
    ],
    sources: [FSA_SAFETY],
    related: [
      { href: "/cleaning-checklists", label: "Cleaning checklist software" },
      { href: "/temperature-records", label: "Temperature records" },
      { href: "/opening-closing-checks", label: "Opening and closing checks" },
    ],
  }),
]

const byPath = new Map(coveragePages.map((entry) => [entry.path, entry]))

export function getCoveragePage(path: string) {
  return byPath.get(path)
}

export function coveragePaths(prefix: string) {
  return coveragePages.filter((entry) => entry.path.startsWith(prefix)).map((entry) => entry.path)
}
