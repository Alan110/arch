
__inline('./model.es');
__inline('./util.es');
__inline('./ArrayProxy.es');
__inline('./eventEmiter.es');

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






