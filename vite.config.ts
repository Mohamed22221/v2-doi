import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dynamicImport from 'vite-plugin-dynamic-import'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: ['babel-plugin-macros'],
            },
        }),
        // @ts-expect-error rollup-plugin-visualizer types are not compatible with Vite

        visualizer({
            filename: './dist/report.html',
            template: 'treemap',
            gzipSize: true,
            brotliSize: true,
        }),
        dynamicImport(),
    ],
    assetsInclude: ['**/*.md'],
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/framer-motion')) {
                        return 'framer-motion'
                    }
                    if (id.includes('node_modules')) {
                        if (id.includes('quill')) return 'quill'
                        // if (id.includes('d3')) return 'd3'
                    }
                },
            },
        },
    },
      server: {
    proxy: {
      "/uploads": {
        target: "https://doueh.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
