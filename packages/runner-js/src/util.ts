import * as Hurl from "@htptp/hurl-types"
import { unsupportedHurl } from "./error"

const isFilePair = (v: any): v is Hurl.FilePair => v.filename

export const addPairs = <
  T extends { append(name: string, value: string): void }
>(
  target: T,
  pairs: (Hurl.Pair | Hurl.FilePair)[]
) => {
  for (const pair of pairs) {
    if (isFilePair(pair))
      throw unsupportedHurl("File in Multipart Form Data Request Option")
    target.append(pair.name, pair.value)
  }
  return target
}

export const equalArrayBuffer = (a_: ArrayBuffer, b_: ArrayBuffer): boolean => {
  if (a_.byteLength !== b_.byteLength) return false

  const a = new Uint8Array(a_)
  const b = new Uint8Array(b_)

  return a.every((v, i) => v === b[i])
}
