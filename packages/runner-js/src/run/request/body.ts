import * as Hurl from "@htptp/hurl-types"
import { decode as base64ToBuffer } from "base64-arraybuffer"
import { unknownHurl } from "../../error"
import { RequestContext } from "../../types"

export const runBody = async (body: Hurl.Body, ctx: RequestContext) => {
  const {
    req,
    headers,
    interpolate,
    options: { loader },
  } = ctx

  const { type } = body
  switch (type) {
    case "file":
      req.body = await loader(body.filename)
      return

    case "json": {
      headers.set("Content-Type", "application/json")
      req.body = interpolate(JSON.stringify(body.value))
      return
    }

    case "raw-string":
    case "xml": {
      req.body = interpolate(body.value)
      return
    }

    case undefined: {
      const { encoding } = body
      switch (encoding) {
        case "base64": {
          req.body = base64ToBuffer(body.value)
          return
        }

        default:
          throw unknownHurl(`Request Body Encoding`, encoding)
      }
    }

    default:
      throw unknownHurl(`Request Body Type`, type)
  }
}
