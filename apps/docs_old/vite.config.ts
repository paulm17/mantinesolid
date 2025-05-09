import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    solidPlugin(),                // transform JSX → Solid, not React :contentReference[oaicite:1]{index=1}
  ],
  esbuild: {
    jsx: 'preserve',              // keep JSX for the Solid plugin to handle :contentReference[oaicite:2]{index=2}
    jsxImportSource: 'solid-js',  // ensure TS types & helper imports point at Solid :contentReference[oaicite:3]{index=3}
  },
  resolve: {
    alias: {
      '@mantine/core': '../../../packages/@mantine/core/src',    // your existing alias for Mantine source
    },
    dedupe: ['solid-js', '@mantine/core'], // avoid duplicate copies of Solid or your library :contentReference[oaicite:4]{index=4}
  },
});
