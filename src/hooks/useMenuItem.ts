import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getAllMenuItems, addMenuItems, getMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/api"

export type MenuItem = {
  menuItemID: string
  menuItemName: string
  expiryDays?: number
  categoryID?: string
  ingredients: {
    uuid: string
    ingredientName: string
    category?: {
      uuid: string
      categoryName: string
    }
  }[]
  allergens: {
    uuid: string
    allergenName: string
  }[]
}

type AddMenuItemData = {
  menuItemName: string
  ingredientIDs: string[]
  categoryID?: string
}

type UpdateMenuItemData = {
  menuItemName?: string
  ingredientIDs?: string[]
  categoryID?: string
}

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all menu items
  const fetchMenuItems = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Authentication token not found")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await getAllMenuItems(token)
      if (!res?.data) {
        setMenuItems([])
        return
      }

      // Flatten the grouped data into a single array
      const flattenedMenuItems: MenuItem[] = []
      for (const category of res.data) {
        if (!category.items) continue
        for (const item of category.items) {
          flattenedMenuItems.push({
            menuItemID: item.menuItemID,
            menuItemName: item.menuItemName,
            expiryDays: item.expiryDays,
            categoryID: item.categoryID,
            ingredients: item.ingredients || [],
            allergens: item.allergens || [],
          })
        }
      }

      setMenuItems(flattenedMenuItems)
      setError(null)
    } catch (err: any) {
      console.error("Error fetching menu items:", err)
      const errorMessage = err.message || "Failed to fetch menu items"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Add new menu item
  const addNewMenuItem = async (menuItemData: AddMenuItemData) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      const response = await addMenuItems(menuItemData, token)
      
      // Refresh the menu items list to get the updated data
      await fetchMenuItems()
      
      toast.success("Menu item added successfully")
      return true
    } catch (err: any) {
      console.error("Error adding menu item:", err)
      toast.error(err.message || "Failed to add menu item")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Update existing menu item
  const updateExistingMenuItem = async (menuItemId: string, menuItemData: UpdateMenuItemData) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      await updateMenuItem(menuItemId, menuItemData, token)
      
      // Refresh the menu items list to get the updated data
      await fetchMenuItems()
      
      toast.success("Menu item updated successfully")
      return true
    } catch (err: any) {
      console.error("Error updating menu item:", err)
      toast.error(err.message || "Failed to update menu item")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Delete menu item
  const deleteExistingMenuItem = async (menuItemId: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      await deleteMenuItem(menuItemId, token)
      
      // Remove from local state
      setMenuItems((prev) => prev.filter((item) => item.menuItemID !== menuItemId))
      
      toast.success("Menu item deleted successfully")
      return true
    } catch (err: any) {
      console.error("Error deleting menu item:", err)
      toast.error(err.message || "Failed to delete menu item")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Get single menu item by ID
  const getMenuItemById = async (menuItemId: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return null
    }

    try {
      const response = await getMenuItem(menuItemId, token)
      return response.data
    } catch (err: any) {
      console.error("Error fetching menu item:", err)
      toast.error(err.message || "Failed to fetch menu item")
      return null
    }
  }

  // Filter menu items by search term
  const filterMenuItems = (searchTerm: string) => {
    return menuItems.filter((item) =>
      item.menuItemName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Get menu items by category
  const getMenuItemsByCategory = (categoryID?: string) => {
    if (!categoryID) return menuItems
    return menuItems.filter((item) => item.categoryID === categoryID)
  }

  // Initialize data on mount
  useEffect(() => {
    fetchMenuItems()
  }, [])

  return {
    menuItems,
    loading,
    error,
    fetchMenuItems,
    addNewMenuItem,
    updateExistingMenuItem,
    deleteExistingMenuItem,
    getMenuItemById,
    filterMenuItems,
    getMenuItemsByCategory,
  }
}
