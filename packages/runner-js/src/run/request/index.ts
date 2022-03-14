import * as Hurl from "@htptp/hurl-types"
import fetch, {
  FormData,
  Headers,
  RequestInit as FetchRequest,
} from "@htptp/polyfill-fetch"
import { encode as base64Encode } from "universal-base64"
import { unsupportedHurl } from "../../error"
import { EntryContext, RequestContext } from "../../types"
import { runBody } from "./body"

const isFilePair = (v: any): v is Hurl.FilePair => v.filename

const addPairs = <T extends { append(name: string, value: string): void }>(
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

export const runRequest = async (
  {
    url: explicitUrl,
    method,
    basic_auth,
    body,
    cookies,
    form_params,
    headers: explicitHeaders,
    multipart_form_data,
    query_string_params,
  }: Hurl.Request,
  { options, capturedValues }: EntryContext
) => {
  const url = new URL(explicitUrl)
  const headers = new Headers()
  const req: FetchRequest = {}

  const ctx: RequestContext = { url, headers, req, options, capturedValues }

  req.method = method

  if (query_string_params) {
    addPairs(url.searchParams, query_string_params)
  }

  if (basic_auth) {
    headers.set(
      "Authorization",
      `Basic ${base64Encode(`${basic_auth.name}:${basic_auth.value}`)}`
    )
  }

  if (body) {
    await runBody(body, ctx)
  }

  if (cookies) {
    throw unsupportedHurl("Cookie Request Option")
  }

  if (form_params) {
    headers.set("Content-Type", "application/x-www-form-urlencoded")
    req.body = addPairs(new URLSearchParams(), form_params)
  }

  if (multipart_form_data) {
    headers.set("Content-Type", "multipart/form-data")
    req.body = addPairs(new FormData(), multipart_form_data)
  }

  if (explicitHeaders) {
    addPairs(headers, explicitHeaders)
  }

  return await fetch(url.href, {
    ...req,
    headers: headers,
    signal: options.signal,
  })
}
