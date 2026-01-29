"use client"

import React, { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import LabelRender from "@/app/dashboard/print/LabelRender"
import { PPDSLabelRenderer } from "@/app/dashboard/ppds/PPDSLabelRenderer"
import Link from "next/link"

interface LabelPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Allergen detection utility (matching the system)
const allergenKeywords = {
  gluten: ["wheat", "barley", "rye", "oats", "flour", "bread", "pasta", "cereal"],
  crustaceans: ["shrimp", "prawn", "crab", "lobster", "crayfish"],
  eggs: ["egg", "egg white", "egg yolk", "mayonnaise", "custard"],
  fish: ["fish", "salmon", "tuna", "cod", "haddock", "anchovy", "fish sauce"],
  peanuts: ["peanut", "groundnut", "arachis"],
  soy: ["soy", "soya", "soybean", "tofu", "edamame"],
  milk: ["milk", "dairy", "cheese", "cream", "butter", "yogurt", "lactose", "parmesan"],
  nuts: ["almond", "walnut", "cashew", "pistachio", "hazelnut", "pecan", "macadamia"],
  celery: ["celery", "celeriac"],
  mustard: ["mustard", "mustard seed"],
  sesame: ["sesame", "sesame seed", "tahini"],
  sulphites: ["sulphite", "sulfite", "sulphur dioxide"],
  lupin: ["lupin", "lupini"],
  molluscs: ["mollusc", "mussel", "oyster", "clam", "scallop", "squid", "octopus"],
}

// Map allergen keys to display names
const allergenDisplayNames: Record<string, string> = {
  gluten: "Wheat",
  crustaceans: "Crustaceans",
  eggs: "Egg",
  fish: "Fish",
  peanuts: "Peanuts",
  soy: "Soy",
  milk: "Milk",
  nuts: "Nuts",
  celery: "Celery",
  mustard: "Mustard",
  sesame: "Sesame",
  sulphites: "Sulphites",
  lupin: "Lupin",
  molluscs: "Molluscs",
}

function detectAllergens(text: string): string[] {
  const detected: string[] = []
  const lowerText = text.toLowerCase()

  for (const [allergen, keywords] of Object.entries(allergenKeywords)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        const displayName = allergenDisplayNames[allergen]
        if (displayName && !detected.includes(displayName)) {
          detected.push(displayName)
        }
        break
      }
    }
  }

  return detected
}

export function LabelPreviewModal({ open, onOpenChange }: LabelPreviewModalProps) {
  const now = new Date()
  const twoDaysLater = new Date(now)
  twoDaysLater.setDate(now.getDate() + 2)

  const isoDateTimeNow = now.toISOString()
  const isoDateTimePlusTwo = twoDaysLater.toISOString()
  const isoDateNow = isoDateTimeNow.split("T")[0]
  const isoDatePlusTwo = isoDateTimePlusTwo.split("T")[0]

  // Sample data
  const [itemName, setItemName] = useState("Thai Red Curry")
  const [ingredientsText, setIngredientsText] = useState(
    "Chicken Thigh, Red Curry Paste, Coconut Milk, Thai Basil"
  )
  const [labelType, setLabelType] = useState<"ingredients" | "prep" | "cooked" | "ppds">("cooked")
  const [companyName, setCompanyName] = useState("InstaLabel Ltd")
  const [storageInfo, setStorageInfo] = useState("Keep refrigerated below 5°C. Consume within 2 days.")
  const [useInitials, setUseInitials] = useState(true)
  const [selectedInitial, setSelectedInitial] = useState("BL")

  // Parse ingredients from comma-separated text
  const ingredients = useMemo(() => {
    return ingredientsText
      .split(",")
      .map((ing) => ing.trim())
      .filter((ing) => ing.length > 0)
  }, [ingredientsText])

  // Detect allergens from ingredients
  const detectedAllergens = useMemo(() => {
    const allText = `${itemName} ${ingredientsText}`.toLowerCase()
    return detectAllergens(allText)
  }, [itemName, ingredientsText])

  // Build allIngredients array for label renderers
  const allIngredients = useMemo(() => {
    return ingredients.map((ingName, idx) => {
      const ingLower = ingName.toLowerCase()
      const ingAllergens: { allergenName: string }[] = []

      // Check each allergen keyword
      for (const [allergen, keywords] of Object.entries(allergenKeywords)) {
        for (const keyword of keywords) {
          if (ingLower.includes(keyword.toLowerCase())) {
            const displayName = allergenDisplayNames[allergen]
            if (displayName && !ingAllergens.some((a) => a.allergenName === displayName)) {
              ingAllergens.push({ allergenName: displayName })
            }
            break
          }
        }
      }

      return {
        uuid: `ing-${idx}`,
        ingredientName: ingName,
        allergens: ingAllergens,
      }
    })
  }, [ingredients])

  // Build item object for LabelRender
  const labelItem = useMemo(() => {
    if (labelType === "ppds") {
      return {
        uid: "preview-ppds",
        id: "preview-ppds",
        type: "menu" as const,
        name: itemName,
        quantity: 1,
        labelType: "ppds" as const,
        ingredients: ingredients,
        printedOn: isoDateNow,
        expiryDate: isoDatePlusTwo,
      }
    }

    if (labelType === "ingredients") {
      // For ingredient labels, allergens need to be in item.allergens array
      const allergenObjects = detectedAllergens.map((allergenName, idx) => ({
        uuid: idx + 1,
        allergenName,
        category: "Other",
        status: "Active" as const,
        addedAt: "",
        isCustom: false,
      }))

      return {
        uid: "preview-ing",
        id: "preview-ing",
        type: "ingredients" as const,
        name: itemName,
        quantity: 1,
        allergens: allergenObjects,
        printedOn: isoDateTimeNow,
        expiryDate: isoDateTimePlusTwo,
      }
    }

    // Prep or Cook
    const allergenObjects = detectedAllergens.map((allergenName, idx) => ({
      uuid: idx + 1,
      allergenName,
      category: "Other",
      status: "Active" as const,
      addedAt: "",
      isCustom: false,
    }))

    return {
      uid: `preview-${labelType}`,
      id: `preview-${labelType}`,
      type: "menu" as const,
      name: itemName,
      quantity: 1,
      ingredients: ingredients,
      allergens: allergenObjects,
      printedOn: isoDateTimeNow,
      expiryDate: isoDateTimePlusTwo,
      labelType: labelType === "prep" ? ("prep" as const) : ("cooked" as const),
    }
  }, [itemName, ingredients, labelType, detectedAllergens, isoDateTimeNow, isoDateTimePlusTwo, isoDateNow, isoDatePlusTwo])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto border-2 border-purple-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create Your Perfect Label
          </DialogTitle>
          <DialogDescription className="text-base">
            Watch your label come to life in real-time! Just enter your item details and see
            professional, compliant labels generated instantly. ✨
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* Left: Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-name" className="text-sm font-semibold">
                What are you labeling? 🏷️
              </Label>
              <Input
                id="item-name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Thai Red Curry"
                className="mt-1 border-2 focus:border-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="ingredients" className="text-sm font-semibold">
                Ingredients (comma-separated) 🥘
              </Label>
              <Textarea
                id="ingredients"
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder="e.g., Chicken Thigh, Red Curry Paste, Coconut Milk"
                className="mt-1 min-h-[100px] border-2 focus:border-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="label-type" className="text-sm font-semibold">
                Choose Label Type 📋
              </Label>
              <Select
                value={labelType}
                onValueChange={(value: "ingredients" | "prep" | "cooked" | "ppds") =>
                  setLabelType(value)
                }
              >
                <SelectTrigger className="mt-1 border-2 focus:border-purple-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ingredients">🧾 Ingredient Label</SelectItem>
                  <SelectItem value="prep">📦 Prep Label</SelectItem>
                  <SelectItem value="cooked">🔥 Cook Label</SelectItem>
                  <SelectItem value="ppds">✅ PPDS Label (Natasha's Law)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {labelType === "ppds" && (
              <>
                <div>
                  <Label htmlFor="company-name" className="text-sm font-semibold">
                    Company Name 🏢
                  </Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Name"
                    className="mt-1 border-2 focus:border-purple-400"
                  />
                </div>
                <div>
                  <Label htmlFor="storage-info" className="text-sm font-semibold">
                    Storage Instructions ❄️
                  </Label>
                  <Textarea
                    id="storage-info"
                    value={storageInfo}
                    onChange={(e) => setStorageInfo(e.target.value)}
                    placeholder="e.g., Keep refrigerated below 5°C"
                    className="mt-1 border-2 focus:border-purple-400"
                  />
                </div>
              </>
            )}

            {labelType !== "ppds" && (
              <div>
                <Label htmlFor="initials" className="text-sm font-semibold">
                  Initials (for printed by) ✍️
                </Label>
                <div className="mt-1 flex items-center gap-3">
                  <Input
                    id="initials"
                    value={selectedInitial}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().slice(0, 2)
                      setSelectedInitial(value)
                    }}
                    placeholder="BL"
                    maxLength={2}
                    className="w-20 border-2 focus:border-purple-400 text-center font-bold"
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useInitials}
                      onChange={(e) => setUseInitials(e.target.checked)}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span>Show on label</span>
                  </label>
                </div>
              </div>
            )}

            {detectedAllergens.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">⚠️</span>
                  <Label className="text-sm font-bold text-yellow-900">
                    Allergens Auto-Detected!
                  </Label>
                </div>
                <p className="text-sm font-medium text-yellow-800">
                  {detectedAllergens.join(", ")}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  These will be highlighted on your label automatically
                </p>
              </div>
            )}

            <div className="pt-4 space-y-3">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/register">
                  Start Creating Labels Like This →
                </Link>
              </Button>
              <p className="text-xs text-center text-gray-500">
                ✓ 14-day free trial • ✓ No charges during trial • ✓ Setup in 2 minutes
              </p>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-xl p-8 min-h-[400px] border-2 border-purple-100 shadow-lg">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">🎨</span>
              <div className="text-base font-bold text-gray-800">Live Preview</div>
            </div>
            <p className="mb-6 text-xs text-gray-600 text-center">
              Watch it update as you type!
            </p>
            <div className="flex items-center justify-center transform transition-all duration-300 hover:scale-105">
              {labelType === "ppds" ? (
                <PPDSLabelRenderer
                  item={labelItem}
                  storageInfo={storageInfo}
                  businessName={companyName}
                  allIngredients={allIngredients}
                />
              ) : (
                <LabelRender
                  item={labelItem}
                  expiry={labelType === "ingredients" ? isoDateTimePlusTwo : isoDateTimePlusTwo}
                  useInitials={useInitials}
                  selectedInitial={selectedInitial || "BL"}
                  allergens={detectedAllergens}
                  labelHeight="40mm"
                  allIngredients={allIngredients}
                />
              )}
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-purple-700 bg-purple-50 px-4 py-2 rounded-full">
              <span>✨</span>
              <span className="font-semibold">Ready to print in seconds!</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

