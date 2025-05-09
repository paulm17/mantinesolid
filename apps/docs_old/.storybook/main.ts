import { dirname, join } from 'path';
import type { StorybookConfig } from 'storybook-solidjs-vite';

/** Resolve absolute path in monorepos/Yarn PnP */
function getAbsolutePath(pkg: string) {
  return dirname(require.resolve(join(pkg, 'package.json')));
}

const config: StorybookConfig = {
  stories: ['../../../packages/@mantine/core/src/component/**/*.story.tsx'],

  addons: [
    // getAbsolutePath('@storybook/addon-essentials'),
    // getAbsolutePath('@storybook/addon-interactions'),
    //           // viewport is now separate in SB 8 :contentReference[oaicite:8]{index=8}
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-viewport'),
  ],

  framework: {
    name: getAbsolutePath('storybook-solidjs-vite') as unknown as 'storybook-solidjs-vite',
    options: {},
  },

  // core: {
  //   builder: {
  //     name: getAbsolutePath('@storybook/builder-vite') as unknown as '@storybook/builder-vite',
  //     options: {
  //       viteConfigPath: './vite.config.ts',               // ← point at your config :contentReference[oaicite:9]{index=9}
  //     },
  //   },
  // },
};

export default config;
