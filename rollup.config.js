import tslint from 'rollup-plugin-tslint';
import typescript from 'rollup-plugin-typescript2';

export default {
	input: './src/nextTick.ts',

	output: {
		file: './dist/nextTick.umd.js',
		format: 'umd',
		name: '@riim/next-tick'
	},

	plugins: [
		tslint(),
		typescript({ clean: true })
	]
};
