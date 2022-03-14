import * as Hurl from "@htptp/hurl-types"
import { EntryContext } from "../types"
import { runRequest } from "./request"
import { runResponse } from "./response"

export const runDocument = async (
  document: Hurl.Document,
  ctx: EntryContext
) => {
  for (const entry of document.entries) {
    await runEntry(entry, ctx)
  }
}

export const runEntry = async (entry: Hurl.Entry, ctx: EntryContext) => {
  const { options, capturedValues } = ctx

  const response = await runRequest(entry.request, ctx)
  if (entry.response) {
    await runResponse(entry.response, { response, capturedValues, options })
  }
}
