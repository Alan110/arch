
export class EventEmitter{

    _indexOfListener (listeners, listener) {
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
    on (evt, listener) {
        var listeners = this._getEventListenersAsObject(evt);
        var isMulti = typeof listener === 'object';

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

    one (evt, listener) {
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
    off (evt, listener) {
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
    trigger (evt, args) {
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

    _getEventListenersAsObject (evt) {
        var listeners = this._getEventListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    }

    _getEventListeners (evt) {
        var events = this._getEvents();
        return events[evt] || (events[evt] = []);
    }

    _getEvents () {
        return this._events || (this._events = {});
    }

}


