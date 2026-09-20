import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the built assets load from file:// inside the Android WebView (APK).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  },
})
