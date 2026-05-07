import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      // Stub out optional Telegram connector — not needed for standard web builds
      '@telegram-apps/bridge': path.resolve(__dirname, 'src/stubs/telegram-bridge.ts'),
      '@telegram-apps/sdk': path.resolve(__dirname, 'src/stubs/telegram-bridge.ts'),
    },
  },
  optimizeDeps: {
    include: [
      '@aptos-labs/wallet-adapter-react',
      '@aptos-labs/ts-sdk',
      '@tanstack/react-query',
      '@wallet-standard/core',
    ],
  },
})
