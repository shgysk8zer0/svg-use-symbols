import { readFile } from '@shgysk8zer0/npm-utils/fs';
import { LF } from '@shgysk8zer0/npm-utils/consts';

export const CSV = ['.csv'];

export async function readCSVFile(path, { encoding, signal } = {}) {
	const contents = await readFile(path, { encoding, signal });
	return contents
		.split(LF)
		.filter(l => l.length !== 0)
		.map(line => line.split(',').map(c => c.trim().replaceAll('"', '') ));
}
