import assert from "@htptp/polyfill-assert"
import { unsupportedEngine } from "../../../error"
import { Assertions, ResponseContext } from "../../../types"
import { runBodyAssertion } from "./body"
import { runExplicitAssertion } from "./explicit"

export const runAssertions = async (
  { version, status, body, headers, asserts }: Assertions,
  ctx: ResponseContext
) => {
  const { response } = ctx

  if (version && version !== "HTTP/*") {
    throw unsupportedEngine("HTTP Version Assertion")
  }

  if (status) {
    assert.strictEqual(response.status, status)
  }

  if (body) {
    await runBodyAssertion(body, ctx)
  }

  if (headers) {
    for (const { name, value } of headers) {
      assert.strictEqual(response.headers.get(name), value)
    }
  }

  if (asserts) {
    for (const assertion of asserts) {
      await runExplicitAssertion(assertion, ctx)
    }
  }
}
