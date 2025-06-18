import { useState, useEffect } from "react"
import { toast } from "sonner"
import { getAllMenuItems, addMenuItems } from "@/lib/api"

export type MenuItem = {
  id: string
  name: string
  ingredients: string
  ingredientIds: string[]
  status: "Active" | "Inactive"
  addedAt: string
}

type AddMenuItemData = {
  name: string
  ingredientIds: string[]
  status: string
}

type UpdateMenuItemData = {
  name: string
  ingredientIds: string[]
  status: string
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
        setError("No data found.")
        return
      }

      const menuItemsData: MenuItem[] = []
      for (const category of res.data) {
        if (!category.items) continue
        for (const item of category.items) {
          const ingredientIds = item.ingredients?.map((ing: any) => ing.ingredientID) || []
          menuItemsData.push({
            id: item.menuItemID,
            name: item.menuItemName,
            ingredients: item.ingredients
              ? item.ingredients.map((ing: any) => ing.ingredientName).join(", ")
              : "",
            ingredientIds,
            status: "Active", // default since API does not provide this
            addedAt: new Date().toISOString().split("T")[0],
          })
        }
      }

      setMenuItems(menuItemsData)
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
      // Note: You might need to update the addMenuItems API function
      // as it currently seems to post to /ingredients endpoint
      const added = await addMenuItems(menuItemData, token)

      // For now, we'll simulate the addition locally until API is fixed
      const newMenuItem: MenuItem = {
        id: (Math.random() * 100000).toFixed(0),
        name: menuItemData.name,
        ingredients: "", // Will be populated with ingredient names
        ingredientIds: menuItemData.ingredientIds,
        status: menuItemData.status as "Active" | "Inactive",
        addedAt: new Date().toISOString().split("T")[0],
      }

      setMenuItems((prev) => [...prev, newMenuItem])
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
  const updateExistingMenuItem = async (id: string, menuItemData: UpdateMenuItemData) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      // TODO: Implement updateMenuItem API call when available
      // const updated = await updateMenuItem(id, menuItemData, token)

      // For now, update locally
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                name: menuItemData.name,
                ingredientIds: menuItemData.ingredientIds,
                status: menuItemData.status as "Active" | "Inactive",
              }
            : item
        )
      )
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
  const deleteExistingMenuItem = async (id: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found")
      return false
    }

    setLoading(true)
    try {
      // TODO: Implement deleteMenuItem API call when available
      // await deleteMenuItem(id, token)

      // For now, delete locally
      setMenuItems((prev) => prev.filter((item) => item.id !== id))
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

  // Filter menu items by search term and status
  const filterMenuItems = (
    searchTerm: string,
    statusFilter: "All" | "Active" | "Inactive" = "All"
  ) => {
    return menuItems.filter((item) => {
      const matchesQuery = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = statusFilter === "All" ? true : item.status === statusFilter
      return matchesQuery && matchesFilter
    })
  }

  // Get active menu items count
  const getActiveCount = () => {
    return menuItems.filter((item) => item.status === "Active").length
  }

  // Get inactive menu items count
  const getInactiveCount = () => {
    return menuItems.filter((item) => item.status === "Inactive").length
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
    filterMenuItems,
    getActiveCount,
    getInactiveCount,
  }
}
