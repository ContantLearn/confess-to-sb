'use strict'
const path = require('path');
const webpack = require('webpack');
const config = require('./index');
const merge = require('webpack-merge');
const utils = require('./utils');
const baseWebpackConfig = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 将css单独拿出来打包放到一个文件夹下
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
    mode: "production",
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        // chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
        chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",
                    publicPath:'../../'
                })
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
                ROOT_API: '"../"'
            }
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap: config.build.productionSourceMap,
            parallel: true
        }),
        // 提取所有css文件到打包文件夹的css文件夹下
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[chunkhash].css'),
            allChunks: true,
        }),
        //压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
        new OptimizeCSSPlugin({
            cssProcessorOptions: config.build.productionSourceMap
                ? { safe: true, map: { inline: false } }
                : { safe: true }
        }),
        new HtmlWebpackPlugin({
            filename: config.build.htmlPublicPath + "/index.html",
            template: 'index.html',
            inject: true,
            chunks: ['index'],
            // 缩小输出
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            }
        }),
        // 给CommonsChunkPlugin产生的Chunk定义id名
        // new webpack.HashedModuleIdsPlugin(),
        // 声明提升
        new webpack.optimize.ModuleConcatenationPlugin(),

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

module.exports = webpackConfig;