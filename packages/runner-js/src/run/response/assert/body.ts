import * as Hurl from "@htptp/hurl-types"
import assert from "@htptp/polyfill-assert"
import { decode as base64Decode } from "base64-arraybuffer"
import { equalArrayBuffer } from "../../../binary"
import { unsupportedHurl } from "../../../error"
import { ResponseContext } from "../../../types"

export const runBodyAssertion = async (
  body: Hurl.Body,
  ctx: ResponseContext
) => {
  const {
    response,
    interpolate,
    options: { loader },
  } = ctx

  switch (body.type) {
    case "file": {
      const actualFile = await response.arrayBuffer()
      const expectedFile = await loader(body.filename)
      assert(await equalArrayBuffer(actualFile, expectedFile))
      return
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
      throw unsupportedHurl(
        "XML Body Assertion",
        "use a raw string body assertion"
      )

    case undefined: {
      switch (body.encoding) {
        case "base64": {
          const actualFile = await response.arrayBuffer()
          const expectedFile = base64Decode(body.value)
          assert(await equalArrayBuffer(actualFile, expectedFile))
          return
        }

        default:
          throw unsupportedHurl(`Unknown Body Assertion Encoding`)
      }
    }

    default:
      throw unsupportedHurl(`Unknown Body Assertion Type`)
  }
}
