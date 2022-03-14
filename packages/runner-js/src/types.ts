import * as Hurl from "@htptp/hurl-types"
import {
  Headers,
  RequestInit as FetchRequest,
  Response as FetchResponse,
} from "@htptp/polyfill-fetch"

export interface Options {
  signal?: AbortSignal
}

export interface EntryContext {
  options: Readonly<Options>
  capturedValues: CapturedValues
}

export interface RequestContext {
  options: Readonly<Options>
  url: URL
  req: FetchRequest
  headers: Headers
  capturedValues: CapturedValues
}

export type Assertions = Omit<Hurl.Response, "captures">

export type CapturedValues = Map<string, any>

export interface ResponseContext {
  options: Readonly<Options>
  response: FetchResponse
  capturedValues: CapturedValues
}
