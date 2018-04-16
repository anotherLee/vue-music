
const productionConfig = require('./webpack.prod.config')
const developmentConfig = require('./webpack.dev.config')
const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const generateConfig = env => {
    return {
        entry: env === 'production'
            ? { app: './src/index.js', vendor: ['vue', 'axios'] }
            : { app: './src/index.js' },
        output: {
            publicPath: '/',
            filename: env === 'production' ? '[name].[chunkhash].js' : '[name].[hash].js',
            path: path.resolve(__dirname, 'dist')
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            },
            extensions: ['.js', '.vue']
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    include: [
                        path.resolve(__dirname, './src')
                    ],
                    use: [
                        {
                            loader: 'babel-loader'
                        }
                    ].concat(env === 'production' ? [] : [{
                        loader: 'eslint-loader',
                        options: {
                            formatter: require('eslint-friendly-formatter')
                        }
                    }])
                },
                {
                    test: /\.vue$/,
                    include: [
                        path.resolve(__dirname, './src')
                    ],
                    use: [
                        {
                            loader: 'vue-loader'
                        }
                    ].concat(env === 'production' ? [] : [{
                        loader: 'eslint-loader',
                        options: {
                            formatter: require('eslint-friendly-formatter')
                        }
                    }])
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    include: [
                        path.resolve(__dirname, './src')
                    ],
                    use: [
                        {
                            loader: 'url-loader'
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.NamedModulesPlugin(),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                filename: 'index.html',
                minify: env === 'production'
                    ? {
                        collapseWhitespace: true,
                        removeComments: true,
                        removeAttributeQuotes: true
                    }
                    : {}
            })
        ]
    }
}

module.exports = env => {
    let config = env === 'production'
        ? productionConfig
        : developmentConfig

    return merge(generateConfig(env), config)
}
