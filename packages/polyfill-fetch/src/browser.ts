const fetch: typeof globalThis.fetch = self.fetch
export default fetch

export const Blob: typeof globalThis.Blob = self.Blob
export const File: typeof globalThis.File = self.File
export const FormData: typeof globalThis.FormData = self.FormData
export const Headers: typeof globalThis.Headers = self.Headers
export const Response: typeof globalThis.Response = self.Response

export type RequestInit = globalThis.RequestInit
