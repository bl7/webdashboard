import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getAllIngredients, addIngredient, updateIngredient, deleteIngredient } from "@/lib/api"

export type Ingredient = {
  uuid: string
  ingredientName: string
  expiryDays: number
  allergens: { uuid: string; allergenName: string }[]
}

type AddIngredientData = {
  ingredientName: string
  expiryDays: number
  allergenIDs: string[]
}

type UpdateIngredientData = {
  ingredientName: string
  expiryDays: number
  allergenIDs: string[]
}

export function useIngredients() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all ingredients
  const fetchIngredients = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Authentication token not found")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getAllIngredients(token)
      setIngredients(Array.isArray(data) ? data : data.data)
    } catch (err: any) {
      console.error("Error fetching ingredients:", err)
      const errorMessage = err.message || "Failed to fetch ingredients"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Add new ingredient
  const addNewIngredient = async (ingredientData: AddIngredientData) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      await addIngredient(ingredientData, token)
      // Refresh the ingredients list to ensure state is in sync
      await fetchIngredients()
      toast.success("Ingredient added successfully")
      return true
    } catch (err: any) {
      console.error("Error adding ingredient:", err)
      toast.error(err.message || "Failed to add ingredient")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update existing ingredient
  const updateExistingIngredient = async (uuid: string, ingredientData: UpdateIngredientData) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      await updateIngredient(uuid, ingredientData, token)
      // Refresh the ingredients list to ensure state is in sync
      await fetchIngredients()
      toast.success("Ingredient updated successfully")
      return true
    } catch (err: any) {
      console.error("Error updating ingredient:", err)
      toast.error(err.message || "Failed to update ingredient")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Delete ingredient
  const deleteExistingIngredient = async (uuid: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      await deleteIngredient(uuid, token)
      setIngredients((prev) => prev.filter((ing) => ing.uuid !== uuid))
      toast.success("Ingredient deleted successfully")
      return true
    } catch (err: any) {
      console.error("Error deleting ingredient:", err)
      toast.error(err.message || "Failed to delete ingredient")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Filter ingredients by search term
  const filterIngredients = (searchTerm: string) => {
    return ingredients.filter((item) =>
      item.ingredientName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Initialize data on mount
  useEffect(() => {
    fetchIngredients()
  }, [])

  return {
    ingredients,
    loading,
    error,
    fetchIngredients,
    addNewIngredient,
    updateExistingIngredient,
    deleteExistingIngredient,
    filterIngredients,
  }
}
