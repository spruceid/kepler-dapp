const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const sveltePreprocess = require('svelte-preprocess');
const webpack = require('webpack');


const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';
const assetPath = process.env.ASSET_PATH || '/';

module.exports = {
    entry: {
        'build/bundle': ['./src/main.ts'],
    },
    resolve: {
        alias: {
            svelte: path.dirname(require.resolve('svelte/package.json')),
            components: path.resolve(__dirname, 'src/components'),
            routes: path.resolve(__dirname, 'src/routes'),
            src: path.resolve(__dirname, 'src/'),
        },
        extensions: ['.mjs', '.js', '.ts', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main'],
        fallback: {
            buffer: require.resolve('buffer'),
            crypto: require.resolve('crypto-browserify'),
            events: require.resolve('events/'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify'),
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify'),
            url: require.resolve('url/'),
        },
    },
    output: {
        publicPath: assetPath,
        path: path.join(__dirname, '/public'),
        filename: '[name].js',
        chunkFilename: '[name].[id].js',
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
                            dev: !prod,
                        },
                        emitCss: prod,
                        hotReload: !prod,
                        preprocess: sveltePreprocess({
                            sourceMap: !prod,
                            postcss: true,
                        }),
                    },
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                // required to prevent errors from Svelte on Webpack 5+
                test: /node_modules\/svelte\/.*\.mjs$/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.wasm$/,
                type: 'webassembly/async',
            },
        ],
    },
    mode,
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env.ASSET_PATH': JSON.stringify(assetPath),
        // }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            'process/browser': 'process/browser',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new webpack.DefinePlugin({
            BUILD_MODE_DEV: !prod,
        }),
        new webpack.EnvironmentPlugin({
            KEPLER_URLS: 'http://test.mydomain.com:8000',
            ALLOW_LIST_URL: 'http://test.mydomain.com:10000'
        }),
        new HtmlWebpackPlugin({
            title: 'Kepler',
            template: 'index.html',
            base: assetPath + 'index.html',
            meta: {
                viewport: 'width=device-width,initial-scale=1',
            }
        })
    ],
    devtool: prod ? false : 'source-map',
    devServer: {
        hot: true,
        historyApiFallback: {
            index: '/index.html',
        },
    },
    experiments: {
        asyncWebAssembly: true,
    },
};
