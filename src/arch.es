
/* global define __inline*/
__inline('./util.es');
__inline('./Watcher.es');
__inline('./ArrayProxy.es');
__inline('./EventEmiter.es');

define(['./Watcher', './util' , './EventEmiter'],function(Watcher , util, Emit){

    /**
     *  对外接口
     * @param {} option
     * @returns {} 
     */
    var arch = function(option) {
	return new Watcher(option);
    };

    var eventCenter = arch.eventCenter = new Emit();

    ['on','one','trigger','off'].forEach(function(el,index){
	arch[el] = function(){
	    eventCenter[el].apply(eventCenter,arguments);
	};
    });
    
    return arch;

});






