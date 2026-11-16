export const CUSTOMER_COOKIE = "token"
export const BOSS_COOKIE = "bossToken"
export const CUSTOMER_MAX_AGE = 60 * 60 * 24 * 7
export const BOSS_MAX_AGE = 60 * 60 * 24

export function sessionCookieOptions(maxAge: number, secure: boolean) {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  }
}

export function publicLoginBody(data: { uuid?: unknown; email?: unknown; name?: unknown } | null) {
  return {
    success: true,
    uuid: typeof data?.uuid === "string" ? data.uuid : null,
    email: typeof data?.email === "string" ? data.email : null,
    name: typeof data?.name === "string" ? data.name : null,
  }
}
