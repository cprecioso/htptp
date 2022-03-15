import { alreadyDeclaredVariable, variableNotFound } from "../error"

export type InputBindingRegistry = Iterable<[string, any]>

export class BindingRegistry {
  map: Map<string, any>

  constructor(input?: InputBindingRegistry) {
    this.map = new Map(input)
  }

  interpolate = (input: string) =>
    input.replace(
      /{{\s*(\S+?)\s*}}/g,
      (_, variableName: string) => "" + this.get(variableName)
    )

  get(name: string) {
    if (!this.map.has(name)) throw variableNotFound(name)
    return this.map.get(name)
  }

  set(name: string, value: any) {
    if (this.map.has(name)) throw alreadyDeclaredVariable(name)
    this.map.set(name, value)
  }
}
