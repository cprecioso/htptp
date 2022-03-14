import * as Hurl from "@htptp/hurl-types"
import fetch, { FormData, Headers, RequestInit } from "@htptp/polyfill-fetch"
import { decode as base64ToBuffer } from "base64-arraybuffer"
import { encode as base64Encode } from "universal-base64"
import { unsupportedHurl } from "./error"
import { Options } from "./types"
import { addPairs } from "./util"

export class Request {
  constructor(
    public readonly options: Readonly<Options>,
    request: Hurl.Request
  ) {
    this.url = new URL(request.url)
    this.prepare(request)
  }

  readonly url!: URL
  readonly req: RequestInit = {}
  readonly headers = new Headers()

  prepare({
    method,
    basic_auth,
    body,
    cookies,
    form_params,
    headers,
    multipart_form_data,
    query_string_params,
  }: Hurl.Request) {
    this.req.method = method

    if (query_string_params) {
      addPairs(this.url.searchParams, query_string_params)
    }

    if (basic_auth) {
      this.headers.set(
        "Authorization",
        `Basic ${base64Encode(`${basic_auth.name}:${basic_auth.value}`)}`
      )
    }

    if (body) {
      this.prepareBody(body)
    }

    if (cookies) {
      throw unsupportedHurl("Cookie Request Option")
    }

    if (form_params) {
      this.headers.set("Content-Type", "application/x-www-form-urlencoded")
      this.req.body = addPairs(new URLSearchParams(), form_params)
    }

    if (multipart_form_data) {
      this.headers.set("Content-Type", "multipart/form-data")
      this.req.body = addPairs(new FormData(), multipart_form_data)
    }

    if (headers) {
      addPairs(this.headers, headers)
    }
  }

  prepareBody(body: Hurl.Body) {
    switch (body.type) {
      case "file":
        throw unsupportedHurl(
          "File Request Body",
          "embed the data directly in the document"
        )

      case "json": {
        this.headers.set("Content-Type", "application/json")
        this.req.body = JSON.stringify(body.value)
        return
      }

      case "raw-string":
      case "xml": {
        this.req.body = body.value
        return
      }

      case undefined: {
        switch (body.encoding) {
          case "base64": {
            this.req.body = base64ToBuffer(body.value)
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

  async run() {
    return await fetch(this.url.href, {
      ...this.req,
      headers: this.headers,
      signal: this.options.signal,
    })
  }
}
