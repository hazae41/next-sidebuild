# Sidebuild for Next.js

Build workers and scripts during your Next.js build

```bash
npm i -D @hazae41/next-sidebuild
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/next-sidebuild)

## Setup

Install `@hazae41/next-sidebuild` as `devDependencies`

```bash
npm i -D @hazae41/next-sidebuild
```

Modify your `next.config.js` to build your scripts

```js
const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")
const { NextSidebuild } = require("@hazae41/next-sidebuild")

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

module.exports = NextSidebuild.withSidebuild({
  sidebuilds: function* (wpconfig) {
    yield compileServiceWorker(wpconfig)
  }
})
```