'use strict';

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
});;
'use strict';

define('util', ['require'], function (require) {
    return {
        type: function type(parm) {
            return Object.prototype.toString.call(parm);
        },

        isObject: function isObject(parm) {
            return this.type(parm) === '[object Object]';
        },

        isFunction: function isFunction(parm) {
            return this.type(parm) === '[object Function]';
        },

        /**
         * string,function,object,number
         * @param {} type
         * @returns {} 
         */
        isTypeEq: function isTypeEq(type, value) {
            return '[object ' + type + ']' === Object.prototype.toString.call(value).toLocaleLowerCase();
        },

        /**
         * 继承对象方法
         *
         * @param parent 继承者
         * @param child  被继承者
         * @param isDeep 是否深度拷贝
         * @returns number 失败返回-1
         */
        extend: function extend(parent, child, isDeep) {
            if (!(this.isObject(parent) && this.isObject(child))) {
                return parent;
            }

            if (isDeep) {
                for (var i in child) {
                    if (child.hasOwnProperty(i)) {
                        if (this.isObject(child[i])) {
                            parent[i] = this.isArray(child[i]) ? [] : {};
                            arguments.callee(parent[i], child[i], isDeep);
                        }

                        parent[i] = child[i];
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
        }

    };
});;
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
});;
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define('eventEmiter', ['require'], function (require) {

    function EventEmitter() {}

    var proto = EventEmitter.prototype;

    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * registe custom event into event center
     * @param {} evt event type
     * @param {} listener callback
     * @returns {} this reference
     */
    proto.on = function (evt, listener) {
        var listeners = this._getEventListenersAsObject(evt);
        var isMulti = (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) === 'object';

        for (var key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(isMulti ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    proto.one = function (evt, listener) {
        return this.on(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * delete event bind
     * @param {} evt
     * @param {} listener
     * @returns {} 
     */
    proto.off = function (evt, listener) {
        var listeners = this._getEventListenersAsObject(evt);

        for (var key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                var index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * fire event with parmas
     * @param {} evt event type
     * @param {} args parmas
     * @returns {} this reference
     */
    proto.trigger = function (evt, args) {
        var listenersMap = this._getEventListenersAsObject(evt);
        var response;

        for (var key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                var listeners = listenersMap[key].slice(0);
                var i = listeners.length;
                while (i--) {
                    var listener = listeners[i];

                    if (listener.once === true) {
                        this.off(evt, listener.listener);
                    }

                    response = listener.listener.call(this, args || []);
                }
            }
        }

        return this;
    };

    proto._getEventListenersAsObject = function (evt) {
        var listeners = this._getEventListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    proto._getEventListeners = function (evt) {
        var events = this._getEvents();
        return events[evt] || (events[evt] = []);
    };

    proto._getEvents = function () {
        return this._events || (this._events = {});
    };

    return EventEmitter;
});;

define('arch', ['./model', './util', './eventEmiter'], function (model, util, Emit) {

   /**
    *  对外接口
    * @param {} option
    * @returns {} 
    */
   var arch = function arch(option) {
      return new model(option);
   };

   var eventCenter = arch.eventCenter = new Emit();

   ['on', 'one', 'trigger', 'off'].forEach(function (el, index) {
      arch[el] = function () {
         eventCenter[el].apply(eventCenter, arguments);
      };
   });

   return arch;
});