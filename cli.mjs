#!/usr/bin/env node
import { readJSONFile, writeJSONFile } from '@shgysk8zer0/npm-utils/json';
import { writeYAMLFile } from '@shgysk8zer0/npm-utils/yaml';
import { readCSVFile } from './csv.mjs';
import { program } from 'commander';
import { extname, basename } from 'node:path';
import { generateSymbols, generateSymbolsFromDirectory, generateSymbol, writeSVG } from './generator.mjs';

async function init() {
	const { name: NAME, version: VERSION, description: DESCRIPTION } = await readJSONFile('./package.json');
	program
		.name(NAME)
		.version(VERSION)
		.description(DESCRIPTION)
		.option('-c, --config [config]', 'JSON or YAML config file')
		.option('-d, --directory [directory]', 'path to directory of SVGs')
		.option('-e, --encoding [encoding]', 'encoding', 'utf8')
		.option('-f, --format [format]', 'output format for migrating from CSV', 'json')
		.option('-l, --list [list]', 'comma separated list of SVGs')
		.option('-m, --migrate [migrate]', 'path to deprecated CSV config file')
		.option('-o, --output [output]', 'output file')
		.parse(process.argv);

	return {
		args: program.args,
		opts: program.opts(),
	};
}

init().then(async ({ opts: { directory, config, encoding, output, list, migrate, format }}) => {
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
	} else if (typeof migrate === 'string') {
		if (typeof output !== 'string') {
			throw new Error('Output is a required option for migrations.');
		} else {
			switch(format) {
				case 'json':
					await readCSVFile(migrate, { encoding })
						.then(config => writeJSONFile(output, Object.fromEntries(config), { encoding }));
					break;

				case 'yaml':
					await readCSVFile(migrate, { encoding })
						.then(config => writeYAMLFile(output, Object.fromEntries(config), { encoding }));
					break;

				default:
					throw new Error(`Unknown output format: "${format}"`);
			}
		}
	} else {
		throw new Error('Either config or directory are required options.');
	}
});
