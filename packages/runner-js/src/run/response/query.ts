import * as Hurl from "@htptp/hurl-types"
import { evaluateXpath } from "@htptp/polyfill-xpath"
import { unsupportedEngine, unsupportedHurl } from "../../error"
import { ResponseContext } from "../../types"

const runRegexQuery = async (
  input: string,
  query: Hurl.RegexQuery,
  { interpolate }: ResponseContext
) => ("" + input).match(new RegExp(interpolate(query.expr)))?.[0][1]

const runSubquery = async (
  input: any,
  query: Hurl.Query["subquery"],
  ctx: ResponseContext
) => {
  switch (query.type) {
    case "regex":
      return await runRegexQuery(input, query, ctx)

    case "count":
      return input.length

    default:
      throw unsupportedHurl("Unknown Subquery")
  }
}

const runMainQuery = async (query: Hurl.Query, ctx: ResponseContext) => {
  const { response, interpolate, capturedValues } = ctx

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
      return await runRegexQuery(await response.text(), query, ctx)

    case "variable":
      return capturedValues.get(interpolate(query.name))

    case "duration":
      throw unsupportedEngine("Duration Query")

    default:
      throw unsupportedHurl("Unknown Query")
  }
}

export const runQuery = async (query: Hurl.Query, ctx: ResponseContext) => {
  const result = await runMainQuery(query, ctx)

  if (query.subquery) {
    return await runSubquery(result, query.subquery, ctx)
  } else {
    return result
  }
}
