import * as Hurl from "@htptp/hurl-types"
import { fileNotFound } from "./error"
import { runDocument } from "./run"
import { BindingRegistry, InputBindingRegistry } from "./run/captured"
import { RunOptions } from "./types"

export interface Options extends Partial<RunOptions> {
  initialVariables?: InputBindingRegistry
}

export const run = async (
  document: Hurl.Document,
  { initialVariables, signal, loader }: Options = {}
) => {
  const capturedValues = new BindingRegistry(initialVariables)

  const loaderWrapper: RunOptions["loader"] = loader
    ? (filename) => {
        const result = loader(filename)
        if (!result) throw fileNotFound(filename)
        return result
      }
    : (filename) => {
        throw fileNotFound(filename)
      }

  await runDocument(document, {
    capturedValues,
    interpolate: capturedValues.interpolate,
    options: { signal, loader: loaderWrapper },
  })

  return capturedValues
}
