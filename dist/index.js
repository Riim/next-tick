"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("@riim/logger");
var global = Function('return this;')();
var nextTick;
exports.nextTick = nextTick;
if (global.process && global.process.toString() == '[object process]' && global.process.nextTick) {
    exports.nextTick = nextTick = global.process.nextTick;
}
else if (global.setImmediate) {
    exports.nextTick = nextTick = function nextTick(callback) {
        setImmediate(callback);
    };
}
else if (global.Promise && Promise.toString().indexOf('[native code]') != -1) {
    var prm_1 = Promise.resolve();
    exports.nextTick = nextTick = function nextTick(callback) {
        prm_1.then(function () {
            callback();
        });
    };
}
else {
    var queue_1;
    global.addEventListener('message', function () {
        if (queue_1) {
            var track = queue_1;
            queue_1 = null;
            for (var i = 0, l = track.length; i < l; i++) {
                try {
                    track[i]();
                }
                catch (err) {
                    logger_1.error(err);
                }
            }
        }
    });
    exports.nextTick = nextTick = function nextTick(callback) {
        if (queue_1) {
            queue_1.push(callback);
        }
        else {
            queue_1 = [callback];
            postMessage('__tic__', '*');
        }
    };
}
