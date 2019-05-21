'use strict';
const path = require('path');
const webpack = require('webpack');

// 设置第三方库
const vendors = [
    'jQuery',
    'bootstrap',
    // 'echarts',
    path.resolve(__dirname, '../static/js/bootstrap-datetimepicker.min.js'),
    path.resolve(__dirname, '../static/js/bootstrap-datetimepicker.zh-CN.js'),
    path.resolve(__dirname, '../src/assets/js/jquery.jqprint-0.3.js'),
    path.resolve(__dirname, '../src/assets/js/jSignature.js'),
    path.resolve(__dirname, '../static/js/jquery-Migrate-1.2.1.js')
];

module.exports = {
    output: {
        path: path.resolve(__dirname, '../lib'),
        filename: '[name].[chunkhash].js',
        library: '[name]_[chunkhash]',
    },
    entry: {
        vendor: vendors
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]_[chunkhash]',
            context: __dirname,
        }),
    ],
};