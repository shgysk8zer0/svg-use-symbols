const external = [
	'@shgysk8zer0/npm-utils/fs', '@shgysk8zer0/npm-utils/json', '@shgysk8zer0/npm-utils/yaml',
	'@shgysk8zer0/npm-utils/utils', '@shgysk8zer0/npm-utils/consts',
	'@shgysk8zer0/consts/mimes', '@shgysk8zer0/consts/exts',
	'cheerio', 'commander', 'node:path',
];

export default [{
	input: 'generator.mjs',
	external,
	output: {
		file: 'generator.cjs',
		format: 'cjs',
	}
}, {
	input: 'cli.mjs',
	external,
	output: {
		file: 'cli.cjs',
		format: 'cjs',
	}
}];
