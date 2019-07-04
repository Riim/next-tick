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

	const promise = Promise.resolve();

	return (cb: Function) => {
		promise.then(() => {
			cb();
		});
	};
})();
