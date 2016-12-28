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

});