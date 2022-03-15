import * as Hurl from "@htptp/hurl-types"
import { evaluateXpath } from "@htptp/polyfill-xpath"
import { unsupportedEngine, unsupportedHurl } from "../../error"
import { ResponseContext } from "../../types"

const runMainQuery = async (
  query: Hurl.Query,
  { response, interpolate, capturedValues }: ResponseContext
) => {
  switch (query.type) {
    case "status":
      return response.status

    case "header":
      return response.headers.get(interpolate(query.name))

    case "cookie":
      throw unsupportedHurl("Cookie Query")

    case "body":
      return await response.text()

    case "bytes":
      return await response.arrayBuffer()

    case "xpath":
      return evaluateXpath(interpolate(query.expr), await response.text())

    case "jsonpath":
      throw unsupportedHurl("JSONPath Query")

    case "regex":
      return (await response.text()).match(
        new RegExp(interpolate(query.expr))
      )?.[0][1]

    case "variable":
      return capturedValues.get(interpolate(query.name))

    case "duration":
      throw unsupportedEngine("Duration Query")

    default:
      throw unsupportedHurl("Unknown Query")
  }
}

export const runQuery = async (query: Hurl.Query, ctx: ResponseContext) => {
  if (query.subquery) throw unsupportedHurl("Subquery")

  const result = await runMainQuery(query, ctx)

  return result
}
