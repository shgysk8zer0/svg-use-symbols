import { readFile } from '@shgysk8zer0/npm-utils/fs';
import { LF } from '@shgysk8zer0/npm-utils/consts';
import { extname } from 'node:path';

export const CSV = ['.csv'];

export async function readCSVFile(path, { encoding, signal } = {}) {
	console.warn('CSV supported is deprecated and only offered for migrating from `svg-sprite-generator`.');
	console.info(`Please run svg-use-symbols --migrate ${path} --output ${path.replace(extname(path), '.json')}`);

	const contents = await readFile(path, { encoding, signal });
	return contents
		.replaceAll('\r', LF)
		.split(LF)
		.filter(l => l.length !== 0)
		.map(line => line.split(',').map(c => c.trim().replaceAll('"', '') ));
}
