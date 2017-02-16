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
var arch = (option) => {
    return new Watcher(option);
};

var eventCenter = arch.eventCenter = new Emit();

['on', 'one', 'trigger', 'off'].forEach((el, index) => {
    arch[el] = function() {
        eventCenter[el].apply(eventCenter, arguments);
    };
});

export default arch;
