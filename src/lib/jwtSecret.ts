export class JwtSecretError extends Error {
  constructor() {
    super("JWT_SECRET is not configured")
    this.name = "JwtSecretError"
  }
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret === "changeme") {
    throw new JwtSecretError()
  }
  return secret
}
