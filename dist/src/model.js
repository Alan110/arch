
define('model', ['util'],function(util){

    /**
    * data modol
    * @param {} option
    */
    var alan = function(option) {
	//var self = this;
	this.data = option.data || {};
	this.watchrCallbacks = option.watch || {};
	this.vm = {};
	this.bindWatch(this.vm, this.data , this.watchrCallbacks);
    };

    var fn = alan.fn = alan.prototype;

    /**
    * watcher 递归绑定
    * @param {} bindObj  setter/getter 绑定到的对象
    * @param {} data 原始数据
    * @param {} watchrCallbacks  watcher 回调
    * @returns {} 
    */
    fn.bindWatch = function(bindObj, data, watchrCallbacks) {
	var self = this;

	for (var prop in data) {
	    if (util.isObject(data[prop])) {
		bindObj[prop] = {};
		this.bindWatch(bindObj[prop], data[prop], watchrCallbacks[prop]);
	    } else {
		// this 作用域在 this.data
		// getter/setter 和原始数据不能是同一个属性，不然会死循环。此处将 this.xx -> setter -> this.data.xx 
		Object.defineProperty(bindObj, prop, {
		    get: function(prop) {
			return function() {
			    return data[prop];
			};
		    }(prop),

		    set: function(prop) {
			return function(value) {
			    var watchCall = watchrCallbacks[prop];
			    watchCall && watchCall.call(self.vm, data[prop], value);
			    data[prop] = value;
			};
		    }(prop)
		});

	    }
	}
    };


    fn.update = function() {

    };

    return alan;

});
