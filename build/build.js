/* global require  */
var fs = require('fs');
var rp = require('rollup');
var util = require('util');
var process = require('process');

var babel = require('rollup-plugin-babel');
var replace = require('rollup-plugin-replace');
var uglify = require('rollup-plugin-uglify');

// used to track the cache for subsequent bundles
var cache;

// 默认配置
// https://github.com/rollup/rollup/wiki/JavaScript-API   API配置官方参考
let defaultConfig = {
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        replace({
            exclude: 'node_modules/**',
            ENV: JSON.stringify(process.env.ENV)
        })
    ],
    sourceMap: true,
    moduleName: 'arch'
};

// 多个发布版本
let configs = {
    dev: {
        entry: './src/main.js',
        dest: './dist/arch.js',
        format: 'umd'
    },
    pub: {
        entry: './src/main.js',
        dest: './dist/arch.min.js',
        format: 'umd',
        plugins: [
            uglify()
        ]

    }
};

/**
 * 继承对象方法
 *
 * @param parent 继承者
 * @param child  被继承者
 * @param isDeep 是否深度拷贝
 * @isMerge 数组合并,注意值没有去重
 * @returns number 失败返回-1
 */
var extend = function(parent, child, isDeep, isMerge) {
    if (typeof parent !== 'object' || typeof child !== 'object') {
        return parent;
    }

    if (isDeep) {
        for (var i in child) {
            if (child.hasOwnProperty(i)) {
                if (typeof child[i] === 'object') {
                    if (isMerge && Array.isArray(child[i]) && Array.isArray(parent[i])) {
                        var p1 = extend([], parent[i], isDeep);
                        var c1 = extend([], child[i], isDeep);
                        parent[i] = p1.concat(c1);
                    } else {
                        parent[i] = arguments.callee({}, child[i], isDeep);
                    }
                } else {
                    parent[i] = child[i];
                }
            }

        }
    } else {
        for (var j in child) {
            if (child.hasOwnProperty(j)) {
                parent[j] = child[j];
            }

        }
    }
    return parent;
};


if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

function build(configs) {
    let keys = Object.keys(configs);
    let len = keys.length;
    let i = 0;

    let next = () => {
        if (i < len) {
            buildEntry(configs[keys[i]]).then(function() {
                i++;
                next();
            }).catch((err) => {
                console.log(err);
            });
        }
    };

    next();
}

// main
function buildEntry(cfg) {
    return new Promise((resolve, reject) => {
        cfg = extend(defaultConfig, cfg, true, true);

        rp.rollup(cfg).then(function(bundle) {
            var code = bundle.generate(cfg).code;
            // Cache our bundle for later use (optional)
            cache = bundle;

            // 异步写文件
            fs.writeFile(cfg.dest, code, function(err) {
                if (err) {
                    console.log(err);
                }

                resolve();
            });
        });
    });
}

debugger;
build(configs);
