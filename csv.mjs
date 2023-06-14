import { readFile } from '@shgysk8zer0/npm-utils/fs';
import { LF } from '@shgysk8zer0/npm-utils/consts';

export const CSV = ['.csv'];

export async function readCSVFile(path, { encoding, signal } = {}) {
	console.warn('CSV supported is deprecated and only offered for migrating from `svg-sprite-generator`.');
	const contents = await readFile(path, { encoding, signal });
	return contents
		.split(LF)
		.filter(l => l.length !== 0)
		.map(line => line.split(',').map(c => c.trim().replaceAll('"', '') ));
}
