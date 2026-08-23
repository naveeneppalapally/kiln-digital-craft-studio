import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// KILN® — standalone showcase build.
// Everything lives inside showcases/3d-agency-experience; nothing outside is touched.
export default defineConfig({
  plugins: [react()],
  // Scope PostCSS to an empty inline config so Vite never walks up into the
  // parent portfolio project's tailwind config. Keeps the showcase 100% standalone.
  css: {
    postcss: {},
  },
  server: {
    port: 5177,
    strictPort: false,
  },
  preview: {
    port: 5177,
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          react: ['react', 'react-dom'],
          motion: ['gsap', 'lenis'],
        },
      },
    },
  },
})
