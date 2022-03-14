import { Document } from "@htptp/hurl-types"
import { runDocument } from "./run"
import { CapturedValues, Options } from "./types"

export const run = async (
  document: Document,
  options: Partial<Options> = {}
) => {
  const capturedValues: CapturedValues = new Map()

  await runDocument(document, { capturedValues, options })

  return capturedValues
}
