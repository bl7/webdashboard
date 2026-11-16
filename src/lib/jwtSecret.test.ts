import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import { getJwtSecret, JwtSecretError } from "./jwtSecret.ts"

const original = process.env.JWT_SECRET

afterEach(() => {
  if (original === undefined) delete process.env.JWT_SECRET
  else process.env.JWT_SECRET = original
})

describe("JWT secret", () => {
  it("rejects a missing secret", () => {
    delete process.env.JWT_SECRET
    assert.throws(() => getJwtSecret(), JwtSecretError)
  })

  it("rejects the changeme fallback", () => {
    process.env.JWT_SECRET = "changeme"
    assert.throws(() => getJwtSecret(), JwtSecretError)
  })

  it("returns a configured secret", () => {
    process.env.JWT_SECRET = "configured-secret"
    assert.equal(getJwtSecret(), "configured-secret")
  })
})
