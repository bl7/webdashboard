"use client"

import { 
  Carrot, 
  Wheat, 
  Egg, 
  Fish, 
  Sprout, 
  Milk, 
  Zap, 
  AlertTriangle,
  CheckCircle2,
  Info,
  Package,
  TreePine,
  Coffee,
  Wine,
  Circle,
  CircleDot
} from "lucide-react"
import React from "react"
import { motion } from "framer-motion"

export const AllergenGuideList = () => {
  const allergens = [
    {
      number: 1,
      name: "Celery",
      includes: "Celery stalks, leaves, seeds, and celeriac. Also found in celery salt, celery seed, and celery extract.",
      hiddenSources: "Stock cubes, bouillon, soups, sauces, seasonings, processed meats, some soft drinks",
      symptoms: "Itching, swelling, difficulty breathing, anaphylaxis"
    },
    {
      number: 2,
      name: "Cereals containing gluten",
      includes: "Wheat, rye, barley, oats, spelt, kamut, and their hybridised strains",
      hiddenSources: "Bread, pasta, cakes, biscuits, beer, soy sauce, processed meats, some medications",
      symptoms: "Digestive issues, skin reactions, respiratory problems, fatigue"
    },
    {
      number: 3,
      name: "Crustaceans",
      includes: "Crabs, lobsters, prawns, crayfish, shrimp, scampi",
      hiddenSources: "Fish sauce, Worcestershire sauce, some Asian dishes, seafood pastes",
      symptoms: "Swelling, itching, difficulty breathing, anaphylaxis"
    },
    {
      number: 4,
      name: "Eggs",
      includes: "Chicken eggs, duck eggs, quail eggs, and products containing them",
      hiddenSources: "Mayonnaise, meringue, some pasta, cakes, ice cream, processed foods",
      symptoms: "Skin reactions, digestive issues, respiratory problems, anaphylaxis"
    },
    {
      number: 5,
      name: "Fish",
      includes: "All fish species including salmon, tuna, cod, haddock, mackerel",
      hiddenSources: "Fish sauce, Worcestershire sauce, Caesar dressing, some Asian dishes",
      symptoms: "Swelling, itching, difficulty breathing, anaphylaxis"
    },
    {
      number: 6,
      name: "Lupin",
      includes: "Lupin seeds and flour, lupin protein",
      hiddenSources: "Some bread, pasta, biscuits, gluten-free products, vegetarian meat substitutes",
      symptoms: "Skin reactions, digestive issues, respiratory problems"
    },
    {
      number: 7,
      name: "Milk",
      includes: "Cow's milk, goat's milk, sheep's milk, and products containing them",
      hiddenSources: "Butter, cheese, cream, yogurt, ice cream, chocolate, some bread, processed foods",
      symptoms: "Digestive issues, skin reactions, respiratory problems, anaphylaxis"
    },
    {
      number: 8,
      name: "Molluscs",
      includes: "Mussels, oysters, clams, scallops, snails, squid, octopus",
      hiddenSources: "Fish sauce, some Asian dishes, seafood pastes, some stocks",
      symptoms: "Swelling, itching, difficulty breathing, anaphylaxis"
    },
    {
      number: 9,
      name: "Mustard",
      includes: "Mustard seeds, mustard powder, mustard oil, prepared mustard",
      hiddenSources: "Sauces, dressings, marinades, processed meats, some Asian dishes",
      symptoms: "Skin reactions, digestive issues, respiratory problems, anaphylaxis"
    },
    {
      number: 10,
      name: "Nuts",
      includes: "Almonds, hazelnuts, walnuts, cashews, pecans, brazil nuts, pistachios, macadamia nuts",
      hiddenSources: "Nut oils, marzipan, praline, some chocolates, processed foods, some Asian dishes",
      symptoms: "Swelling, itching, difficulty breathing, anaphylaxis"
    },
    {
      number: 11,
      name: "Peanuts",
      includes: "Peanuts and peanut products (technically legumes, not nuts)",
      hiddenSources: "Peanut oil, peanut butter, some chocolates, processed foods, some Asian dishes",
      symptoms: "Swelling, itching, difficulty breathing, anaphylaxis"
    },
    {
      number: 12,
      name: "Sesame seeds",
      includes: "Sesame seeds, sesame oil, tahini, sesame paste",
      hiddenSources: "Bread, crackers, hummus, some Asian dishes, processed foods",
      symptoms: "Skin reactions, digestive issues, respiratory problems, anaphylaxis"
    },
    {
      number: 13,
      name: "Soya",
      includes: "Soya beans, soya flour, soya protein, tofu, tempeh",
      hiddenSources: "Soy sauce, miso, some Asian dishes, processed foods, vegetarian meat substitutes",
      symptoms: "Digestive issues, skin reactions, respiratory problems"
    },
    {
      number: 14,
      name: "Sulphur dioxide",
      includes: "Sulphites, sulphur dioxide, sodium sulphite, sodium bisulphite",
      hiddenSources: "Dried fruits, wine, beer, some processed meats, some Asian dishes",
      symptoms: "Respiratory problems, skin reactions, digestive issues"
    }
  ]

  return (
    <section id="allergens-list" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            The 14 Allergens You Must Declare
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Under UK food law, these 14 allergens must be clearly declared on your menu or food labels. Each allergen has specific requirements and hidden sources you need to know.
          </p>
        </motion.div>

        {/* Allergens Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allergens.map((allergen, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
            >
                {/* Allergen Header with Number */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {allergen.number}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{allergen.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">Must Declare</span>
                    </div>
                  </div>
                </div>
                
                {/* Allergen Details */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-gray-800 text-sm">Includes:</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{allergen.includes}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <h4 className="font-semibold text-gray-800 text-sm">Hidden Sources:</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{allergen.hiddenSources}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold text-gray-800 text-sm">Common Symptoms:</h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{allergen.symptoms}</p>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
              <p className="text-sm text-yellow-700 leading-relaxed">
                This guide is for reference only. Always check with your local Environmental Health Officer (EHO) for specific requirements. 
                Allergen information must be accurate and up-to-date. Regular staff training is essential for compliance.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 