/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  /** Avoid EPERM on Windows (OneDrive/antivirus) when Vite tries to wipe `node_modules/.vite/deps`. */
  cacheDir: '.vite',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
