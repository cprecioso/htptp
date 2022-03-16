import * as Hurl from "@htptp/hurl-types"
import { unsupportedHurl } from "../../../error"
import { ResponseContext } from "../../../types"

export const runExplicitAssertion = async (
  assertion: Hurl.Assertion,
  ctx: ResponseContext
) => {
  throw unsupportedHurl("Explicit Assertions")
}
