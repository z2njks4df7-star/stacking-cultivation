import { defineConfig } from 'vite'

export default defineConfig({
  base: '/stacking-cultivation/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild'
  }
})
