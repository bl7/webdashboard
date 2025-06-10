import toast from "react-hot-toast"

interface SaveDataOptions {
  method?: "POST" | "PUT" | "PATCH"
  successMessage?: string
  errorMessage?: string
}

export async function saveData<T = any>(
  url: string,
  body: T,
  {
    method = "PUT",
    successMessage = "Saved successfully",
    errorMessage = "Failed to save",
  }: SaveDataOptions = {}
): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(err || errorMessage)
    }

    toast.success(successMessage)
    return true
  } catch (err: any) {
    toast.error(err.message || errorMessage)
    return false
  }
}
