import { Blob } from "@htptp/polyfill-fetch"

export type FileSource = ArrayBufferLike | ArrayBufferView | Blob

export const toUint8Array = async (source: FileSource) => {
  if (source instanceof ArrayBuffer || source instanceof SharedArrayBuffer) {
    return new Uint8Array(source)
  } else if (source instanceof Blob) {
    return new Uint8Array(await source.arrayBuffer())
  } else {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength)
  }
}

export const equalArrayBuffer = async (a_: FileSource, b_: FileSource) => {
  const a = await toUint8Array(a_)
  const b = await toUint8Array(b_)
  return a.byteLength === b.byteLength && a.every((v, i) => v === b[i])
}
