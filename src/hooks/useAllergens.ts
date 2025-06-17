// hooks/useAllergens.ts
import { useState, useEffect, useCallback } from "react"
import { getAllAllergens, addAllergens, updateAllergen, deleteAllergen } from "@/lib/api"
import { UUID } from "crypto"

export type Allergen = {
  id: string
  name: string
  category: string
  severity: "Low" | "Medium" | "High"
  status: "Active" | "Inactive"
  addedAt: string
  isCustom: boolean
}

function estimateSeverity(name: string): "Low" | "Medium" | "High" {
  const lower = name.toLowerCase()
  if (["peanut", "shellfish", "tree nut"].some((k) => lower.includes(k))) return "High"
  if (["gluten", "dairy", "soy"].some((k) => lower.includes(k))) return "Medium"
  return "Low"
}

export function useAllergens() {
  const [allergens, setAllergens] = useState<Allergen[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all allergens
  const fetchAllergens = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("No access token found")
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const res = await getAllAllergens(token)
      if (!res?.data) {
        setAllergens([])
        return
      }

      const mapped = res.data.map(
        (item: any): Allergen => ({
          id: item.id,
          name: item.allergenName,
          category: item.isCustom ? "Custom" : "Standard",
          severity: estimateSeverity(item.allergenName),
          status: item.isActive ? "Active" : "Inactive",
          addedAt: item.createdAt.split("T")[0],
          isCustom: item.isCustom,
        })
      )
      setAllergens(mapped)
      console.log(allergens, "ingredients allergens")
    } catch (err) {
      console.error("Failed to fetch allergens:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch allergens")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Add new allergen
  const addAllergen = useCallback(async (allergenName: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("No access token found")
    }

    try {
      const response = await addAllergens(allergenName.trim(), token)

      // Create new allergen object with response data
      const newItem: Allergen = {
        id: response.data?.id || Date.now(),
        name: allergenName.trim(),
        category: "Custom",
        severity: estimateSeverity(allergenName),
        status: "Active",
        addedAt: new Date().toISOString().split("T")[0],
        isCustom: true,
      }

      setAllergens((prev) => [newItem, ...prev])
      return newItem
    } catch (error) {
      console.error("Failed to add allergen:", error)
      throw error
    }
  }, [])

  // Update allergen
  const updateAllergenItem = useCallback(async (id: string, allergenName: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("No access token found")
    }

    try {
      await updateAllergen(id, allergenName.trim(), token)

      // Update local state
      setAllergens((prev) =>
        prev.map((allergen) =>
          allergen.id === id
            ? {
                ...allergen,
                name: allergenName.trim(),
                severity: estimateSeverity(allergenName.trim()),
              }
            : allergen
        )
      )
    } catch (error) {
      console.error("Failed to update allergen:", error)
      throw error
    }
  }, [])

  // Delete allergen
  const deleteAllergenItem = useCallback(async (id: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("No access token found")
    }

    try {
      await deleteAllergen(id, token)

      // Remove from local state
      setAllergens((prev) => prev.filter((allergen) => allergen.id !== id))
    } catch (error) {
      console.error("Failed to delete allergen:", error)
      throw error
    }
  }, [])

  // Refresh allergens (useful for manual refresh)
  const refreshAllergens = useCallback(() => {
    fetchAllergens()
  }, [fetchAllergens])

  // Computed values
  const customAllergens = allergens.filter((a) => a.isCustom)
  const standardAllergens = allergens.filter((a) => !a.isCustom)
  const activeAllergens = allergens.filter((a) => a.status === "Active")
  const inactiveAllergens = allergens.filter((a) => a.status === "Inactive")

  // Initial fetch
  useEffect(() => {
    fetchAllergens()
  }, [fetchAllergens])

  return {
    // Data
    allergens,
    customAllergens,
    standardAllergens,
    activeAllergens,
    inactiveAllergens,

    // State
    isLoading,
    error,

    // Actions
    addAllergen,
    updateAllergenItem,
    deleteAllergenItem,
    refreshAllergens,

    // Computed counts
    customCount: customAllergens.length,
    standardCount: standardAllergens.length,
    activeCount: activeAllergens.length,
    inactiveCount: inactiveAllergens.length,
    totalCount: allergens.length,
  }
}
