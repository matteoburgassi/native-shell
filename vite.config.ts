import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    legacy({
      targets: ['chrome >= 53'],
      modernTargets: ['chrome >= 53'],
      modernPolyfills: true,
    }),
  ],
  css: {
    transformer: 'postcss',
  },
  optimizeDeps: {
    exclude: ['@digitalvirgo/drm-player'],
    include: ['blueimp-md5'],
  },
})
