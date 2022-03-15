import * as Hurl from "@htptp/hurl-types"
import { runDocument } from "./run"
import { CapturedValues, ReadonlyCapturedValues, RunOptions } from "./types"

export interface Options extends Partial<RunOptions> {
  initialVariables?: ReadonlyCapturedValues
}

export const run = async (
  document: Hurl.Document,
  { initialVariables, signal }: Options = {}
) => {
  const capturedValues: CapturedValues = new Map(...(initialVariables ?? []))

  await runDocument(document, { capturedValues, options: { signal } })

  return capturedValues
}
