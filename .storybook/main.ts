import type { StorybookConfig } from 'storybook-solidjs-vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  // fuck it, we'll do it live!
  stories: [
    '../packages/@mantine/core/src/component/**/*.story.@(js|jsx|ts|tsx)',
    '../packages/@mantine/carousel/src/*.story.@(ts|tsx)',
    '../packages/@mantine/dropzone/src/*.story.@(ts|tsx)',
    '../packages/@mantine/form/src/stories/*.story.@(ts|tsx)',
    '../packages/@mantine/modals/src/*.story.@(ts|tsx)',
    '../packages/@mantine/notifications/src/*.story.@(ts|tsx)',
    '../packages/@mantine/nprogress/src/*.story.@(ts|tsx)',
    '../packages/@mantine/spotlight/src/*.story.@(ts|tsx)',
    '../packages/@mantine/tiptap/src/*.story.@(ts|tsx)',
    '../packages/libs/floating-ui/src/stories/*.stories.@(ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
  ],
  framework: {
    name: 'storybook-solidjs-vite',
    options: {},
  },
  async viteFinal(config) {
    config.plugins?.push(tsconfigPaths());
    return config;
  },
};

export default config;
