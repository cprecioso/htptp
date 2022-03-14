import * as Hurl from "@htptp/hurl-types"
import { Response as FetchResponse } from "@htptp/polyfill-fetch"
import { evaluateXpath } from "@htptp/polyfill-xpath"
import { unsupportedEngine, unsupportedHurl } from "./error"

export const runQuery = async (response: FetchResponse, query: Hurl.Query) => {
  if (query.subquery) throw unsupportedHurl("Subquery")

  switch (query.type) {
    case "status":
      return response.status

    case "header":
      return response.headers.get(query.name)

    case "cookie":
      throw unsupportedHurl("Cookie Query")

    case "body":
      return await response.text()

    case "bytes":
      return await response.arrayBuffer()

    case "xpath":
      return evaluateXpath(query.expr, await response.text())

    case "jsonpath":
      throw unsupportedHurl("JSONPath Query")

    case "regex":
      return (await response.text()).match(new RegExp(query.expr))?.[0][1]

    case "variable":
      throw unsupportedHurl("Variable Query")

    case "duration":
      throw unsupportedEngine("Duration Query")

    default:
      throw unsupportedHurl("Unknown Query")
  }
}
