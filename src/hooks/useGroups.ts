import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import {
  getAllItemCategories,
  addItemCategory,
  updateItemCategory,
  deleteItemCategory,
  getAllIngredientCategories,
  addIngredientCategory,
  updateIngredientCategory,
  deleteIngredientCategory,
} from "@/lib/api"

export type ItemCategory = {
  uuid: string
  categoryName: string
  userID: string
  type: "Menu Item Group"
}

export type IngredientCategory = {
  uuid: string
  categoryName: string
  expiryDays: number
  userID: string
  type: "Ingredient Group"
}

export type CombinedCategory = ItemCategory | IngredientCategory

export function useGroups() {
  const [itemCategories, setItemCategories] = useState<ItemCategory[]>([])
  const [ingredientCategories, setIngredientCategories] = useState<IngredientCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Authentication token not found")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch both types of categories in parallel
      const [itemCategoriesRes, ingredientCategoriesRes] = await Promise.all([
        getAllItemCategories(token),
        getAllIngredientCategories(token),
      ])

      console.log("Item Categories API Response:", itemCategoriesRes)
      console.log("Ingredient Categories API Response:", ingredientCategoriesRes)

      const itemCats = itemCategoriesRes.data || []
      const ingredientCats = ingredientCategoriesRes.data || []

      console.log("Processed Item Categories:", itemCats)
      console.log("Processed Ingredient Categories:", ingredientCats)

      setItemCategories(itemCats.map((cat: any) => ({ ...cat, type: "Menu Item Group" as const })))
      setIngredientCategories(ingredientCats.map((cat: any) => ({ ...cat, type: "Ingredient Group" as const })))
    } catch (err: any) {
      console.error("Error fetching categories:", err)
      const errorMessage = err.message || "Failed to fetch categories"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Add item category
  const addNewItemCategory = async (categoryName: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      await addItemCategory(categoryName, token)
      await fetchCategories() // Refresh the list
      toast.success("Item category added successfully")
      return true
    } catch (err: any) {
      console.error("Error adding item category:", err)
      toast.error(err.message || "Failed to add item category")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update item category
  const updateExistingItemCategory = async (uuid: string, categoryName: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      await updateItemCategory(uuid, categoryName, token)
      await fetchCategories() // Refresh the list
      toast.success("Item category updated successfully")
      return true
    } catch (err: any) {
      console.error("Error updating item category:", err)
      toast.error(err.message || "Failed to update item category")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Delete item category
  const deleteExistingItemCategory = async (uuid: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      await deleteItemCategory(uuid, token)
      await fetchCategories() // Refresh the list
      toast.success("Item category deleted successfully")
      return true
    } catch (err: any) {
      console.error("Error deleting item category:", err)
      toast.error(err.message || "Failed to delete item category")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Add ingredient category
  const addNewIngredientCategory = async (categoryName: string, expiryDays: number) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      await addIngredientCategory(categoryName, expiryDays, token)
      await fetchCategories() // Refresh the list
      toast.success("Ingredient category added successfully")
      return true
    } catch (err: any) {
      console.error("Error adding ingredient category:", err)
      toast.error(err.message || "Failed to add ingredient category")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update ingredient category
  const updateExistingIngredientCategory = async (uuid: string, expiryDays: number) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      await updateIngredientCategory(uuid, expiryDays, token)
      await fetchCategories() // Refresh the list
      toast.success("Ingredient category updated successfully")
      return true
    } catch (err: any) {
      console.error("Error updating ingredient category:", err)
      toast.error(err.message || "Failed to update ingredient category")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Delete ingredient category
  const deleteExistingIngredientCategory = async (uuid: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      await deleteIngredientCategory(uuid, token)
      await fetchCategories() // Refresh the list
      toast.success("Ingredient category deleted successfully")
      return true
    } catch (err: any) {
      console.error("Error deleting ingredient category:", err)
      toast.error(err.message || "Failed to delete ingredient category")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Get items by category
  const getItemsByCategory = useCallback(async (categoryId: string, categoryType: "Menu Item Group" | "Ingredient Group") => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return []
    }

    try {
      if (categoryType === "Menu Item Group") {
        // For menu item categories, we need to check if there's an endpoint to get items by category
        // For now, let's fetch all menu items and filter by category
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log("All Menu Items:", data)
          // Filter items by categoryID if available
          const itemsInCategory = data.data?.filter((item: any) => item.categoryID === categoryId) || []
          console.log(`Items in category ${categoryId}:`, itemsInCategory)
          return itemsInCategory
        }
      } else {
        // For ingredient categories, fetch all ingredients and filter by category
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log("All Ingredients:", data)
          // Filter ingredients by categoryID if available
          const itemsInCategory = data.data?.filter((item: any) => item.categoryID === categoryId) || []
          console.log(`Ingredients in category ${categoryId}:`, itemsInCategory)
          return itemsInCategory
        }
      }
    } catch (err: any) {
      console.error("Error fetching items by category:", err)
      toast.error(err.message || "Failed to fetch items by category")
    }

    return []
  }, [])

  // Get all categories combined
  const getAllCategories = (): CombinedCategory[] => {
    return [...itemCategories, ...ingredientCategories]
  }

  // Filter categories by type
  const getCategoriesByType = (type: "Menu Item Group" | "Ingredient Group"): CombinedCategory[] => {
    return getAllCategories().filter(cat => cat.type === type)
  }

  // Initialize data on mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    // Data
    itemCategories,
    ingredientCategories,
    getAllCategories,
    getCategoriesByType,

    // State
    loading,
    error,

    // Actions
    fetchCategories,
    addNewItemCategory,
    updateExistingItemCategory,
    deleteExistingItemCategory,
    addNewIngredientCategory,
    updateExistingIngredientCategory,
    deleteExistingIngredientCategory,

    // Computed counts
    itemCategoryCount: itemCategories.length,
    ingredientCategoryCount: ingredientCategories.length,
    totalCategoryCount: itemCategories.length + ingredientCategories.length,

    // New functions
    getItemsByCategory,
  }
} 