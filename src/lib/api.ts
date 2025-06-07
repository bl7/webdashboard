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
export async function addAllergens(data: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/allergens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      allergenName: data,
      // isCustom: true,
    }),
  })

  const contentType = response.headers.get("content-type")

  if (!response.ok) {
    if (contentType?.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Add allergen failed")
    } else {
      const errorText = await response.text()
      console.error("Server responded with non-JSON:", errorText)
      throw new Error("Unexpected server response")
    }
  }

  return await response.json()
}

export async function getAllIngredients(token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
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
    const errText = await res.text()
    throw new Error(errText || "Failed to add ingredient")
  }

  return await res.json()
}

export async function getAllMenuItems(token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
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
    const errText = await res.text()
    throw new Error(errText || "Failed to add ingredient")
  }

  return await res.json()
}
