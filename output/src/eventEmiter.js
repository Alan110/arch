define('EventEmiter', ['require', 'exports', 'module'], function(require, exports, module) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
      value: true
  });
  
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  var EventEmitter = exports.EventEmitter = function () {
      function EventEmitter() {
          _classCallCheck(this, EventEmitter);
      }
  
      _createClass(EventEmitter, [{
          key: '_indexOfListener',
          value: function _indexOfListener(listeners, listener) {
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
  
      }, {
          key: 'on',
          value: function on(evt, listener) {
              var listeners = this._getEventListenersAsObject(evt);
              var isMulti = (typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) === 'object';
  
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
      }, {
          key: 'one',
          value: function one(evt, listener) {
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
  
      }, {
          key: 'off',
          value: function off(evt, listener) {
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
  
      }, {
          key: 'trigger',
          value: function trigger(evt, args) {
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
      }, {
          key: '_getEventListenersAsObject',
          value: function _getEventListenersAsObject(evt) {
              var listeners = this._getEventListeners(evt);
              var response;
  
              if (listeners instanceof Array) {
                  response = {};
                  response[evt] = listeners;
              }
  
              return response || listeners;
          }
      }, {
          key: '_getEventListeners',
          value: function _getEventListeners(evt) {
              var events = this._getEvents();
              return events[evt] || (events[evt] = []);
          }
      }, {
          key: '_getEvents',
          value: function _getEvents() {
              return this._events || (this._events = {});
          }
      }]);
  
      return EventEmitter;
  }();

});