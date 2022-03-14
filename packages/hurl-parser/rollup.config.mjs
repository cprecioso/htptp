// @ts-check

import wasm from "@cprecioso/rollup-plugin-wasm"
import { makeConfig } from "@htptp/build/rollup/library.mjs"
import nodeResolve from "@rollup/plugin-node-resolve"
import { execa } from "execa"

export default async () => {
  await execa("wasm-pack", ["build", "rust"], {
    stdout: "inherit",
    stderr: "inherit",
  })

  return makeConfig(import.meta.url, {
    plugins: [nodeResolve({ modulesOnly: true }), wasm()],
  })
}
