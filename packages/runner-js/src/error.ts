export const unsupportedHurl = (hurlFeature: string, workaround?: string) =>
  new Error(
    `Unsupported Hurl feature: [${hurlFeature}]${
      workaround ? `\nInstead, you can ${workaround}` : ""
    }`
  )

export const unknownHurl = (hurlFeature: string, type: never) =>
  new Error(`Unknown Hurl feature: [${hurlFeature}${type ? ` = ${type}` : ""}]`)

export const unsupportedEngine = (hurlFeature: string, workaround?: string) =>
  new Error(
    `Unsupported feature in the engine: [${hurlFeature}]${
      workaround ? `\nInstead, you can ${workaround}` : ""
    }`
  )

export const variableNotFound = (name: string) =>
  new Error(`Could not find variable [${name}]`)

export const alreadyDeclaredVariable = (name: string) =>
  new Error(`Can't redeclare variable [${name}]`)

export const fileNotFound = (filename: string) =>
  new Error(`Can't find file [${filename}]`)
