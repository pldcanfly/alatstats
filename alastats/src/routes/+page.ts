import { data } from './data.js';

/** @type {import('./$types').Action} */
export async function load() {
	return {
		data
	};
}
