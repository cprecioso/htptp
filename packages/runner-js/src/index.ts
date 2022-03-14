import { Document } from "@htptp/hurl-types"
import { Runner } from "./Runner"
import { Options } from "./types"

export const run = async (document: Document, options: Partial<Options> = {}) =>
  await new Runner(document, options).run()
