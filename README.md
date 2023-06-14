# @shgysk8zer0/svg-use-symbols
An npm package for use with `<svg><use xlink:href=""></use></svg>`

- - -
[![CodeQL](https://github.com/shgysk8zer0/svg-use-symbols/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/shgysk8zer0/svg-use-symbols/actions/workflows/codeql-analysis.yml)
![Node CI](https://github.com/shgysk8zer0/svg-use-symbols/workflows/Node%20CI/badge.svg)
![Lint Code Base](https://github.com/shgysk8zer0/svg-use-symbols/workflows/Lint%20Code%20Base/badge.svg)

[![GitHub license](https://img.shields.io/github/license/shgysk8zer0/svg-use-symbols.svg)](https://github.com/shgysk8zer0/svg-use-symbols/blob/master/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/shgysk8zer0/svg-use-symbols.svg)](https://github.com/shgysk8zer0/svg-use-symbols/commits/master)
[![GitHub release](https://img.shields.io/github/release/shgysk8zer0/svg-use-symbols?logo=github)](https://github.com/shgysk8zer0/svg-use-symbols/releases)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/shgysk8zer0?logo=github)](https://github.com/sponsors/shgysk8zer0)

[![npm](https://img.shields.io/npm/v/@shgysk8zer0/svg-use-symbols)](https://www.npmjs.com/package/@shgysk8zer0/svg-use-symbols)
![node-current](https://img.shields.io/node/v/@shgysk8zer0/svg-use-symbols)
![npm bundle size gzipped](https://img.shields.io/bundlephobia/minzip/@shgysk8zer0/svg-use-symbols)
[![npm](https://img.shields.io/npm/dw/@shgysk8zer0/svg-use-symbols?logo=npm)](https://www.npmjs.com/package/@shgysk8zer0/svg-use-symbols)

[![GitHub followers](https://img.shields.io/github/followers/shgysk8zer0.svg?style=social)](https://github.com/shgysk8zer0)
![GitHub forks](https://img.shields.io/github/forks/shgysk8zer0/svg-use-symbols.svg?style=social)
![GitHub stars](https://img.shields.io/github/stars/shgysk8zer0/svg-use-symbols.svg?style=social)
[![Twitter Follow](https://img.shields.io/twitter/follow/shgysk8zer0.svg?style=social)](https://twitter.com/shgysk8zer0)

[![Donate using Liberapay](https://img.shields.io/liberapay/receives/shgysk8zer0.svg?logo=liberapay)](https://liberapay.com/shgysk8zer0/donate "Donate using Liberapay")
- - -

- [Code of Conduct](./.github/CODE_OF_CONDUCT.md)
- [Contributing](./.github/CONTRIBUTING.md)
<!-- - [Security Policy](./.github/SECURITY.md) -->

## Installation

```bash
npm i @shgysk8zer0/svg-use-symbols
```

## Supports
- Parsing from JSON and YAML files
  - Creating multiple outputs by using an array of objects with `output` and `icons`
  - Creating a single output file by using simple `id` and `path` object
- Creating from directories
- Fetching SVGs from URLs
- Migrating from `svg-sprite-generate` (converts CSV to JSON or YAML)

## Usage

### CLI
```
Usage: @shgysk8zer0/svg-use-symbols [options]

An npm package for use with `<svg><use xlink:href=""></use></svg>`

Options:
  -V, --version                output the version number
  -c, --config [config]        JSON or YAML config file
  -d, --directory [directory]  path to directory of SVGs
  -e, --encoding [encoding]    encoding (default: "utf8")
  -f, --format [format]        output format for migrating from CSV (default: "json")
  -l, --list [list]            comma separated list of SVGs
  -m, --migrate [migrate]      path to deprecated CSV config file
  -o, --output [output]        output file
  -h, --help                   display help for command
```

```bash
svg-use-symbols -c path/to/config.yml -o img/icons.svg
svg use-symbols -d path/to/svgs/ -o img/icons.svg
svg-use-symbols -l icons/1.svg,icons/2.svg -o img/icons.svg
```

## Config files
This supports YAML, JSON, and *to a limited extent*, CSV. CSV is temporarily
offered for those migrating from `svg-sprite-generator` and will be removed in v2.

For JSON and YAML, two different formats are supported:

```json
{
  "id": "path/to/icon.svg",
  "another": "https://example.com/path/to/icon.svg"
}
```

This will create `<symbol id=":id">`s with `id` taken from the key and contents
from the SVG file at the given path/URL. This **MUST** have output (`-o` or `--output`)
set. This also applies for the temporarily supported CSV config files.

It may also use:

```json
[
  {
    "output": "path/to/output.svg",
    "icons": {
      "id": "path/to/icon.svg",
      "another": "https://example.com/path/to/icon.svg"
    }
  },
  {
    "output": "path/to/output2.svg",
    "icons": {
      "id": "path/to/another-icon.svg",
      "another": "https://example.com/path/to/another-icon.svg"
    }
  }
]
```

### Migrating from `svg-sprite-generator`

```bash
svg-use-symbols -m path/to/config.csv -o path/to/config.json
# Or
svg-use-symbols --migrate path/to/config.csv --format json --output /path/to/config.json
# Or
svg-use-symbols --migrate path/to/config.csv --format yaml --output /path/to/config.yaml
```

This form **MUST NOT** have output (`-o` or `--output`) set, as it is for generating
multiple outputs, each specified by the `output` value.
