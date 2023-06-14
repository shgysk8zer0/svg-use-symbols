#!/usr/bin/env node
import { readJSONFile } from '@shgysk8zer0/npm-utils/json';
import { readYAMLFile } from '@shgysk8zer0/npm-utils/yaml';
import { readFile, writeFile, getFileExtension, ENCODING } from '@shgysk8zer0/npm-utils/fs';
import { SVG as SVG_MIMES } from '@shgysk8zer0/npm-utils/mimes';
import { JSON as JSON_EXTS, YAML as YAML_EXTS } from '@shgysk8zer0/npm-utils/exts';
import { isURL, isObject } from '@shgysk8zer0/npm-utils/utils';
import { CSV as CSV_EXTS, readCSVFile } from './csv.mjs';
import { load } from 'cheerio';

const ROOT = process.cwd();
const MIME = SVG_MIMES[0];
const EXT_TYPES = {
	json: JSON_EXTS,
	yaml: YAML_EXTS,
	csv: CSV_EXTS,
};

function getFileType(ext) {
	const match = Object.entries(EXT_TYPES).find(([, exts]) => exts.includes(ext));

	if (Array.isArray(match)) {
		return match[0];
	}
}

async function readConfig(path, { encoding = ENCODING, signal } = {}) {
	const ext = getFileExtension(path);

	switch(getFileType(ext)) {
		case 'json': return readJSONFile(`${ROOT}/${path}`, { encoding, signal });
		case 'yaml': return readYAMLFile(`${ROOT}/${path}`, { encoding, signal });
		case 'csv': return readCSVFile(`${ROOT}/${path}`, { encoding, signal })
			.then(Object.fromEntries);
	}
}

async function fetchIcon(url, { signal } = {}) {
	const resp = await fetch(url, {
		headers: new Headers({ Accept: MIME }),
		signal,
	});

	if (! resp.ok) {
		throw new Error(`Error fetching ${url}`);
	} else if (! resp.headers.get('Content-Type').startsWith(MIME)) {
		throw new TypeError(`<${url}> is not an SVG. Content-Type: ${resp.headers.get('Content-Type')}`);
	} else {
		return resp.text();
	}
}

async function loadIcon(loc, { encoding = ENCODING, signal } = {}) {
	if (isURL(loc)) {
		return await fetchIcon(loc, { signal });
	} else {
		try {
			return await readFile(`${ROOT}/${loc}`, { encoding, signal });
		} catch {
			throw new Error(`Unable to find or read file at ${loc}.`);
		}
	}
}

export async function generateSymbol(id, loc, { encoding, signal } = {}) {
	const icon = await loadIcon(loc, { encoding, signal });
	const svg = load(`<div>${icon}</div>`, { xmlMode: true })('svg');

	if (svg.length === 0) {
		throw new Error(`Missing or empty svg for ${id}`);
	} else {
		return `<symbol id="${id}" viewBox="${svg.attr('viewBox')}">${svg.html()}</symbol>`;
	}
}

export async function writeSVG(path, symbols, { encoding } = {}) {
	await writeFile(
		`${ROOT}/${path}`,
		`<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`,
		{ encoding },
	);

	console.info(`Wrote ${symbols.length} <symbol>s to "${path}".`);
}

export async function generateSymbols(configFile, { encoding = ENCODING, output, signal } = {}) {
	const config = await readConfig(configFile, { encoding, signal });

	if (isObject(config)) {
		if (typeof output !== 'string') {
			throw new Error('Missing required output option (-o or --output)');
		} else {
			const symbols = await Promise.all(
				Object.entries(config).map(
					async ([id, loc]) => generateSymbol(id, loc, { encoding, signal })
				)
			);

			await writeSVG(output, symbols, { encoding, signal });
		}

	} else if (Array.isArray(config)) {
		if (typeof output === 'string') {
			throw new Error('Output is ignored when the config file contains an array for multiple output files.');
		}
		await Promise.all(config.map(async ({ output, icons }) => {
			if (typeof output !== 'string') {
				throw new TypeError('`output` expected to be a string');
			} else if (! isObject(icons)) {
				throw new TypeError('`icons` expected to be an object of { id: path_or_url }');
			} else {
				const symbols = await Promise.all(
					Object.entries(icons).map(
						async ([id, loc]) => generateSymbol(id, loc, { encoding, signal })
					)
				);

				await writeSVG(output, symbols, { encoding, signal });
			}
		}));
	}
}
