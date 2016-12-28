'use strict';

/* global define __inline*/
define('util', ['require', 'exports', 'module'], function(require, exports, module) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
  			value: true
  });
  
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
  
  exports.tools = tools;

});;
define('Watcher', ['require', 'exports', 'module', "util", "ArrayProxy"], function(require, exports, module) {

  "use strict";
  
  Object.defineProperty(exports, "__esModule", {
  	value: true
  });
  exports.Watcher = undefined;
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _util = require("util");
  
  var _util2 = _interopRequireDefault(_util);
  
  var _ArrayProxy = require("ArrayProxy");
  
  var _ArrayProxy2 = _interopRequireDefault(_ArrayProxy);
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  /**
   * data modol
   * @param {} option
   */
  var Watcher = function () {
  	function Watcher(option) {
  		_classCallCheck(this, Watcher);
  
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
  
  
  	_createClass(Watcher, [{
  		key: "bindWatch",
  		value: function bindWatch(bindObj, data, watchrCallbacks) {
  			var self = this;
  
  			for (var prop in data) {
  				// 对象递归
  				if (_util2.default.isObject(data[prop])) {
  					bindObj[prop] = {};
  					this.bindWatch(bindObj[prop], data[prop], watchrCallbacks[prop]);
  				} else if (Array.isArray(data[prop])) {
  					// array 代理
  					this[prop] = new _ArrayProxy2.default(data[prop], function (prop) {
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
  
  exports.Watcher = Watcher;

});;
'use strict';

/* global define */
define('ArrayProxy', ['require'], function (require) {

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
    }, this);

    return ResponseArray;
});;
define('EventEmiter', ['require', 'exports', 'module'], function(require, exports, module) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
      value: true
  });
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var EventEmitter = exports.EventEmitter = function () {
      function EventEmitter() {
          _classCallCheck(this, EventEmitter);
      }
  
      _createClass(EventEmitter, [{
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

});;

define('arch', ['./Watcher', './util', './EventEmiter'], function (Watcher, util, Emit) {

   /**
    *  对外接口
    * @param {} option
    * @returns {} 
    */
   var arch = function arch(option) {
      return new Watcher(option);
   };

   var eventCenter = arch.eventCenter = new Emit();

   ['on', 'one', 'trigger', 'off'].forEach(function (el, index) {
      arch[el] = function () {
         eventCenter[el].apply(eventCenter, arguments);
      };
   });

   return arch;
});