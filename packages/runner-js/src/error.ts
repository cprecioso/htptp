export const unsupportedHurl = (hurlFeature: string, workaround?: string) =>
  new Error(
    `Unsupported Hurl feature: [${hurlFeature}]${
      workaround ? `\nInstead, you can ${workaround}` : ""
    }`
  )

export const unsupportedEngine = (hurlFeature: string, workaround?: string) =>
  new Error(
    `Unsupported feature in the engine: [${hurlFeature}]${
      workaround ? `\nInstead, you can ${workaround}` : ""
    }`
  )
