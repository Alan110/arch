(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.arch = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

console.log('aaa');
var tools = {
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
   * @isMerge 数组合并,注意值没有去重
   * @returns number 失败返回-1
   */
			extend: function (_extend) {
						function extend(_x, _x2, _x3, _x4) {
									return _extend.apply(this, arguments);
						}

						extend.toString = function () {
									return _extend.toString();
						};

						return extend;
			}(function (parent, child, isDeep, isMerge) {
						if ((typeof parent === 'undefined' ? 'undefined' : _typeof(parent)) !== 'object' || (typeof child === 'undefined' ? 'undefined' : _typeof(child)) !== 'object') {
									return parent;
						}

						if (isDeep) {
									for (var i in child) {
												if (child.hasOwnProperty(i)) {
															if (_typeof(child[i]) === 'object') {
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
			})

};

var ArrayProto = Array.prototype;

function ResponseArray(arr, notify) {
    this.arr = arr;
    this.notify = notify;
}

ResponseArray.prototype = Object.create(ArrayProto);
ResponseArray.prototype.constructor = ResponseArray;

// 数组不能用setter/getter监听变化，需要使用以下的代理函数
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (el, index) {
    ResponseArray.prototype[el] = function () {
        var args = ArrayProto.slice.call(arguments);
        ArrayProto[el].apply(this.arr, args);

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
});

/**
 * data modol
 * @param {} option
 */

var Watcher = function () {
	function Watcher(option) {
		classCallCheck(this, Watcher);

		//var self = this;
		this.data = option.data || {};
		this.watchrCallbacks = option.watch || {};
		this.bindWatch(this, this.data, this.watchrCallbacks);
		if (undefined != 'pub') {
			warn('我靠你妹 !!!');
		}
	}

	/**
 * watcher 递归绑定
 * @param {} bindObj  setter/getter 绑定到的对象
 * @param {} data 原始数据
 * @param {} watchrCallbacks  watcher 回调
 * @returns {} 
 */


	createClass(Watcher, [{
		key: "bindWatch",
		value: function bindWatch(bindObj, data, watchrCallbacks) {
			var self = this;

			for (var prop in data) {
				// 对象递归
				if (tools.isObject(data[prop])) {
					bindObj[prop] = {};
					this.bindWatch(bindObj[prop], data[prop], watchrCallbacks[prop]);
				} else if (Array.isArray(data[prop])) {
					// array 代理
					this[prop] = new ResponseArray(data[prop], function (prop) {
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
		}
	}]);
	return Watcher;
}();

var EventEmitter = function () {
    function EventEmitter() {
        classCallCheck(this, EventEmitter);
    }

    createClass(EventEmitter, [{
        key: '_indexOfListener',
        value: function _indexOfListener(listeners, listener) {
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

    }, {
        key: 'on',
        value: function on(evt, listener) {
            var listeners = this._getEventListenersAsObject(evt);
            var isMulti = (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) === 'object';

            for (var key in listeners) {
                if (listeners.hasOwnProperty(key) && this._indexOfListener(listeners[key], listener) === -1) {
                    listeners[key].push(isMulti ? listener : {
                        listener: listener,
                        once: false
                    });
                }
            }

            return this;
        }
    }, {
        key: 'one',
        value: function one(evt, listener) {
            return this.on(evt, {
                listener: listener,
                once: true
            });
        }

        /**
         * delete event bind
         * @param {} evt
         * @param {} listener
         * @returns {} 
         */

    }, {
        key: 'off',
        value: function off(evt, listener) {
            var listeners = this._getEventListenersAsObject(evt);

            for (var key in listeners) {
                if (listeners.hasOwnProperty(key)) {
                    var index = this._indexOfListener(listeners[key], listener);

                    if (index !== -1) {
                        listeners[key].splice(index, 1);
                    }
                }
            }

            return this;
        }

        /**
         * fire event with parmas
         * @param {} evt event type
         * @param {} args parmas
         * @returns {} this reference
         */

    }, {
        key: 'trigger',
        value: function trigger(evt, args) {
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
        }
    }, {
        key: '_getEventListenersAsObject',
        value: function _getEventListenersAsObject(evt) {
            var listeners = this._getEventListeners(evt);
            var response;

            if (listeners instanceof Array) {
                response = {};
                response[evt] = listeners;
            }

            return response || listeners;
        }
    }, {
        key: '_getEventListeners',
        value: function _getEventListeners(evt) {
            var events = this._getEvents();
            return events[evt] || (events[evt] = []);
        }
    }, {
        key: '_getEvents',
        value: function _getEvents() {
            return this._events || (this._events = {});
        }
    }]);
    return EventEmitter;
}();

/**
*  对外接口
* @param {} option
* @returns {} 
*/
var arch = function arch(option) {
    return new Watcher(option);
};

var eventCenter = arch.eventCenter = new EventEmitter();

['on', 'one', 'trigger', 'off'].forEach(function (el, index) {
    arch[el] = function () {
        eventCenter[el].apply(eventCenter, arguments);
    };
});

var a = tools.extend({
    name: '123', arr: [1, 2]
}, {
    arr: [3, 4, 5]

}, true, true);

console.log(a);

return arch;

})));
