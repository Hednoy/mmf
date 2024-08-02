import type { StorybookConfig } from "@storybook/nextjs";
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)", "../src/**/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-viewport",
    "@storybook/addon-storyshots",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.plugins = [
      ...(config.resolve.plugins ?? []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];
    return config;
  },
};
export default config;