'use strict';

define('model', ['util', 'ArrayProxy'], function (util, ArrayProxy) {

    /**
     * data modol
     * @param {} option
     */
    var alan = function alan(option) {
        //var self = this;
        this.data = option.data || {};
        this.watchrCallbacks = option.watch || {};
        this.bindWatch(this, this.data, this.watchrCallbacks);
    };

    var fn = alan.fn = alan.prototype;

    /**
     * watcher 递归绑定
     * @param {} bindObj  setter/getter 绑定到的对象
     * @param {} data 原始数据
     * @param {} watchrCallbacks  watcher 回调
     * @returns {} 
     */
    fn.bindWatch = function (bindObj, data, watchrCallbacks) {
        var self = this;

        for (var prop in data) {
            if (util.isObject(data[prop])) {
                bindObj[prop] = {};
                this.bindWatch(bindObj[prop], data[prop], watchrCallbacks[prop]);
            } else if (Array.isArray(data[prop])) {
                // array 代理
                this[prop] = new ArrayProxy(data[prop], function (prop) {
                    return function (old, newvalue) {
                        var watchCall = watchrCallbacks[prop];
                        watchCall && watchCall.call(self, old, newvalue);
                    };
                }(prop));
            } else {
                // this 作用域在 this.data
                // getter/setter 和原始数据不能是同一个属性，不然会死循环。此处将 this.xx -> setter -> this.data.xx 
                Object.defineProperty(bindObj, prop, {
                    get: function (prop) {
                        return function () {
                            return data[prop];
                        };
                    }(prop),

                    set: function (prop) {
                        return function (newvalue) {
                            var watchCall = watchrCallbacks[prop];
                            watchCall && watchCall.call(self, data[prop], newvalue);
                            data[prop] = newvalue;
                        };
                    }(prop)
                });
            }
        }
    };

    fn.update = function () {};

    return alan;
});