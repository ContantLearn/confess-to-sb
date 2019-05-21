'use strict'
const path = require('path');
const config = require('./index');
const manifest = require('./chunks-manifest.json');
const commonChunks = manifest.commonChunks;

exports.assetsPath = function (_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
};

exports.fontsPath = function(_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : "css"
    console.log(path.posix.join(assetsSubDirectory, _path));

    return path.posix.join(assetsSubDirectory, _path)
};

exports.resolveChunks = function(filePath, dist) {
    let components = manifest.components;

    // 默认带有global
    dist.push.apply(dist, commonChunks.global);

    for(let key in components) {
        let component = components[key], pattern = new RegExp(component.test);

        if(pattern.test(filePath)) {
            resolveComponent(component, dist);
            break;
        }
    }

    return uniqueArray(dist);
};

function clone(value) {
    if(value) {
        return JSON.parse(JSON.stringify(value))
    }
    return value;
}

function uniqueArray(arr) {
    if(judgeType(arr) !== "[object Array]") {
        return arr;
    }

    let newArr = [], map = {};

    arr.forEach((item, index) => {
        if(!map[item]) {
            newArr.push(item);
            map[item] = true;
        }
    });
    return newArr;
}

function resolveComponent(component, dist) {
    let extendArray = component.extends ? component.extends : [];

    dist.push.apply(dist, component.chunks);

    extendArray.forEach((extend) => {

        let commonChunk = commonChunks[extend];

        if(judgeType(commonChunk) === "[object Array]") {
            dist.push.apply(dist, commonChunk);
        }
        // 如果父chunks中还有父chunks,会解析到是对象,此时需要递归调用
        else if(judgeType(commonChunk) === "[object Object]") {
            resolveComponent(commonChunks[extend], dist);
        }

    });
}

function judgeType(val) {
    return Object.prototype.toString.call(val);
}