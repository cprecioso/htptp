// @ts-check

import { makeBaseConfig } from "./base.mjs"

export const makeConfig = async (/** @type {string} */ fileUrl, options) =>
  makeBaseConfig(fileUrl, ["./src/index.ts"], options)
