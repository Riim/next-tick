(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = global || self, factory(global['@riim/next-tick'] = {}));
}(this, (function (exports) { 'use strict';

	const nextTick = (() => {
	    const global = Function('return this;')();
	    if (global.process &&
	        global.process.toString() == '[object process]' &&
	        global.process.nextTick) {
	        return global.process.nextTick;
	    }
	    if (global.setImmediate && global.setImmediate.toString().indexOf('[native code]') != -1) {
	        const setImmediate = global.setImmediate;
	        return (cb) => {
	            setImmediate(cb);
	        };
	    }
	    const promise = Promise.resolve();
	    return (cb) => {
	        promise.then(cb);
	    };
	})();

	exports.nextTick = nextTick;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
