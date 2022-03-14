import * as Hurl from "@htptp/hurl-types"
import { decode as base64ToBuffer } from "base64-arraybuffer"
import { unsupportedHurl } from "../../error"
import { RequestContext } from "../../types"

export const runBody = async (body: Hurl.Body, ctx: RequestContext) => {
  const { req, headers } = ctx

  switch (body.type) {
    case "file":
      throw unsupportedHurl(
        "File Request Body",
        "embed the data directly in the document"
      )

    case "json": {
      headers.set("Content-Type", "application/json")
      req.body = JSON.stringify(body.value)
      return
    }

    case "raw-string":
    case "xml": {
      req.body = body.value
      return
    }

    case undefined: {
      switch (body.encoding) {
        case "base64": {
          req.body = base64ToBuffer(body.value)
          return
        }

        default:
          throw unsupportedHurl(
            `Unknown Request Body Encoding: ${body.encoding}`
          )
      }
    }

    default:
      throw unsupportedHurl(`Unknown Request Body Type`)
  }
}
