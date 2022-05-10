import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        proxy: {
          '/api': {
            target: `http://localhost:9902`,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
      },
})