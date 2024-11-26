// eslint-disable-next-line import/no-import-module-exports
import { theme } from './src/controller/config/theme/themeVariables';

const CracoLessPlugin = require('craco-less');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          path: false,
        },
      },
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              ...theme,
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
