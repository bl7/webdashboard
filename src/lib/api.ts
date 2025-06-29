
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customAllergens`, {
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
    if (contentType?.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Add allergen failed")
    } else {
      const errorText = await response.text()
      throw new Error("Unexpected server response")
    }
  }

  const resData = await response.json()
  return resData
}

export async function updateAllergen(id: string, allergenName: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customAllergens/${id}`, {
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
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Update allergen failed")
    } else {
      const errorText = await response.text()
      throw new Error("Unexpected server response. Check API URL.")
    }
  }

  const data = await response.json()
  return data
}

export async function deleteAllergen(id: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customAllergens/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
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

// GET /ingredient/:ingredientID - Get ingredient by ID
export async function getIngredient(ingredientId: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient/${ingredientId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const contentType = response.headers.get("content-type")
  if (!response.ok) {
      if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch ingredient")
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient`, {
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient/${ingredientId}`, {
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
    return resData
}

// Optional: Add function to delete ingredient
export async function deleteIngredient(ingredientId: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient/${ingredientId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Failed to delete ingredient")
    } else {
      const errText = await res.text()
      throw new Error(errText || "Failed to delete ingredient")
    }
  }

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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
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

  const resData = await res.json()
  return resData
}

// GET /items/:menuItemID - Get menu item by ID
export async function getMenuItem(menuItemId: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${menuItemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  const contentType = response.headers.get("content-type")
  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch menu item")
    } else {
      const errorText = await response.text()
      throw new Error("Unexpected server response. Check API URL.")
    }
  }

  const data = await response.json()
  return data
}

// PUT /items/:menuItemID - Update menu item
export async function updateMenuItem(
  menuItemId: string,
  data: {
    menuItemName?: string
    ingredientIDs?: string[]
    categoryID?: string
  },
  token: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${menuItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Failed to update menu item")
    } else {
      const errText = await res.text()
      throw new Error(errText || "Failed to update menu item")
    }
  }

  const resData = await res.json()
  return resData
}

// DELETE /items/:menuItemID - Delete menu item
export async function deleteMenuItem(menuItemId: string, token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/items/${menuItemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const contentType = res.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const errorData = await res.json()
      throw new Error(errorData.message || "Failed to delete menu item")
    } else {
      const errText = await res.text()
      throw new Error(errText || "Failed to delete menu item")
    }
  }

  return true
}

export async function sendForgotPasswordEmail(email: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email }),
  })

  const contentType = response.headers.get("content-type")
  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to send reset email")
    } else {
      const errorText = await response.text()
      throw new Error(errorText || "Failed to send reset email")
    }
  }

  return await response.json()
}

export async function verifyOtpPin(email: string, pin: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-pin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, pin }),
  })

  const contentType = response.headers.get("content-type")
  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "OTP verification failed")
    } else {
      const errorText = await response.text()
      throw new Error(errorText || "OTP verification failed")
    }
  }

  return await response.json()
}

export async function resetPassword(email: string, newPassword: string, confirmPassword: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, newPassword, confirmPassword }),
  })

  const contentType = response.headers.get("content-type")
  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to reset password")
    } else {
      const errorText = await response.text()
      throw new Error(errorText || "Failed to reset password")
    }
  }

  return await response.json()
}

// Custom Allergens CRUD
export async function getAllCustomAllergens(token: string | null) {
  console.log('getAllCustomAllergens called with token:', token ? 'present' : 'missing');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customAllergens`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('getAllCustomAllergens response status:', response.status);
  if (!response.ok) {
    const errorData = await response.json();
    console.log('getAllCustomAllergens error:', errorData);
    throw new Error(errorData.message || "Failed to fetch custom allergens");
  }
  const data = await response.json();
  console.log('getAllCustomAllergens success:', data);
  return data;
}

export async function addCustomAllergen(allergenName: string, token: string | null) {
  console.log('addCustomAllergen called with:', { allergenName, token: token ? 'present' : 'missing' });
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customAllergens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ allergenName }),
  });

  console.log('addCustomAllergen response status:', response.status);
  if (!response.ok) {
    const errorData = await response.json();
    console.log('addCustomAllergen error:', errorData);
    throw new Error(errorData.message || "Failed to add custom allergen");
  }
  const data = await response.json();
  console.log('addCustomAllergen success:', data);
  return data;
}

export async function updateCustomAllergen(id: string, allergenName: string, token: string | null) {
  console.log('updateCustomAllergen called with:', { id, allergenName, token: token ? 'present' : 'missing' });
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customAllergens/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ allergenName }),
  });

  console.log('updateCustomAllergen response status:', response.status);
  if (!response.ok) {
    const errorData = await response.json();
    console.log('updateCustomAllergen error:', errorData);
    throw new Error(errorData.message || "Failed to update custom allergen");
  }
  const data = await response.json();
  console.log('updateCustomAllergen success:', data);
  return data;
}

export async function deleteCustomAllergen(id: string, token: string | null) {
  console.log('deleteCustomAllergen called with:', { id, token: token ? 'present' : 'missing' });
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customAllergens/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('deleteCustomAllergen response status:', response.status);
  if (!response.ok) {
    const errorData = await response.json();
    console.log('deleteCustomAllergen error:', errorData);
    throw new Error(errorData.message || "Failed to delete custom allergen");
  }
  const data = await response.json();
  console.log('deleteCustomAllergen success:', data);
  return data;
}

// Item Categories (Menu Item Groups) CRUD
export async function getAllItemCategories(token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch item categories");
  }
  return await response.json();
}

export async function addItemCategory(categoryName: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ categoryName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add item category");
  }
  return await response.json();
}

export async function updateItemCategory(id: string, categoryName: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ categoryName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update item category");
  }
  return await response.json();
}

export async function deleteItemCategory(id: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete item category");
  }
  return await response.json();
}

// Ingredient Categories (Ingredient Groups) CRUD
export async function getAllIngredientCategories(token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredientsCategory`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch ingredient categories");
  }
  return await response.json();
}

export async function addIngredientCategory(categoryName: string, expiryDays: number, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredientsCategory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ categoryName, expiryDays }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add ingredient category");
  }
  return await response.json();
}

export async function updateIngredientCategory(id: string, expiryDays: number, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredientsCategory/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ expiryDays }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update ingredient category");
  }
  return await response.json();
}

export async function deleteIngredientCategory(id: string, token: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredientsCategory/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete ingredient category");
  }
  return await response.json();
}
