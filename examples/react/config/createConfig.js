const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const i18nTransformer = require('../../../lib/transformer').default;

const createConfig = (
  languages = ['ru', 'en'],
  targetLanguage = 'ru',
  publicPath = '/'
) => {
  return {
    mode: 'development',
    devtool: 'source-map',

    entry: {
      main: './src/index.tsx',
    },

    output: {
      path: path.resolve(__dirname, `../dist/${targetLanguage}`),
      publicPath,
      filename: '[name].js',
    },

    resolve: {
      extensions: ['.tsx', '.js'],
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [
                  i18nTransformer({
                    languages,
                    targetLanguage,
                  }),
                ],
              }),
            },
          },
        },
      ],
    },

    plugins: [new HtmlWebpackPlugin()],
  };
};

exports.createConfig = createConfig;
