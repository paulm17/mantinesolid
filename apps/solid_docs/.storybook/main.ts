import { mergeConfig } from 'vite';

import type { StorybookConfig } from '@kachurun/storybook-solid-vite';

export default <StorybookConfig>{
    framework: {
        name: '@kachurun/storybook-solid-vite',
        options: {}
    },
    addons: [
        '@storybook/addon-onboarding',
        '@storybook/addon-docs',
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
        // '../stories/**/*.mdx',
        '../../../packages/libs/floating-ui/src/stories/*.stories.@(js|jsx|mjs|ts|tsx)',
    ],
    async viteFinal(config) {
        return mergeConfig(config, {
            define: {
                'process.env': {},
                __DEV__: true,
            },
            plugins: [(await import('@tailwindcss/vite')).default()],
        });
    },
};
