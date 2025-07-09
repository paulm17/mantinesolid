import path from 'path';
import fg from 'fast-glob';
import { mergeConfig } from 'vite';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import type { StorybookConfig } from 'storybook-solidjs-vite';

// Fallback to your original stories array if dynamic discovery fails
const fallbackStories = [
  '../../../packages/@mantine/core/src/component/**/*.story.@(ts|tsx)',
  '../../../packages/@mantine/carousel/src/*.story.@(ts|tsx)',
  '../../../packages/@mantine/form/src/stories/*.story.@(ts|tsx)',
  '../../../packages/@mantine/modals/src/*.story.@(ts|tsx)',
  '../../../packages/@mantine/notifications/src/*.story.@(ts|tsx)',
  '../../../packages/@mantine/nprogress/src/*.story.@(ts|tsx)',
  '../../../packages/@mantine/spotlight/src/*.story.@(ts|tsx)',
  '../../../packages/libs/floating-ui/src/stories/*.stories.@(ts|tsx)'
];

let storiesPath: string[] = [];

try {
  const { argv } = yargs(hideBin(process.argv));

  if (argv instanceof Promise) {
    throw new Error('Failed to load cli arguments');
  }

  const getPath = (storyPath: string) => path.resolve(process.cwd(), storyPath).replace(/\\/g, '/');
  const getGlobPaths = (paths: string[]) =>
    paths.reduce<string[]>((acc, path) => [...acc, ...fg.sync(path)], []);

  function getStoryPaths(fileName: string | number = '*') {
    return getGlobPaths([
      getPath(`packages/@mantine/*/src/**/${fileName}.story.@(ts|tsx)`),
    ]);
  }

  const dynamicStories = !argv._[1]
    ? [...getStoryPaths()]
    : [...getStoryPaths(argv._[1]), ...getStoryPaths(`${argv._[1]}.demos`)];

  // Use dynamic stories if found, otherwise fallback
  storiesPath = dynamicStories.length > 0 ? dynamicStories : fallbackStories;

  console.log('Stories found:', storiesPath.length);

} catch (error) {
  console.warn('Failed to load dynamic stories, using fallback:', error);
  storiesPath = fallbackStories;
}

const mantinePackages = [
  'core',
  'carousel',
  'form',
  'modals',
  'notifications',
  'nprogress',
  'spotlight',
];

export default <StorybookConfig>{
  framework: 'storybook-solidjs-vite',
  stories: storiesPath,
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-vitest',
      options: {
        cli: false,
      },
    },
  ],
  // babel: async (config) => {
  //   // Find and remove the React preset
  //   config.presets = config.presets.filter(
  //     (preset) => !preset[0].includes('preset-react')
  //   );

  //   // Add the Solid preset
  //   config.presets.push('babel-preset-solid');

  //   return config;
  // },
  async viteFinal(config) {
    return mergeConfig(config, {
      define: {
        'process.env': {},
      },
      // css: {
      //   modules: {
      //     localsConvention: 'camelCaseOnly',
      //     generateScopedName: '[name]__[local]___[hash:base64:5]',
      //   },
      //   preprocessorOptions: {
      //     scss: {
      //       additionalData: ``,
      //     },
      //   },
      // },
      resolve: {
        alias: mantinePackages.reduce((acc, pkg) => {
          acc[`@mantine/${pkg}`] = path.resolve(
            __dirname,
            `../../../packages/@mantine/${pkg}/src`
          );
          return acc;
        }, {}),
      },
      esbuild: {
        jsx: 'transform',
        jsxImportSource: 'solid-js',
      },
      // optimizeDeps: {
      //   include: [],
      //   exclude: [
      //     '@mantine/core',
      //     '@mantine/carousel',
      //     '@mantine/form',
      //     '@mantine/modals',
      //     '@mantine/notifications',
      //     '@mantine/nprogress',
      //     '@mantine/spotlight'
      //   ],
      // },
    });
  }
};
