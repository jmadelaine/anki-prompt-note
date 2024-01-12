/* eslint-disable no-console */
import { defineConfig, loadEnv, UserConfig } from 'vite'
import checker from 'vite-plugin-checker'
import solidPlugin from 'vite-plugin-solid'
import tsconfigPaths from 'vite-tsconfig-paths'
import fs from 'fs'

/*
 * https://vitejs.dev/config/
 */

type BuildMode = 'development' | 'test' | 'production'

const getDevServerConfig = () => ({
  port: 3000,
  // Dev server requires a trusted cert is setup in order to load web workers - see README/Develop
  https: {
    cert: fs.readFileSync('../.cert/cert.pem'),
    key: fs.readFileSync('../.cert/key.pem'),
  },
  host: '0.0.0.0',
  hmr: { clientPort: 3000 },
  open: true,
})

/**
 * Maybe TODO: create default 'coverage' directories for CI tests
 */
const getPluginConfig = (mode: BuildMode) => {
  const plugins: UserConfig['plugins'] = [solidPlugin(), tsconfigPaths()]

  if (mode === 'test') return plugins

  return plugins.concat(
    checker({
      overlay: { initialIsOpen: false, position: 'bl' },
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.tsx"',
        dev: { logLevel: ['error', 'warning'] },
      },
    })
  )
}

export default ({ mode }: { mode: BuildMode }) => {
  console.log('Hello from Vite config')
  console.log(`Building in mode: ${mode}`)

  const viteEnvVars = loadEnv(mode, process.cwd())
  Object.assign(process.env, viteEnvVars)

  return defineConfig({
    plugins: getPluginConfig(mode),
    server: mode === 'development' ? getDevServerConfig() : undefined,
    resolve: { alias: { stream: 'stream-browserify' } },
    define: { 'process.env': { ...viteEnvVars, NODE_ENV: mode } },
    build: {
      manifest: 'asset-manifest.json',
      sourcemap: 'hidden',
      outDir: 'build',
      target: 'esnext',
      polyfillDynamicImport: false,
    },
  })
}
