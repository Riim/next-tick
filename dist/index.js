"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@riim/logger");
exports.nextTick = (() => {
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
    if (global.Promise && Promise.toString().indexOf('[native code]') != -1) {
        const prm = Promise.resolve();
        return (cb) => {
            prm.then(() => {
                cb();
            });
        };
    }
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
    return (cb) => {
        if (queue) {
            queue.push(cb);
        }
        else {
            queue = [cb];
            postMessage('__tic__', '*');
        }
    };
})();
