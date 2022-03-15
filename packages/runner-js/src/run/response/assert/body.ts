import * as Hurl from "@htptp/hurl-types"
import assert from "@htptp/polyfill-assert"
import { decode as base64Decode } from "base64-arraybuffer"
import { unsupportedHurl } from "../../../error"
import { ResponseContext } from "../../../types"

const equalArrayBuffer = (a_: ArrayBuffer, b_: ArrayBuffer): boolean => {
  if (a_.byteLength !== b_.byteLength) return false

  const a = new Uint8Array(a_)
  const b = new Uint8Array(b_)

  return a.every((v, i) => v === b[i])
}

export const runBodyAssertion = async (
  body: Hurl.Body,
  ctx: ResponseContext
) => {
  const { response, interpolate } = ctx

  switch (body.type) {
    case "file": {
      throw unsupportedHurl("File Body Assertion")
    }

    case "json": {
      assert.deepStrictEqual(
        await response.json(),
        JSON.parse(interpolate(JSON.stringify(body.value)))
      )
      return
    }

    case "raw-string": {
      assert.strictEqual(await response.text(), interpolate(body.value))
      return
    }

    case "xml":
      throw unsupportedHurl("XML Body Assertion")

    case undefined: {
      switch (body.encoding) {
        case "base64": {
          assert(
            equalArrayBuffer(
              await response.arrayBuffer(),
              base64Decode(body.value)
            )
          )
        }

        default:
          throw unsupportedHurl(`Unknown Body Assertion Encoding`)
      }
    }

    default:
      throw unsupportedHurl(`Unknown Body Assertion Type`)
  }
}
