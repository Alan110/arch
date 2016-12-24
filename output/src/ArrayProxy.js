'use strict';

define('ArrayProxy', ['require', 'util'], function (require) {

    var utils = require('util');
    var ArrayProto = Array.prototype;

    function ResponseArray(arr, notify) {
        this.arr = arr;
        this.notify = notify;
    }

    ResponseArray.prototype = Object.create(ArrayProto);
    ResponseArray.prototype.constructor = ResponseArray;;

    // 数组不能用setter/getter监听变化，需要使用以下的代理函数
    ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (el, index) {
        ResponseArray.prototype[el] = function () {
            var args = ArrayProto.slice.call(arguments);
            var result = ArrayProto[el].apply(this.arr, args);

            var inserted = void 0;
            switch (el) {
                case 'push':
                    inserted = args;
                    break;
                case 'unshift':
                    inserted = args;
                    break;
                case 'splice':
                    inserted = args.slice(2);
                    break;
            }

            // 实时改变，newvalue为改变的对象列表
            this.notify(this.arr, inserted);
        };
    }, this);

    return ResponseArray;
});