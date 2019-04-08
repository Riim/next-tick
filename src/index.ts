import { error } from '@riim/logger';

export const nextTick: (cb: Function) => void = (() => {
	const global = Function('return this;')();

	if (
		global.process &&
		global.process.toString() == '[object process]' &&
		global.process.nextTick
	) {
		return global.process.nextTick;
	}

	if (global.setImmediate && global.setImmediate.toString().indexOf('[native code]') != -1) {
		const setImmediate = global.setImmediate;

		return (cb: Function) => {
			setImmediate(cb);
		};
	}

	if (global.Promise && Promise.toString().indexOf('[native code]') != -1) {
		const prm = Promise.resolve();

		return (cb: Function) => {
			prm.then(() => {
				cb();
			});
		};
	}

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

	return (cb: Function) => {
		if (queue) {
			queue.push(cb);
		} else {
			queue = [cb];
			postMessage('__tic__', '*');
		}
	};
})();
