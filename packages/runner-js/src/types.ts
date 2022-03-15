import * as Hurl from "@htptp/hurl-types"
import {
  Headers,
  RequestInit as FetchRequest,
  Response as FetchResponse,
} from "@htptp/polyfill-fetch"

export interface RunOptions {
  signal?: AbortSignal
}

export type Interpolator = (input: string) => string

export interface EntryContext {
  options: Readonly<RunOptions>
  capturedValues: CapturedValues
  interpolate: Interpolator
}

export interface RequestContext {
  options: Readonly<RunOptions>
  url: URL
  req: FetchRequest
  headers: Headers
  capturedValues: CapturedValues
  interpolate: Interpolator
}

export type Assertions = Omit<Hurl.Response, "captures">

export type CapturedValues = Map<string, any>
export type ReadonlyCapturedValues = ReadonlyMap<string, any>

export interface ResponseContext {
  options: Readonly<RunOptions>
  response: FetchResponse
  capturedValues: CapturedValues
  interpolate: Interpolator
}
