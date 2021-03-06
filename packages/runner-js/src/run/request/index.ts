import * as Hurl from "@htptp/hurl-types"
import fetch, {
  File,
  FormData,
  Headers,
  RequestInit as FetchRequest,
} from "@htptp/polyfill-fetch"
import { encode as base64Encode } from "universal-base64"
import { unsupportedHurl } from "../../error"
import { EntryContext, RequestContext } from "../../types"
import { runBody } from "./body"

const isFilePair = (v: any): v is Hurl.FilePair => v.filename

const makeAddPairs =
  ({ interpolate, options: { loader } }: RequestContext) =>
  async <
    T extends {
      append(name: string, value: string | File): void
    }
  >(
    target: T,
    pairs: (Hurl.Pair | Hurl.FilePair)[]
  ) => {
    for (const pair of pairs) {
      if (isFilePair(pair)) {
        const file = new File([await loader(pair.filename)], pair.filename, {
          type: pair.content_type,
        })
        target.append(interpolate(pair.name), file)
      } else {
        target.append(interpolate(pair.name), interpolate(pair.value))
      }
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
  { options, capturedValues, interpolate }: EntryContext
) => {
  const url = new URL(interpolate(explicitUrl))
  const headers = new Headers()
  const req: FetchRequest = {}

  const ctx: RequestContext = {
    url,
    headers,
    req,
    options,
    capturedValues,
    interpolate,
  }

  const addPairs = makeAddPairs(ctx)

  req.method = method

  if (query_string_params) {
    addPairs(url.searchParams, query_string_params)
  }

  if (basic_auth) {
    headers.set(
      "Authorization",
      `Basic ${base64Encode(
        `${interpolate(basic_auth.name)}:${interpolate(basic_auth.value)}`
      )}`
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
    req.body = await addPairs(new URLSearchParams(), form_params)
  }

  if (multipart_form_data) {
    headers.set("Content-Type", "multipart/form-data")
    req.body = await addPairs(new FormData(), multipart_form_data)
  }

  if (explicitHeaders) {
    addPairs(headers, explicitHeaders)
  }

  return await fetch(url.href, {
    ...req,
    headers,
    signal: options.signal,
  })
}
