import fs from "fs"
import { Nullable } from "libs/nullable/index.js"
import { NextConfig } from "next"
import Log from "next/dist/build/output/log.js"
import { WebpackConfigContext } from "next/dist/server/config-shared.js"
import path from "path"
import { Configuration, Stats, webpack } from "webpack"

export async function compile(wpconfig: Configuration) {
  if (typeof wpconfig.output !== "object")
    throw new Error("output is required to be an object")
  if (typeof wpconfig.output.filename !== "string")
    throw new Error("output.filename is required to be a string")

  Log.wait(`compiling ${wpconfig.name}...`)

  const start = Date.now()

  const status = await new Promise<Nullable<Stats>>(ok => webpack(wpconfig).run((_, status) => ok(status)))

  if (status?.hasErrors()) {
    Log.error(`failed to compile ${wpconfig.name}`)
    Log.error(status.toString({ colors: true }))
    throw new Error(`Compilation failed`)
  }

  Log.ready(`compiled ${wpconfig.name} in ${Date.now() - start} ms`)

  const dirname = path.dirname(wpconfig.output.filename)
  const basename = path.basename(wpconfig.output.filename)

  fs.mkdirSync(`./public/${dirname}`, { recursive: true })

  fs.copyFileSync(`./.webpack/${dirname}/${basename}`, `./public/${dirname}/${basename}`)
}

export interface NextSidebuildConfig {
  sidebuilds(wpconfig: Configuration): Iterable<Promise<void>>
}

export function withNextSidebuild(config: NextConfig & NextSidebuildConfig): NextConfig {
  const { sidebuilds, ...defaults } = config

  fs.rmSync("./.webpack", { force: true, recursive: true })

  const memory = { promise: Promise.resolve() }

  return {
    ...defaults,

    webpack(wpconfig: Configuration, wpoptions: WebpackConfigContext) {
      if (!wpoptions.isServer)
        memory.promise = Promise.all(sidebuilds(wpconfig)).then(() => { })

      if (defaults.webpack != null)
        return defaults.webpack(wpconfig, wpoptions)

      return wpconfig
    },

    exportPathMap: async (map, ctx) => {
      await memory.promise

      if (defaults.exportPathMap != null)
        return await defaults.exportPathMap(map, ctx)

      return map
    },
  }
}