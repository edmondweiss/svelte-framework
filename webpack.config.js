const { resolve, join } = require('path');
const { readdirSync } = require('fs');
const nodeExternals = require('webpack-node-externals');
const sveltePreprocess = require('svelte-preprocess');

const isProd = process.env.NODE_ENV === 'production';
const mode =  isProd ? 'production' : 'development';

const Constants = {
  ClIENT_DIRECTORY_PATH: resolve(__dirname, 'src/generated-client-components'),
  NPM_SCRIPTS_DIRECTORY_PATH: resolve(__dirname, 'npm-scripts')
};

console.log('Webpack info:')
console.log(`Environment: ${mode}`);

const createEntries = () => (readdirSync(Constants.ClIENT_DIRECTORY_PATH, {
  encoding: 'utf-8',
})).reduce((entries, file) => {
  const directoryName = file.replace('.ts', '').toLowerCase();
  entries[`pages/${directoryName}`] = `${Constants.ClIENT_DIRECTORY_PATH}/${file}`;
  return entries;
}, {});

const generateClientConfig = () => {
  return {
    mode,
    entry: createEntries(),
    output: {
      path: join(__dirname, '/dist'),
      filename: '[name].js',
    },
    resolve: {
      alias: {
        svelte: resolve(__dirname, 'node_modules', 'svelte')
      },
      extensions: ['.js', '.ts', '.svelte']
    },
    module: {
      rules: [
        {
          test: /\.ts$/i,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/i,
          loader: 'sass-loader',
        },
        {
          test: /\.svelte$/i,
          exclude: /node_modules/,
          use: {
            loader: 'svelte-loader',
            options: {
              compilerOptions: {
                hydratable: true,
              },
              preprocess: sveltePreprocess({ sourceMap: !isProd }),
            }
          }
        },
        {
          // required to prevent errors from Svelte on Webpack 5+
          test: /node_modules\/svelte\/.*\.mjs$/,
          resolve: {
            fullySpecified: false,
          },
        },
      ]
    },
    devtool: isProd ? false : 'source-map'
  }
}

const generateServerConfig = () => {
  return {
    mode,
    target: 'node',
    externals: [nodeExternals()],
    entry: {
      server: resolve(__dirname, 'src/server/server.ts')
    },
    output: {
      path: resolve(__dirname, 'dist'),
      filename: '[name].js',
      chunkFilename: '[name].[id].js',
    },
    resolve: {
      extensions: ['.js', '.ts', '.svelte']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.svelte$/,
          use: {
            loader: 'svelte-loader',
            options: {
              compilerOptions: {
                generate: 'ssr',
                hydratable: true,
              },
              preprocess: sveltePreprocess({ sourceMap: !isProd }),
            },
          },
        },
      ]
    },
    devtool: isProd ? false : 'source-map',
    watchOptions: {
      ignored: '**/node_modules'
    }
  }
}

module.exports = [
  generateClientConfig(),
  generateServerConfig()
]