export const VERSION = "1.6.0"

export interface Document {
  entries: Entry[]
}

export interface Entry {
  request: Request
  response?: Response
}

export interface Request {
  method: Method
  url: string
  headers?: Pair[]
  query_string_params?: Pair[]
  form_params?: Pair[]
  multipart_form_data?: (Pair | FilePair)[]
  cookies?: Pair[]
  basic_auth?: Pair
  body?: Body
}

export type Method =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH"

export interface Pair {
  name: string
  value: string
}

export interface FilePair {
  name: string
  filename: string
  content_type?: string
}

export type Body = JsonBody | XmlBody | RawStringBody | Base64Body | FileBody
export interface JsonBody {
  type: "json"
  value: unknown
}
export interface XmlBody {
  type: "xml"
  value: string
}
export interface RawStringBody {
  type: "raw-string"
  value: string
}
export interface Base64Body {
  type?: undefined
  encoding: "base64"
  value: string
}
export interface FileBody {
  type: "file"
  filename: string
}

export interface Response {
  version?: Version
  status?: number
  captures?: Capture[]
  headers?: Pair[]
  asserts?: Assertion[]
  body?: Body
}

export type Version = "HTTP/1.0" | "HTTP/1.1" | "HTTP/2" | "HTTP/*"

export interface Capture {
  name: string
  query: Query
}

export type Query =
  | StatusQuery
  | HeaderQuery
  | CookieQuery
  | BodyQuery
  | BytesQuery
  | XpathQuery
  | JsonPathQuery
  | RegexQuery
  | VariableQuery
  | DurationQuery

interface BaseQuery {
  type: string
  subquery: RegexQuery | CountSubquery
}

export interface StatusQuery extends BaseQuery {
  type: "status"
}

export interface HeaderQuery extends BaseQuery {
  type: "header"
  name: string
}

export interface CookieQuery extends BaseQuery {
  type: "cookie"
  expr: string
}

export interface BodyQuery extends BaseQuery {
  type: "body"
}

export interface BytesQuery extends BaseQuery {
  type: "bytes"
}

export interface XpathQuery extends BaseQuery {
  type: "xpath"
  expr: string
}

export interface JsonPathQuery extends BaseQuery {
  type: "jsonpath"
  expr: string
}

export interface RegexQuery extends BaseQuery {
  type: "regex"
  expr: string
}

export interface VariableQuery extends BaseQuery {
  type: "variable"
  name: string
}

export interface DurationQuery extends BaseQuery {
  type: "duration"
}

export interface CountSubquery {
  type: "count"
}

export interface Assertion {
  query: AssertionQuery
  predicate: Predicate
}

export type AssertionQuery = Query | Sha256Query

export interface Sha256Query extends BaseQuery {}

export type Predicate =
  | AnyComparePredicate
  | NumberComparePredicate
  | StringComparePredicate
  | UnaryPredicate

interface BasePredicate {
  type: string
  not?: boolean
}

export interface AnyComparePredicate extends BasePredicate {
  type: AnyComparePredicateType
  value: string | number | boolean
  encoding?: "base64"
}

export type AnyComparePredicateType = "equal" | "not-equal" | "include"

export interface NumberComparePredicate extends BasePredicate {
  type: NumberComparePredicateType
  value: number
}

export type NumberComparePredicateType =
  | "greater"
  | "less"
  | "greater-or-equal"
  | "less-or-equal"

export interface StringComparePredicate extends BasePredicate {
  type: StringComparePredicateType
  value: string
  encoding?: "base64"
}

export type StringComparePredicateType =
  | "start-with"
  | "end-with"
  | "contain"
  | "match"

export interface UnaryPredicate extends BasePredicate {
  type: UnaryPredicateType
}

export type UnaryPredicateType =
  | "exist"
  | "isInteger"
  | "isFloat"
  | "isBoolean"
  | "isString"
  | "isCollection"
