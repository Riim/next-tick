import { error } from '@riim/logger';

let global = Function('return this;')();

let nextTick: (callback: Function) => void;

if (global.process && global.process.toString() == '[object process]' && global.process.nextTick) {
	nextTick = global.process.nextTick;
} else if (global.setImmediate) {
	nextTick = function nextTick(callback) {
		setImmediate(callback);
	};
} else if (global.Promise && Promise.toString().indexOf('[native code]') != -1) {
	let prm = Promise.resolve();

	nextTick = function nextTick(callback) {
		prm.then(() => {
			callback();
		});
	};
} else {
	let queue: Array<Function> | null;

	global.addEventListener('message', () => {
		if (queue) {
			let track = queue;

			queue = null;

			for (let i = 0, l = track.length; i < l; i++) {
				try {
					track[i]();
				} catch (err) {
					error(err);
				}
			}
		}
	});

	nextTick = function nextTick(callback) {
		if (queue) {
			queue.push(callback);
		} else {
			queue = [callback];
			postMessage('__tic__', '*');
		}
	};
}

export { nextTick };
