'use strict'
const path = require('path');
const config = require('./index');
const webpack = require('webpack');
const utils = require('./utils');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanCSSPlugin = require('less-plugin-clean-css');

const baseConfig = {
    // 设置入口文件的根目录
    context: path.resolve(__dirname, '../'),
    // 设置入口文件
    entry: {
        // "index": "./src/index.js",
        "index": path.resolve(__dirname, '../src/index.js')
    },
    output: {

        path: config.build.assetsRoot,//打包后的文件存放的地方
        filename: "[name].js", //打包后输出文件的文件名,

        chunkFilename: "[name].[chunkhash].js",

        // 设置打包后的资源引用路径前缀
        // 打包后路径是这样的<script src='publicPath/[name].js'></script>
        // 所以打包后发现自己的js引用报404的话,检查这里的配置把
        publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@assets' : path.resolve(__dirname, '../src/assets'),
            '@wrapper' : path.resolve(__dirname, '../wrapper'),
            '@layout' : path.resolve(__dirname, '../src/components/layout')
        }
    },
    externals: {
        // "jQuery": "window.jQuery",
    },
    module: {
        rules: [
            // {
            //     test: /\.css$/,
            //     use: ["style-loader", "css-loader"]
            // },
            {
                test: /\.(woff2?|eot|ttf|otf|svg|woff)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.fontsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },// 支持@important引入css
                    {loader: 'less-loader', options: {
                        plugins: [
                            // 去除less @import 的重复样式
                            new CleanCSSPlugin({ advanced: true })
                        ]
                    }}
                ]
            },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader?cacheDirectory=true"
                },
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        splitChunks: {
            // all 全部, async 按需加载的模块, initial 初始化加载模块
            chunks: "all",
            // 最小储存kb
            minSize: 0,
            // 最大按需加载请求数, 如果你的应用里面的这两个请求数超出了设置的话,webpack是不会给你提取公共代码的
            maxAsyncRequests: 30,
            // 最大初始化加载请求数
            maxInitialRequests: 30,
            // 名称,true会自动根据块和缓存组的键选择一个名字
            name: true,
            cacheGroups: {
                default: {
                    name: "default",
                    minChunks: 2,
                    // 缓存权重
                    priority: -20,
                    // 选项用于配置在模块完全匹配时重用已有的块，而不是创建新块
                    reuseExistingChunk: true,
                },
                vendors: {
                    name: "vendors",
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
                // datetimepicker: {
                //     name: "bootstrap-datetimepicker",
                //     test: /bootstrap-datetimepicker/,
                //     priority: 2
                // },
                // contract: {
                //     name: "contract",
                //     test: /\/contract\./,
                //     priority: -10
                // }
            }
        }
    },
    plugins: [
        // 解析jQuery自己定义的特殊符号,并给window对象添加jQuery全局变量,
        // 这里的设置可以在任何地方都不需要require('jquery')模块了,直接用
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery"
        })
    ]

};

// 获取指定路径下的入口文件
function getEntries(globPath) {
    const files = glob.sync(globPath),
        entries = {};

    files.forEach(function(filepath) {
        // 取倒数第二层(contents下面的文件夹)做模块名
        let split = filepath.split('/');
        let name = split[split.length - 2];

        entries[name] = './' + filepath;
    });

    return entries;
}
function getTemplates(globPath) {
    const files = glob.sync(globPath),
            templates = {};
    files.forEach(function(filepath) {
        // 取文件名,去掉后缀
        let split = filepath.split('.')[0].split('/');
        let name = split[split.length - 1];
        // 添加临时前缀和其他的区分开
        templates["tem_" + name] = './' + filepath;
    });

    return templates;
}
const   contents = getEntries('src/components/contents/**/index.js'),
        templates = getEntries('src/components/templates/**/index.js'),
        entries = Object.assign({}, contents, templates);

Object.keys(entries).forEach(function(name) {
    let filePath = entries[name], chunks = utils.resolveChunks(filePath, [name]);

    baseConfig.entry[name] = filePath;

    // 检查manifest.json的配置是否正确
    chunks.forEach((chunk) => {
        // 跳过自己,chunkname
        if(chunk !== name) {
            let cacheGroups = baseConfig.optimization.splitChunks.cacheGroups, isMatch = false;
            for(let i in cacheGroups) {
                let group = cacheGroups[i];
                if(group.name === chunk) {
                    isMatch = true;
                    break;
                }
            }
            if(isMatch === false) {
                throw new Error("找不到对应的chunk : " + chunk + ", 请检查配置");
            }
        }
    });

    // 每个页面生成一个html
    let plugin = new HtmlWebpackPlugin({
        // 生成出来的html文件名
        filename: process.env.NODE_ENV === 'production' ? config.build.htmlPublicPath + "/" + name + '.html' : name + '.html',
        // 每个html的模版，这里多个页面使用同一个模版
        // template: config.build.templatePath + "/" + name + '/template.html',
        template: filePath.replace('/index.js','') + '/template.html',
        // 自动将引用插入html
        inject: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: chunks,
        // 缩小输出
        minify: process.env.NODE_ENV === 'production' ? {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        } : {}
    });
    baseConfig.plugins.push(plugin);
});

module.exports = baseConfig;
