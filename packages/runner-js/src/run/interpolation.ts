import { CapturedValues, Interpolator } from "../types"

export const makeInterpolator =
  (capturedValues: CapturedValues): Interpolator =>
  (input) =>
    input.replace(/{{\s*(\S+?)\s*}}/g, (matchedString, variableName: string) =>
      capturedValues.has(variableName)
        ? "" + capturedValues.get(variableName)
        : matchedString
    )
