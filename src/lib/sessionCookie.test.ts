import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { browserNodeUrl, buildNodeTarget } from "./nodeProxy.ts"
import { publicLoginBody, sessionCookieOptions } from "./sessionCookie.ts"

describe("website session", () => {
  it("keeps the session cookie out of JavaScript", () => {
    const options = sessionCookieOptions(60, true)
    assert.equal(options.httpOnly, true)
    assert.equal(options.secure, true)
    assert.equal(options.sameSite, "lax")
  })

  it("returns the account fields without the token", () => {
    const body = publicLoginBody({
      uuid: "user-1",
      email: "a@example.com",
      name: "A",
      token: "secret",
    } as { uuid: string; email: string; name: string })
    assert.deepEqual(body, { success: true, uuid: "user-1", email: "a@example.com", name: "A" })
    assert.equal("token" in body, false)
  })

  it("sends signed-in Node API calls through the website", () => {
    const base = "https://api.example.com"
    assert.equal(browserNodeUrl(`${base}/ingredient?x=1`, base), "/api/node/ingredient?x=1")
    assert.equal(browserNodeUrl(`${base}/login`, base), null)
    assert.equal(browserNodeUrl(`${base}/forgot-password`, base), null)
  })

  it("rejects a proxy path that leaves the API host", () => {
    assert.equal(buildNodeTarget("https://api.example.com", ["..", "admin"], ""), null)
    assert.equal(
      buildNodeTarget("https://api.example.com", ["ingredient"], ""),
      "https://api.example.com/ingredient"
    )
  })
})
