import { parse as hurlParse } from "../rust/pkg"
import * as Hurl from "./types"

export type { Hurl }

export const parse = (input: string): Hurl.Document => {
  const result = hurlParse(input)
  if (!result) throw new Error("Unrecognized input")
  return JSON.parse(result)
}
