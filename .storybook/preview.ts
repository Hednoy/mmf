import type { Preview } from '@storybook/react';
import '../src/app/globals.css';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const customViewports = {
  xs: {
    name: 'XS',
    styles: {
      width: '350px',
      height: '963px',
    },
  },
  sm: {
    name: 'SM',
    styles: {
      width: '600px',
      height: '801px',
    },
  },
  md: {
    name: 'MD',
    styles: {
      width: '900px',
      height: '801px',
    },
  },
  lg: {
    name: 'LG',
    styles: {
      width: '1200px',
      height: '801px',
    },
  },
  xl: {
    name: 'XL',
    styles: {
      width: '1536px',
      height: '801px',
    },
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        ...customViewports,
        ...INITIAL_VIEWPORTS,
        
      }, // newViewports would be an ViewportMap. (see below for examples)
      defaultViewport: 'responsive',
    },
  },
};

export default preview;
