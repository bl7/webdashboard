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
  CircleDot,
} from "lucide-react"
import React from "react"
import { motion } from "framer-motion"

export const AllergenGuideList = () => {
  const allergens = [
    {
      number: 1,
      name: "Celery",
      includes:
        "Celery stalks, leaves, seeds, and celeriac. Also found in celery salt, celery seed, and celery extract.",
      hiddenSources:
        "Stock cubes, bouillon, soups, sauces, seasonings, processed meats, some soft drinks",
      symptoms: "Itching, swelling, difficulty breathing, anaphylaxis",
    },
    {
      number: 2,
      name: "Cereals containing gluten",
      includes: "Wheat, rye, barley, oats, spelt, kamut, and their hybridised strains",
      hiddenSources:
        "Bread, pasta, cakes, biscuits, beer, soy sauce, processed meats, some medications",
      symptoms: "Digestive issues, skin reactions, respiratory problems, fatigue",
    },
    {
      number: 3,
      name: "Crustaceans",
      includes: "Crabs, lobsters, prawns, crayfish, shrimp, scampi",
      hiddenSources: "Fish sauce, Worcestershire sauce, some Asian dishes, seafood pastes",
      symptoms: "Swelling, itching, difficulty breathing, anaphylaxis",
    },
    {
      number: 4,
      name: "Eggs",
      includes: "Chicken eggs, duck eggs, quail eggs, and products containing them",
      hiddenSources: "Mayonnaise, meringue, some pasta, cakes, ice cream, processed foods",
      symptoms: "Skin reactions, digestive issues, respiratory problems, anaphylaxis",
    },
    {
      number: 5,
      name: "Fish",
      includes: "All fish species including salmon, tuna, cod, haddock, mackerel",
      hiddenSources: "Fish sauce, Worcestershire sauce, Caesar dressing, some Asian dishes",
      symptoms: "Swelling, itching, difficulty breathing, anaphylaxis",
    },
    {
      number: 6,
      name: "Lupin",
      includes: "Lupin seeds and flour, lupin protein",
      hiddenSources:
        "Some bread, pasta, biscuits, gluten-free products, vegetarian meat substitutes",
      symptoms: "Skin reactions, digestive issues, respiratory problems",
    },
    {
      number: 7,
      name: "Milk",
      includes: "Cow's milk, goat's milk, sheep's milk, and products containing them",
      hiddenSources:
        "Butter, cheese, cream, yogurt, ice cream, chocolate, some bread, processed foods",
      symptoms: "Digestive issues, skin reactions, respiratory problems, anaphylaxis",
    },
    {
      number: 8,
      name: "Molluscs",
      includes: "Mussels, oysters, clams, scallops, snails, squid, octopus",
      hiddenSources: "Fish sauce, some Asian dishes, seafood pastes, some stocks",
      symptoms: "Swelling, itching, difficulty breathing, anaphylaxis",
    },
    {
      number: 9,
      name: "Mustard",
      includes: "Mustard seeds, mustard powder, mustard oil, prepared mustard",
      hiddenSources: "Sauces, dressings, marinades, processed meats, some Asian dishes",
      symptoms: "Skin reactions, digestive issues, respiratory problems, anaphylaxis",
    },
    {
      number: 10,
      name: "Nuts",
      includes:
        "Almonds, hazelnuts, walnuts, cashews, pecans, brazil nuts, pistachios, macadamia nuts",
      hiddenSources:
        "Nut oils, marzipan, praline, some chocolates, processed foods, some Asian dishes",
      symptoms: "Swelling, itching, difficulty breathing, anaphylaxis",
    },
    {
      number: 11,
      name: "Peanuts",
      includes: "Peanuts and peanut products (technically legumes, not nuts)",
      hiddenSources:
        "Peanut oil, peanut butter, some chocolates, processed foods, some Asian dishes",
      symptoms: "Swelling, itching, difficulty breathing, anaphylaxis",
    },
    {
      number: 12,
      name: "Sesame seeds",
      includes: "Sesame seeds, sesame oil, tahini, sesame paste",
      hiddenSources: "Bread, crackers, hummus, some Asian dishes, processed foods",
      symptoms: "Skin reactions, digestive issues, respiratory problems, anaphylaxis",
    },
    {
      number: 13,
      name: "Soya",
      includes: "Soya beans, soya flour, soya protein, tofu, tempeh",
      hiddenSources:
        "Soy sauce, miso, some Asian dishes, processed foods, vegetarian meat substitutes",
      symptoms: "Digestive issues, skin reactions, respiratory problems",
    },
    {
      number: 14,
      name: "Sulphur dioxide",
      includes: "Sulphites, sulphur dioxide, sodium sulphite, sodium bisulphite",
      hiddenSources: "Dried fruits, wine, beer, some processed meats, some Asian dishes",
      symptoms: "Respiratory problems, skin reactions, digestive issues",
    },
  ]

  return (
    <section id="allergens-list" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
            The 14 Allergens You Must Declare
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            UK food law requires you to declare these 14 allergens on your menu or food labels. Each
            allergen has specific rules and hidden sources you need to know.
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
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              {/* Allergen Header with Number */}
              <div className="mb-6 flex items-center gap-4">
                {/* Number Badge */}
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-lg font-bold text-white">
                    {allergen.number}
                  </div>
                </div>

                {/* Title */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{allergen.name}</h3>
                  <div className="mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    <span className="text-xs font-medium text-red-600">Must Declare</span>
                  </div>
                </div>
              </div>

              {/* Allergen Details */}
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <h4 className="text-sm font-semibold text-gray-800">Includes:</h4>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{allergen.includes}</p>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <h4 className="text-sm font-semibold text-gray-800">Hidden Sources:</h4>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{allergen.hiddenSources}</p>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <h4 className="text-sm font-semibold text-gray-800">Common Symptoms:</h4>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">{allergen.symptoms}</p>
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
          className="mt-12 rounded-xl border border-yellow-200 bg-yellow-50 p-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-yellow-600" />
            <div>
              <h3 className="mb-2 font-semibold text-yellow-800">Important Notice</h3>
              <p className="text-sm leading-relaxed text-yellow-700">
                This guide is for reference only. Check with your local Environmental Health Officer
                (EHO) for specific rules. Allergen information must be accurate and current. Regular
                staff training is needed for compliance.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
