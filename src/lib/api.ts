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
  await logAction("getAllAllergens_success", data)
  return data
}

export async function addAllergens(data: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
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
      throw new Error(errorData.message || "Registration failed")
    } else {
      const errorText = await response.text()
      throw new Error("Unexpected server response. Check API URL.")
    }
  }

  const data = await response.json()
  await logAction("getAllIngredients_success", data)
  return data
}

export async function addIngredient(data: any, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    await logAction("addIngredient_failed", data)
    const errText = await res.text()
    throw new Error(errText || "Failed to add ingredient")
  }

  const resData = await res.json()
  await logAction("addIngredient_success", resData)
  return resData
}

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
  await logAction("getAllMenuItems_success", data)
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
