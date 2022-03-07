import { parse as hurlParse } from "../rust/pkg"
import * as Hurl from "./types"

export type { Hurl }

export const parse = (input: string): Hurl.Document => {
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
