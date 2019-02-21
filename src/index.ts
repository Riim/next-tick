import { error } from '@riim/logger';

const global = Function('return this;')();

let nextTick: (cb: Function) => void;

if (global.process && global.process.toString() == '[object process]' && global.process.nextTick) {
	nextTick = global.process.nextTick;
} else if (global.setImmediate && global.setImmediate.toString().indexOf('[native code]') != -1) {
	const setImmediate = global.setImmediate;

	nextTick = cb => {
		setImmediate(cb);
	};
} else if (global.Promise && Promise.toString().indexOf('[native code]') != -1) {
	const prm = Promise.resolve();

	nextTick = cb => {
		prm.then(() => {
			cb();
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

	nextTick = cb => {
		if (queue) {
			queue.push(cb);
		} else {
			queue = [cb];
			postMessage('__tic__', '*');
		}
	};
}

export { nextTick };
