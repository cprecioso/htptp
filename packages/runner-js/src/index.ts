import * as Hurl from "@htptp/hurl-types"
import { runDocument } from "./run"
import { BindingRegistry, InputBindingRegistry } from "./run/captured"
import { RunOptions } from "./types"

export interface Options extends Partial<RunOptions> {
  initialVariables?: InputBindingRegistry
}

export const run = async (
  document: Hurl.Document,
  { initialVariables, signal }: Options = {}
) => {
  const capturedValues = new BindingRegistry(initialVariables)

  await runDocument(document, {
    capturedValues,
    interpolate: capturedValues.interpolate,
    options: { signal },
  })

  return capturedValues
}
