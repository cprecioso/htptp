import * as Hurl from "@htptp/hurl-types"
import { runDocument } from "./run"
import { makeInterpolator } from "./run/interpolation"
import { CapturedValues, ReadonlyCapturedValues, RunOptions } from "./types"

export interface Options extends Partial<RunOptions> {
  initialVariables?: ReadonlyCapturedValues
}

export const run = async (
  document: Hurl.Document,
  { initialVariables, signal }: Options = {}
) => {
  const capturedValues: CapturedValues = new Map(...(initialVariables ?? []))
  const interpolate = makeInterpolator(capturedValues)

  await runDocument(document, {
    capturedValues,
    interpolate,
    options: { signal },
  })

  return capturedValues
}
