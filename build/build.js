'use strict'
process.env.NODE_ENV = 'production'

// 显示loading动画效果
const ora = require('ora');
// 删除某个文件或者文件夹
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config/index');
const webpackConfig = require('../config/webpack.prod.config');

// loading显示
const spinner = ora('building for production...');
spinner.start();

// 删除以前打包的static文件夹
rm(path.join(config.build.assetsRoot, '/'), err => {
    if (err) throw err;
    // 打包
    webpack(webpackConfig, (err, stats) => {
        // 动画结束
        spinner.stop();
        if (err) throw err;
        // 输出
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false,
            chunkModules: false
        }) + '\n\n');

        if (stats.hasErrors()) {
            console.log(chalk.red('  Build failed with errors.\n'));
            process.exit(1);
        }

        console.log(chalk.cyan('  Build complete.\n'));
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ));
    })
});
