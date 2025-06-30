import { defineConfig } from 'vite'
import solidjs from 'vite-plugin-solid'
import devtools from 'solid-devtools/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // @ts-ignore
    devtools({
      /* features options - all disabled by default */
      autoname: true, // e.g. enable autoname
    }),
    solidjs(),
    tailwindcss(),
  ],
  define: {
    __DEV__: true,
  },
})
