const webpack = require('webpack')
const pkg = require('./package.json')
const path = require('path')

const libraryName = pkg.name

module.exports = {
  entry: path.join(__dirname, './src/index.ts'),
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'index.js',
    library: {
      name: libraryName,
      type: 'umd'
    },
    publicPath: '/dist/',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    }

  },
  devtool: 'inline-source-map',
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    }
  }
}
