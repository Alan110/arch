
var tools =   {
    type: function(parm) {
	return Object.prototype.toString.call(parm);
    },

    isObject: function(parm) {
	return this.type(parm) === '[object Object]';
    },

    isFunction: function(parm) {
	return this.type(parm) === '[object Function]';
    },

    /**
	* string,function,object,number
	* @param {} type
	* @returns {} 
	*/
    isTypeEq : function(type,value){
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
    extend: function (parent, child, isDeep) {
	if (!(this.isObject(parent) && this.isObject(child))) {
	    return  parent;
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
	}
	else {
	    for (var j in child) {
		if (child.hasOwnProperty(j)) {
		    parent[j] = child[j];
		}

	    }
	}
	return parent;
    }

};

export {tools};
