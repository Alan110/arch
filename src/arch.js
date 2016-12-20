
__inline('./model.js');
__inline('./util.js');
__inline('./eventEmiter.js');

define(['./model', './util' , './eventEmiter'],function(model , util, Emit){

    /**
     *  对外接口
     * @param {} option
     * @returns {} 
     */
    var arch = function(option) {
	return new model(option);
    };

    var eventCenter = arch.eventCenter = new Emit();

    ['on','one','trigger','off'].forEach(function(el,index){
	arch[el] = function(){
	    eventCenter[el].apply(eventCenter,arguments);
	};
    });
    
    return arch;

});






