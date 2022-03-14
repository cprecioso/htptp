import fontoxpath from "fontoxpath"
import { sync as parseXML } from "slimdom-sax-parser"

export const evaluateXpath = (expression: string, documentText: string) => {
  const document = parseXML(documentText)
  const value = fontoxpath.evaluateXPath(expression, document)
  return value
}
