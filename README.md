# Sidebuild for Next.js

Build workers and scripts during your Next.js build

```bash
npm i -D @hazae41/next-sidebuild
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/next-sidebuild)

## Example

<img width="696" src="https://github.com/user-attachments/assets/0e423e12-129d-4236-aa7f-9a9316ff40bb">

## Setup

Install `@hazae41/next-sidebuild` as `devDependencies`

```bash
npm i -D @hazae41/next-sidebuild
```

Modify your `next.config.js` to build your scripts

```js
const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")
const { NextSidebuild, withNextSidebuild } = require("@hazae41/next-sidebuild")

async function compileServiceWorker(wpconfig) {
  await NextSidebuild.compile({
    /**
     * Name of your script for display on logs
     */
    name: "service_worker",

    /**
     * Use "webworker" for in-worker scripts or "web" for in-page scripts
     */
    target: "webworker",

    /**
     * Your script source code path
     */
    entry: "./src/mods/scripts/service_worker/index.ts",

    output: {
      /**
       * Output file relative to `./out`
       */
      filename: "./service_worker.js",

      /**
       * DNTUYKWYD
       */
      path: path.join(process.cwd(), ".webpack")
    },

    /**
     * Configure minimizer
     */
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()]
    },
     
    /**
     * Use same config as Next.js
     */
    mode: wpconfig.mode,
    resolve: wpconfig.resolve,
    resolveLoader: wpconfig.resolveLoader,
    module: wpconfig.module,
    plugins: wpconfig.plugins,

    /**
     * DNTUYKWYD
     */
    devtool: false,
  })
}

module.exports = withNextSidebuild({
  sidebuilds: function* (wpconfig) {
    yield compileServiceWorker(wpconfig)
  }
})
```
