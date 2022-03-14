import fontoxpath from "fontoxpath"

export const evaluateXpath = (expression: string, documentText: string) => {
  const document = new DOMParser().parseFromString(
    documentText,
    "application/xml"
  )
  const value = fontoxpath.evaluateXPath(expression, document)
  return value
}
