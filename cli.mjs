#!/usr/bin/env node

import { readJSONFile } from '@shgysk8zer0/npm-utils/json';
import { generateSymbols } from './generator.mjs';
import { program } from 'commander';

async function init() {
	const { name: NAME, version: VERSION, description: DESCRIPTION } = await readJSONFile('./package.json');
	program
		.name(NAME)
		.version(VERSION)
		.description(DESCRIPTION)
		.argument('<config>', 'JSON or YAML config file.')
		.option('-e, --encoding <encoding>', 'encoding', 'utf8')
		.option('-o, --output [output]', 'output file')
		.parse(process.argv);

	return {
		args: program.args,
		opts: program.opts(),
	};
}

init().then(async ({ args, opts }) => {
	switch(args.length) {
		case 0:
			throw new Error('Missing required config arg.');

		default:
			await generateSymbols(args[0], opts);
	}
});
