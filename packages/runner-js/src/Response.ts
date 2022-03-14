import * as Hurl from "@htptp/hurl-types"
import assert from "@htptp/polyfill-assert"
import { Response as FetchResponse } from "@htptp/polyfill-fetch"
import { decode as base64Decode } from "base64-arraybuffer"
import { unsupportedEngine, unsupportedHurl } from "./error"
import { Assertions, CapturedValues, Options } from "./types"
import { equalArrayBuffer } from "./util"
import { runQuery } from "./query"

export class Response {
  constructor(
    public readonly options: Readonly<Options>,
    public readonly response: FetchResponse,
    public readonly capturedValues: CapturedValues
  ) {}

  async run({ captures, ...assertions }: Hurl.Response) {
    if (captures) await this.runCaptures(captures)
    await this.runAssertions(assertions)
  }

  async runCaptures(captures: Hurl.Capture[]) {
    for (const capture of captures) {
      const result = await runQuery(this.response, capture.query)
      this.capturedValues.set(capture.name, result)
    }
  }

  async runAssertions({ version, status, body, headers, asserts }: Assertions) {
    if (version && version !== "HTTP/*") {
      throw unsupportedEngine("HTTP Version Assertion")
    }

    if (status) {
      assert.strictEqual(this.response.status, status)
    }

    if (body) {
      await this.assertBody(body)
    }

    if (headers) {
      for (const { name, value } of headers) {
        assert.strictEqual(this.response.headers.get(name), value)
      }
    }

    if (asserts) {
      throw unsupportedHurl("Assertion Queries")
    }
  }

  async assertBody(body: Hurl.Body) {
    switch (body.type) {
      case "file": {
        throw unsupportedHurl("File Body Assertion")
      }

      case "json": {
        assert.deepStrictEqual(await this.response.json(), body.value)
        return
      }

      case "raw-string": {
        assert.strictEqual(await this.response.text(), body.value)
        return
      }

      case "xml":
        throw unsupportedHurl("XML Body Assertion")

      case undefined: {
        switch (body.encoding) {
          case "base64": {
            assert(
              equalArrayBuffer(
                await this.response.arrayBuffer(),
                base64Decode(body.value)
              )
            )
          }

          default:
            throw unsupportedHurl(`Unknown Body Assertion Encoding`)
        }
      }

      default:
        throw unsupportedHurl(`Unknown Body Assertion Type`)
    }
  }
}
