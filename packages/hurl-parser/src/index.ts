import { parse as hurlParse } from "../rust/pkg"
import { Document } from "@htptp/hurl-types"

export const parse = (input: string): Document => {
  try {
    const result = hurlParse(input)
    return JSON.parse(result)
  } catch (error) {
    if (!(error instanceof Error)) {
      error = new Error("" + error)
    }
    throw error
  }
}
