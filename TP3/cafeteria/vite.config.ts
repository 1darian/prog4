
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true, // Permite usar 'test', 'describe', 'expect' globalmente
    setupFiles: './src/setupTests.ts', 
  }
})