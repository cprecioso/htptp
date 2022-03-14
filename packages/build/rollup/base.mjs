// @ts-check

import { builtinModules } from "module"
import path from "path"
import { readPackage } from "read-pkg"
import { defineConfig } from "rollup"
import ts from "rollup-plugin-ts"
import typescript from "typescript"
import { fileURLToPath } from "url"

const getModuleName = (/** @type {string} */ id) =>
  id
    .split("/")
    .slice(0, id.startsWith("@") ? 2 : 1)
    .join("/")

export const makeBaseConfig = async (
  /** @type {string} */ fileUrl,
  /** @type {string[]} */ inputs,
  { plugins: extraPlugins = [] } = {}
) => {
  const __filename = fileURLToPath(fileUrl)
  const __dirname = path.dirname(__filename)

  const pkg = await readPackage({ cwd: __dirname })

  const externalModules = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...builtinModules.map((mod) => `node:${mod}`),
  ])

  return defineConfig({
    input: inputs.map((p) => path.resolve(__dirname, p)),
    output: {
      dir: path.resolve(__dirname, `./dist`),
      format: "esm",
      entryFileNames: "[name].mjs",
      chunkFileNames: "chunk-[hash].mjs",
      assetFileNames: "assets/[name].[ext]",
    },
    plugins: [...extraPlugins, ts({ typescript })],
    external: (id) => externalModules.has(getModuleName(id)),
  })
}
