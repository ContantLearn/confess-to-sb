'use strict'
const path = require('path');
const webpack = require('webpack');
const rm = require('rimraf');
const ora = require('ora');
const chalk = require('chalk');
const webpackDllConfig = require("../config/webpack.dll.config");

const spinner = ora('building for dll...');
spinner.start();

rm(path.join(path.resolve(__dirname, '../lib'), '/'), err => {
    if(err) throw err;

    webpack(webpackDllConfig, (err, stats) => {
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
            console.log(chalk.red('  Build lib failed with errors.\n'));
            process.exit(1);
        }

        console.log(chalk.cyan('  Build lib complete.\n'));
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ));
    });

});