#!/usr/bin/env node

import { readJSONFile } from '@shgysk8zer0/npm-utils/json';
import { generateSymbols, generateSymbolsFromDirectory } from './generator.mjs';
import { program } from 'commander';

async function init() {
	const { name: NAME, version: VERSION, description: DESCRIPTION } = await readJSONFile('./package.json');
	program
		.name(NAME)
		.version(VERSION)
		.description(DESCRIPTION)
		.option('-e, --encoding <encoding>', 'encoding', 'utf8')
		.option('-c, --config [config]', 'JSON or YAML config file')
		.option('-d, --directory [directory]', 'path to directory of SVGs')
		.option('-o, --output [output]', 'output file')
		.parse(process.argv);

	return {
		args: program.args,
		opts: program.opts(),
	};
}

init().then(async ({ opts: { directory, config, encoding, output }}) => {
	if (typeof directory === 'string') {
		await generateSymbolsFromDirectory(directory, { output, encoding });
	} else if (typeof config === 'string') {
		await generateSymbols(config, { encoding, output });
	} else {
		throw new Error('Either config or directory are required options.');
	}
});
