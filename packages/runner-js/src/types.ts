import * as Hurl from "@htptp/hurl-types"
import {
  Headers,
  RequestInit as FetchRequest,
  Response as FetchResponse,
} from "@htptp/polyfill-fetch"
import { BindingRegistry } from "./run/captured"

export interface RunOptions {
  signal?: AbortSignal
}

export type Interpolator = (input: string) => string

export interface EntryContext {
  options: Readonly<RunOptions>
  capturedValues: BindingRegistry
  interpolate: Interpolator
}

export interface RequestContext {
  options: Readonly<RunOptions>
  url: URL
  req: FetchRequest
  headers: Headers
  capturedValues: BindingRegistry
  interpolate: Interpolator
}

export type Assertions = Omit<Hurl.Response, "captures">

export interface ResponseContext {
  options: Readonly<RunOptions>
  response: FetchResponse
  capturedValues: BindingRegistry
  interpolate: Interpolator
}
