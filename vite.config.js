import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  base: '/', 
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          filename: 'stats.html',   // the report file
          template: 'treemap',
          gzipSize: true,
          brotliSize: true,
          open: true                // auto-open in browser after build
        })
      ]
    }
  }
})
