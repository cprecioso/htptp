# @htptp/hurl-parser

The [Hurl](https://hurl.dev/) file parser, compiled to WASM and callable from JavaScript!

- Simple af
- Works in Node.js and the browser
- Output is the same as [`hurlfmt --format json`](https://github.com/Orange-OpenSource/hurl/tree/master/packages/hurlfmt)

## Usage

```js
import { parse } from "@htptp/hurl-parser";

const result = parse(`
  GET http://example.com
  HTTP/* 200
`);
```

The returned data will be as follows

```json
{
  "entries": [
    {
      "request": {
        "method": "GET",
        "url": "http://example.com"
      },
      "response": {
        "status": 200
      }
    }
  ]
}
```

The module also exports [TypeScript types](./js/types.ts) for these structures.

```typescript
import type { Hurl } from "@htptp/hurl-parser";

const result: Hurl.Document = parse(/* ... */);
```

## Installation

Just install to your dependencies

```sh
$ yarn add @htptp/hurl-parser    # if you use yarn
$ npm install @htptp/hurl-parser # if you use npm
```

And import normally

## Limitations

- The target environment or bundler must support _ES Modules_, _WASM_ and _top-level await_. ([Chrome 89+, Firefox 89+, Safari 15+](https://caniuse.com/mdn-javascript_operators_await_top_level), [Node.js 14.8+](https://nodejs.org/api/esm.html#top-level-await), [Webpack 5+](https://webpack.js.org/configuration/experiments/)).
