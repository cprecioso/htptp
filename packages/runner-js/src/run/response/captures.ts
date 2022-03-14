import * as Hurl from "@htptp/hurl-types"
import { ResponseContext } from "../../types"
import { runQuery } from "./query"

export const runCaptures = async (
  captures: Hurl.Capture[],
  ctx: ResponseContext
) => {
  const { capturedValues } = ctx

  for (const capture of captures) {
    const result = await runQuery(capture.query, ctx)
    capturedValues.set(capture.name, result)
  }
}
