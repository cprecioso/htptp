import * as Hurl from "@htptp/hurl-types"
import { Request } from "./Request"
import { Response } from "./Response"
import { CapturedValues, Options } from "./types"

export class Runner {
  captures: CapturedValues = new Map()

  constructor(
    public document: Hurl.Document,
    public readonly options: Readonly<Options>
  ) {}

  async run() {
    for (const entry of this.document.entries) {
      await this.runEntry(entry)
    }

    return this.captures
  }

  async runEntry(entry: Hurl.Entry) {
    const response = await new Request(this.options, entry.request).run()
    if (entry.response) {
      await new Response(this.options, response, this.captures).run(
        entry.response
      )
    }
  }
}
