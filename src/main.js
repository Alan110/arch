/**
 * @fileOverview
 * @name main.js
 * @author lijialong <lijialong01@baidu.com>
 * @license license name
 */

import Watcher from './Watcher.js';
import Emit from './EventEmiter.js';
import util from './util.js';


    /**
    *  对外接口
    * @param {} option
    * @returns {} 
    */
    var arch = function(option) {
	return new Watcher(option);
    };

    var eventCenter = arch.eventCenter = new Emit();

    ['on', 'one', 'trigger', 'off'].forEach(function(el, index) {
	arch[el] = function() {
	    eventCenter[el].apply(eventCenter, arguments);
	};
    });

var a = util.extend({
    name:'123',arr: [1,2]
},{
    arr: [3,4,5]

},true,true);

console.log(a);

 export default arch;
