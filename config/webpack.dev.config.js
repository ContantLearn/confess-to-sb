'use strict'
// 将打包好的js和css文件直接引入到目标html中
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 颜色插件
const chalk = require('chalk');

// 监听端口插件
const portfinder = require('portfinder');

// friendly-errors-webpack-plugin用于更友好地输出webpack的警告、错误等信息
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./index');
const baseConfig = require('./webpack.base.config');

const PORT = process.env.PORT && Number(process.env.PORT);
const HOST = process.env.HOST;

config.dev.proxyTable['/' + config.dev.targetApp + '/*'] = {
    target: 'http://' + config.dev.targetHost + ':' + config.dev.targetPort,
    secure: false,
    changeOrigin: true
};
module.exports = merge(baseConfig, {
    mode: "development", // 开发环境
    devtool: config.dev.devtool,// 调试模式
    devServer: {
        clientLogLevel: 'warning',
        // 启动gzip压缩
        // compress: true,
        // 默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录
        // contentBase: config.dev.assetsSubDirectory,
        historyApiFallback: true,//不跳转
        inline: true, //实时刷新
        port: PORT || config.dev.port,
        host: HOST || config.dev.host,
        proxy: config.dev.proxyTable,
        // 关闭webpack-dev-server的启动打印信息
        quiet: true
    },
    cache: true,// 编译缓存,提高编译的速度
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
        ]
    },
    plugins: [
        // 定义全局变量NODE_ENV为开发模式
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"',
                ROOT_API: JSON.stringify("/" + config.dev.targetApp + "/")
            }
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: 'index.html',
            inject: true,
            chunks: ['index']
        }),
        new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
                messages: [`你的应用启动啦,地址是: http://${HOST || config.dev.host}:${PORT || config.dev.port}`],
            },
            onErrors(severity, errors) {
                if(severity != 'error') return;
                console.log(chalk.red(errors[0].webpackError));
            }
        }),
        // 复制文件
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, `../${config.build.assetsSubDirectory}`),
                to: `${config.build.assetsSubDirectory}`,
                ignore: ['.*']
            }
        ])
    ]
});
