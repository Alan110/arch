define(function(){

    var utils = require('./util.js');

    function ResponseArray (){
	this.length = 0;
    }

    var ArrayProto = Array.prototype;
    ResponseArray.prototype = Object.create(ArrayProto);
    ResponseArray.prototype.constructor = ResponseArray;

    utils.extend(ResponseArray.prototype,{
	push : function(arg){
	    console.log('i m new push method');
	    ArrayProto.push.call(this,arg);
	}
    });
    
    return ResponseArray;
    
});
