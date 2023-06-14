#!/usr/bin/env node

import { readJSONFile } from '@shgysk8zer0/npm-utils/json';
import { program } from 'commander';
import { extname, basename } from 'node:path';
import { generateSymbols, generateSymbolsFromDirectory, generateSymbol, writeSVG } from './generator.mjs';

async function init() {
	const { name: NAME, version: VERSION, description: DESCRIPTION } = await readJSONFile('./package.json');
	program
		.name(NAME)
		.version(VERSION)
		.description(DESCRIPTION)
		.option('-e, --encoding [encoding]', 'encoding', 'utf8')
		.option('-c, --config [config]', 'JSON or YAML config file')
		.option('-d, --directory [directory]', 'path to directory of SVGs')
		.option('-l, --list [list]', 'comma separated list of SVGs')
		.option('-o, --output [output]', 'output file')
		.parse(process.argv);

	return {
		args: program.args,
		opts: program.opts(),
	};
}

init().then(async ({ opts: { directory, config, encoding, output, list }}) => {
	if (typeof directory === 'string') {
		await generateSymbolsFromDirectory(directory, { output, encoding });
	} else if (typeof config === 'string') {
		await generateSymbols(config, { encoding, output });
	} else if (typeof list === 'string') {
		if (typeof output !== 'string') {
			throw new Error('Output is a required options for SVG lists');
		} else {
			const symbols = await Promise.all(
				list.split(',').map(async svg => {
					const id = basename(svg).replace(extname(svg), '');
					return await generateSymbol(id, svg, { encoding });
				})
			);

			await writeSVG(output, symbols, { encoding });
		}
	} else {
		throw new Error('Either config or directory are required options.');
	}
});
