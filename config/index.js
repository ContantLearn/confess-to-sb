const
    path = require('path'),
    IP = {

        /*
            测试环境后端地址
         */
        devTargetHost: '101.37.70.52',

        /*
            测试环境后端地址端口
         */
        devTargetPort: '8080',

        /*
            测试环境后台服务app名称
         */
        devTargetApp: 'ReportWebServer',

        /*
            测试环境浏览器输入地址
         */
        devHost: 'localhost',

        /*
            测试地址浏览器输入端口
         */
        devPort: '8081',

        // 101.37.70.52
        /*
            部署环境后端地址
         */
        prodTargetHost: '101.37.70.52',

        /*
            部署环境后端地址端口
         */
        prodTargetPort: '8080',

        /*
            部署环境后台服务app名称
         */
        prodTargetApp: 'ReportWebServer',

    };

module.exports = {
    build: {

        // 模板设置为index.html
        // index: path.resolve(__dirname, '../dist/views/index.html'),

        // html打包公共路径
        htmlPublicPath: path.resolve(__dirname, '../dist/views'),

        // 入口文件模板公共地址
        templatePath: path.resolve(__dirname, '../src/components/contents'),

        // 资源引用路径设置
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsPublicPath: '../',
        assetsSubDirectory: 'static',

        // 调试模式
        devtool: '#source-map',

        productionSourceMap: true,

        targetHost: IP.prodTargetHost,
        targetPort: IP.prodTargetPort,
        targetApp: IP.prodTargetApp

    },
    dev: {

        // 资源引用路径设置
        assetsPublicPath: '/',
        assetsSubDirectory: '../static',

        // 服务器路径配置
        // host: 'localhost',
        host: IP.devHost,
        port: IP.devPort,

        targetHost: IP.devTargetHost,
        targetPort: IP.devTargetPort,
        targetApp: IP.devTargetApp,

        // 调试模式
        // devtool: 'cheap-module-eval-source-map',
        devtool: 'source-map',

        // 代理设置, 与java端测试的时候需要配置
        proxyTable: {},

        // css文件压缩后是否生成源代码路径
        cssSourceMap: true

    }
};