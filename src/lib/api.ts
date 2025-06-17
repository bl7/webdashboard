import IngredientsTable from "@/app/dashboard/ingredients/page"
import { logAction } from "@/lib/logAction"

export async function registerUser(data: any) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
    // credentials: "include",
  })

  const contentType = response.headers.get("content-type")
  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Registration failed")
    } else {
      const errorText = await response.text()
      console.error("Server responded with non-JSON:", errorText)
      throw new Error("Unexpected server response. Check API URL.")
    }
  }

  return await response.json()
}

export async function loginUser(data: any) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
    // credentials: "include",
  })

  const contentType = response.headers.get("content-type")
  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Login failed")
    } else {
      const errorText = await response.text()
      console.error("Server responded with non-JSON:", errorText)
      throw new Error("Unexpected server response. Check API URL.")
    }
  }

  return await response.json()
}

// Allergen
export async function getAllAllergens(token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/allergens`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const contentType = response.headers.get("content-type")
  if (!response.ok) {
    await logAction("getAllAllergens_failed", { status: response.status })
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Registration failed")
    } else {
      const errorText = await response.text()
      throw new Error("Unexpected server response. Check API URL.")
    }
  }

  const data = await response.json()
  return data
}

export async function addAllergens(data: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customallergens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ allergenName: data }),
  })

  const contentType = response.headers.get("content-type")
  if (!response.ok) {
    await logAction("addAllergens_failed", { allergenName: data })
    if (contentType?.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Add allergen failed")
    } else {
      const errorText = await response.text()
      throw new Error("Unexpected server response")
    }
  }

  const resData = await response.json()
  await logAction("addAllergens_success", resData)
  return resData
}

export async function updateAllergen(id: string, allergenName: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customallergens/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ allergenName }),
  })

  const contentType = response.headers.get("content-type")
  if (!response.ok) {
    await logAction("updateAllergen_failed", { id, allergenName, status: response.status })
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Update allergen failed")
    } else {
      const errorText = await response.text()
      throw new Error("Unexpected server response. Check API URL.")
    }
  }

  const data = await response.json()
  await logAction("updateAllergen_success", data)
  return data
}

export async function deleteAllergen(id: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customallergens/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    await logAction("deleteAllergen_failed", { id, status: response.status })
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Delete allergen failed")
    } else {
      const errorText = await response.text()
      throw new Error("Unexpected server response. Check API URL.")
    }
  }

  // DELETE might return 204 No Content, so check if there's content before parsing
  let data = { success: true }
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    data = await response.json()
  }

  await logAction("deleteAllergen_success", { id })
  return data
}
// Allergen

// Ingredients Routes
export async function getAllIngredients(token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const contentType = response.headers.get("content-type")
  if (!response.ok) {
    await logAction("getAllIngredients_failed", { status: response.status })
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch ingredients")
    } else {
      const errorText = await response.text()
      throw new Error("Unexpected server response. Check API URL.")
    }
  }

  const data = await response.json()
  return data
}

export async function addIngredient(
  data: {
    ingredientName: string
    expiryDays: number
    allergenIDs: string[]
  },
  token: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ingredientName: data.ingredientName,
      expiryDays: data.expiryDays,
      allergenIDs: data.allergenIDs,
    }),
  })

  if (!res.ok) {
    await logAction("addIngredient_failed", data)
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Failed to add ingredient")
    } else {
      const errText = await res.text()
      throw new Error(errText || "Failed to add ingredient")
    }
  }

  const resData = await res.json()
  await logAction("addIngredient_success", resData)
  return resData
}

// Optional: Add function to update ingredient with allergens
export async function updateIngredient(
  ingredientId: string,
  data: {
    ingredientName: string
    expiryDays: number
    allergenIDs: string[]
  },
  token: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${ingredientId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ingredientName: data.ingredientName,
      expiryDays: data.expiryDays,
      allergenIDs: data.allergenIDs,
    }),
  })

  if (!res.ok) {
    await logAction("updateIngredient_failed", { ingredientId, ...data })
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Failed to update ingredient")
    } else {
      const errText = await res.text()
      throw new Error(errText || "Failed to update ingredient")
    }
  }

  const resData = await res.json()
  await logAction("updateIngredient_success", resData)
  return resData
}

// Optional: Add function to delete ingredient
export async function deleteIngredient(ingredientId: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${ingredientId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    await logAction("deleteIngredient_failed", { ingredientId })
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Failed to delete ingredient")
    } else {
      const errText = await res.text()
      throw new Error(errText || "Failed to delete ingredient")
    }
  }

  await logAction("deleteIngredient_success", { ingredientId })
  return true
}
// Ingredients

export async function getAllMenuItems(token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const contentType = response.headers.get("content-type")
  if (!response.ok) {
    await logAction("getAllMenuItems_failed", { status: response.status })
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Registration failed")
    } else {
      const errorText = await response.text()
      throw new Error("Unexpected server response. Check API URL.")
    }
  }

  const data = await response.json()
  return data
}

export async function addMenuItems(data: any, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    await logAction("addMenuItems_failed", data)
    const errText = await res.text()
    throw new Error(errText || "Failed to add ingredient")
  }

  const resData = await res.json()
  await logAction("addMenuItems_success", resData)
  return resData
}
