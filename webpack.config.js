const webpack = require('webpack')
const pkg = require("package.json")

const libraryName = pkg.name

module.exports = {
    entry: path.join(__dirname, "./src/index.ts"),
    output: {
        path: path.join(__dirname, "./dist"),
        filename: 'component.js',
        library: libraryName,
        libraryTarget: "umd",
        publicPath: "/dist/",
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
        extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'inline-source-map'
}
