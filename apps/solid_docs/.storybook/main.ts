import { mergeConfig } from 'vite';

import type { StorybookConfig } from 'storybook-solidjs-vite';

export default <StorybookConfig>{
  framework: 'storybook-solidjs-vite',
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-vitest',
      options: {
        cli: false,
      },
    },
  ],
  stories: [
    '../../../packages/@mantine/core/src/component/**/*.story.@(ts|tsx)',
    '../../../packages/@mantine/carousel/src/*.story.@(ts|tsx)',
    '../../../packages/@mantine/form/src/stories/*.story.@(ts|tsx)',
    '../../../packages/@mantine/modals/src/*.story.@(ts|tsx)',
    '../../../packages/@mantine/notifications/src/*.story.@(ts|tsx)',
  ],
  async viteFinal(config) {
    return mergeConfig(config, {
      define: {
        'process.env': {},
      },
      // dedupe: [
      //   'solid-js',
      //   'solid-js/web',
      //   'solid-js/store',
      //   'solid-js/h',
      //   'solid-js/html',
      // ],
    });
  }
};
