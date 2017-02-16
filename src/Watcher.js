import util from "./util.js";
import ArrayProxy from "./ArrayProxy.js";

/**
 * data modol
 * @param {} option
 */
class Watcher {

    constructor(option) {
        //var self = this;
        this.data = option.data || {};
        this.watchrCallbacks = option.watch || {};
        this.bindWatch(this, this.data, this.watchrCallbacks);
    }

    /**
     * watcher 递归绑定
     * @param {} bindObj  setter/getter 绑定到的对象
     * @param {} data 原始数据
     * @param {} watchrCallbacks  watcher 回调
     * @returns {} 
     */
    bindWatch(bindObj, data, watchrCallbacks) {

        for (let prop in data) {
            // 对象递归
            if (util.isObject(data[prop])) {
                bindObj[prop] = {};
                this.bindWatch(bindObj[prop], data[prop], watchrCallbacks[prop]);
            } else if (Array.isArray(data[prop])) {
                // array 代理
                this[prop] = new ArrayProxy(data[prop], (old , newvalue) => {
                    var watchCall = watchrCallbacks[prop];
                    watchCall && watchCall.call(this, old, newvalue);
                });
            } else {
                // this 作用域在 this.data
                // getter/setter 和原始数据不能是同一个属性，不然会死循环。此处将 this.xx -> setter -> this.data.xx 
                Object.defineProperty(bindObj, prop, {
                    get: function () {
                         return data[prop]; 
                    },

                    set: function(newvalue){
                        var watchCall = watchrCallbacks[prop];
                        watchCall && watchCall.call(this, data[prop], newvalue);
                        data[prop] = newvalue;
                    }
                });

            }
        }
    }

}

export default Watcher;
