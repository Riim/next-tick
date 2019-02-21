"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@riim/logger");
const global = Function('return this;')();
let nextTick;
exports.nextTick = nextTick;
if (global.process && global.process.toString() == '[object process]' && global.process.nextTick) {
    exports.nextTick = nextTick = global.process.nextTick;
}
else if (global.setImmediate && global.setImmediate.toString().indexOf('[native code]') != -1) {
    const setImmediate = global.setImmediate;
    exports.nextTick = nextTick = cb => {
        setImmediate(cb);
    };
}
else if (global.Promise && Promise.toString().indexOf('[native code]') != -1) {
    const prm = Promise.resolve();
    exports.nextTick = nextTick = cb => {
        prm.then(() => {
            cb();
        });
    };
}
else {
    let queue;
    global.addEventListener('message', () => {
        if (queue) {
            let track = queue;
            queue = null;
            for (let i = 0, l = track.length; i < l; i++) {
                try {
                    track[i]();
                }
                catch (err) {
                    logger_1.error(err);
                }
            }
        }
    });
    exports.nextTick = nextTick = cb => {
        if (queue) {
            queue.push(cb);
        }
        else {
            queue = [cb];
            postMessage('__tic__', '*');
        }
    };
}
