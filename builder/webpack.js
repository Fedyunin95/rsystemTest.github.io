import path from 'path';
import webpack from 'webpack';

const babelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except');

let config = {
    entry: ["babel-polyfill", './src/scripts/main.js'],
    output: {
        path: path.resolve(__dirname, '../build/assets/scripts'),
    },
    context: path.resolve(__dirname, '../'),
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                exclude: babelLoaderExcludeNodeModulesExcept([
                    // es6 modules from node_modules/
                    'swiper',
                    'dom7'
                ]),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
        ]
    // },
    // resolve: {
    //     alias: {
    //         Modules: path.resolve(__dirname, '../src/scripts/partials'),
    //         Components: path.resolve(__dirname, '../src/components/')
    //     }
    }
}

module.exports = { config };