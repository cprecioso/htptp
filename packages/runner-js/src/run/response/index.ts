import * as Hurl from "@htptp/hurl-types"
import { ResponseContext } from "../../types"
import { runAssertions } from "./assert"
import { runCaptures } from "./captures"

export const runResponse = async (
  { captures, ...assertions }: Hurl.Response,
  ctx: ResponseContext
) => {
  if (captures) {
    await runCaptures(captures, ctx)
  }

  await runAssertions(assertions, ctx)
}
