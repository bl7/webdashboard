"use client"
import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Clock, Info } from "lucide-react"

// Types (should match your main types)
interface MenuItem {
  id: number
  name: string
  price: number
  description: string
  image: string
  ingredients: string[]
  allergens: string[]
}

interface Group {
  id: number
  name: string
  description: string
  slug: string
  isPublic: boolean
  menuItems: MenuItem[]
}

export default function PublicMenuPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenuBySlug = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/menu/${slug}`)
        // const data = await response.json()

        // Mock data for now - replace with API call
        const mockGroups: Group[] = [
          {
            id: 1,
            name: "Momo Corner",
            description: "Authentic Nepalese dumplings and traditional dishes",
            slug: "momo-corner",
            isPublic: true,
            menuItems: [
              {
                id: 1,
                name: "Chicken Momo",
                price: 12.99,
                description: "Traditional steamed dumplings filled with seasoned chicken",
                image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400",
                ingredients: ["Chicken", "Flour", "Onion", "Garlic", "Ginger", "Spices"],
                allergens: ["Gluten", "May contain traces of soy"],
              },
              {
                id: 2,
                name: "Veg Momo",
                price: 10.99,
                description: "Steamed dumplings with mixed vegetables and herbs",
                image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400",
                ingredients: ["Cabbage", "Carrot", "Onion", "Flour", "Garlic", "Ginger"],
                allergens: ["Gluten"],
              },
              {
                id: 3,
                name: "Jhol Momo",
                price: 14.99,
                description: "Momo served in spicy sesame and tomato soup",
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
                ingredients: ["Chicken", "Flour", "Tomato", "Sesame", "Spices"],
                allergens: ["Gluten", "Sesame"],
              },
            ],
          },
          {
            id: 2,
            name: "Cafe Delight",
            description: "Premium coffee and pastries",
            slug: "cafe-delight",
            isPublic: true,
            menuItems: [
              {
                id: 4,
                name: "Espresso",
                price: 3.5,
                description: "Rich, full-bodied espresso shot",
                image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400",
                ingredients: ["Arabica Coffee Beans"],
                allergens: ["Caffeine"],
              },
              {
                id: 5,
                name: "Croissant",
                price: 4.25,
                description: "Buttery, flaky French pastry",
                image: "https://images.unsplash.com/photo-1555507036-ab794f665976?w=400",
                ingredients: ["Flour", "Butter", "Eggs", "Milk", "Sugar"],
                allergens: ["Gluten", "Dairy", "Eggs"],
              },
            ],
          },
        ]

        const foundGroup = mockGroups.find((g) => g.slug === slug && g.isPublic)

        if (!foundGroup) {
          setError("Menu not found or not public")
          return
        }

        setGroup(foundGroup)
      } catch (err) {
        setError("Failed to load menu")
        console.error("Error fetching menu:", err)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchMenuBySlug()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-md p-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 p-3">
            <Info className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mb-2 text-xl font-semibold text-gray-900">Menu Not Found</h1>
          <p className="mb-4 text-gray-600">
            {error || "The menu you're looking for doesn't exist or is not publicly available."}
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
            <p className="mt-1 text-gray-600">{group.description}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-4">
          {group.menuItems.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-lg border bg-white shadow-sm">
              <div className="flex">
                <div className="flex-1 p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <span className="ml-4 text-lg font-bold text-green-600">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="mb-3 text-sm leading-relaxed text-gray-600">{item.description}</p>

                  {/* Ingredients */}
                  {item.ingredients.length > 0 && (
                    <div className="mb-3">
                      <p className="mb-1 text-xs font-medium text-gray-700">Ingredients:</p>
                      <p className="text-xs text-gray-600">{item.ingredients.join(", ")}</p>
                    </div>
                  )}

                  {/* Allergens */}
                  {item.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.allergens.map((allergen, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2 py-1 text-xs text-amber-800"
                        >
                          ⚠️ {allergen}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image */}
                <div className="m-4 h-24 w-24 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 border-t py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Menu updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
