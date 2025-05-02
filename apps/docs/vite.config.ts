import solidjs from 'vite-plugin-solid';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    solidjs(),
  ],
  optimizeDeps: {
  }
});
