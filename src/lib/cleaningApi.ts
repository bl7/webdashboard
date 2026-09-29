const apiBase = () => process.env.NEXT_PUBLIC_API_URL || ""

function authHeaders(token: string | null, json = true): HeadersInit {
  return {
    Accept: "application/json",
    ...(json ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
  }
}

async function parseJson(response: Response) {
  const contentType = response.headers.get("content-type")
  const data =
    contentType && contentType.includes("application/json") ? await response.json() : {}
  if (!response.ok) {
    throw new Error(data.message || "Cleaning request failed")
  }
  return data
}

export async function cleaningGet(path: string, token: string | null) {
  const response = await fetch(`${apiBase()}${path}`, { headers: authHeaders(token) })
  return parseJson(response)
}

export async function cleaningSend(
  path: string,
  token: string | null,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown
) {
  const response = await fetch(`${apiBase()}${path}`, {
    method,
    headers: authHeaders(token, body !== undefined),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  return parseJson(response)
}

export async function downloadCleaningPdf(token: string | null, query: string) {
  const response = await fetch(`${apiBase()}/cleaning/history/pdf?${query}`, {
    headers: authHeaders(token, false),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || "Could not export the cleaning record")
  }
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "cleaning-record.pdf"
  link.click()
  URL.revokeObjectURL(url)
}

export function cleaningToken() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}
