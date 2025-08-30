"use client"

import { ChevronDown, HelpCircle } from "lucide-react"
import React, { useState } from "react"
import { motion } from "framer-motion"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "What are the 14 allergens under UK law?",
    answer:
      "The 14 allergens that must be declared in the UK are: 1. Celery, 2. Cereals containing gluten, 3. Crustaceans, 4. Eggs, 5. Fish, 6. Lupin, 7. Milk, 8. Molluscs, 9. Mustard, 10. Nuts, 11. Peanuts, 12. Sesame seeds, 13. Soya, 14. Sulphur dioxide/sulphites. These must be clearly highlighted on all food labels and menus.",
  },
  {
    question: "What is Natasha's Law?",
    answer:
      "Natasha's Law requires all food businesses to provide full ingredient lists and allergen information on pre-packed for direct sale (PPDS) foods. This law came into effect in October 2021 and affects all UK food businesses, requiring clear allergen labeling on all food items that are pre-packed for direct sale.",
  },
  {
    question: "How can restaurants stay compliant with HACCP?",
    answer:
      "To stay HACCP compliant, restaurants should: 1. Identify all allergen hazards in their kitchen, 2. Establish critical control points for allergen management, 3. Set up monitoring procedures, 4. Train all staff on allergen awareness, 5. Keep detailed records of allergen information, 6. Have procedures to prevent cross-contamination, 7. Regularly review and update allergen procedures.",
  },
  {
    question: "What are the penalties for allergen non-compliance?",
    answer:
      "Penalties for allergen non-compliance can include unlimited fines and potential imprisonment. The severity depends on the nature of the violation and whether it resulted in harm to customers. Environmental Health Officers (EHOs) can also issue improvement notices, prohibition orders, or prosecute businesses that fail to comply with allergen regulations.",
  },
  {
    question: "How should allergens be displayed on menus?",
    answer:
      "Allergens should be clearly highlighted on menus using a consistent system such as bold text, asterisks, or a separate allergen guide. The 14 major allergens must be easily identifiable, and staff should be trained to provide accurate allergen information when asked. Many businesses use numbered or lettered allergen keys for clarity.",
  },
  {
    question: "What is cross-contamination and how can it be prevented?",
    answer:
      "Cross-contamination occurs when allergens are accidentally transferred from one food to another. To prevent it: use separate equipment for allergen-free foods, clean surfaces thoroughly between uses, store allergen-free ingredients separately, train staff on proper handling procedures, and establish clear protocols for allergen-free meal preparation.",
  },
  {
    question: "Do I need to declare allergens in alcoholic drinks?",
    answer:
      "Yes, alcoholic drinks containing any of the 14 major allergens must declare them. Common allergens in drinks include sulphites (in wine and beer), gluten (in beer and some spirits), and nuts (in some liqueurs). The same labeling requirements apply to alcoholic beverages as to other food products.",
  },
  {
    question: "How often should staff receive allergen training?",
    answer:
      "Staff should receive allergen training when they start work and at least annually thereafter. Additional training should be provided whenever recipes change, new allergens are introduced, or after any allergen-related incidents. Regular refresher training helps ensure compliance and customer safety.",
  },
]

export const AllergenGuideFAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    )
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2">
            <HelpCircle className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Frequently Asked Questions</span>
          </div>
          <h3 className="mb-4 font-accent text-3xl font-bold text-gray-900 sm:text-4xl">
            Common Questions About Allergen Compliance
          </h3>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Find answers to the most frequently asked questions about UK allergen law and compliance
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-lg border border-gray-200"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="flex w-full items-center justify-between bg-white px-6 py-4 text-left transition-colors duration-200 hover:bg-gray-50"
                >
                  <span className="pr-4 font-semibold text-gray-900">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-gray-500 transition-transform duration-200 ${
                      openItems.includes(index) ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: openItems.includes(index) ? "auto" : 0,
                    opacity: openItems.includes(index) ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 pb-4">
                    <p className="leading-relaxed text-gray-700">{item.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
