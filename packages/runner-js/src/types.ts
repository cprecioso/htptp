import * as Hurl from "@htptp/hurl-types"

export interface Options {
  signal?: AbortSignal
}

export type Assertions = Omit<Hurl.Response, "captures">

export type CapturedValues = Map<string, any>
