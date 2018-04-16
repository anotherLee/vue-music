
const webpack = require('webpack')

module.exports = {
    devServer: {
        port: 9000,
        proxy: {
            '/api': {
                target: 'https://m.weibo.cn',
                changeOrigin: true
            }
        },
        hot: true,
        historyApiFallback: true,
        noInfo: true,
        progress: true,
        overlay: true

    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
