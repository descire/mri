const nopt = require('nopt');
const mri = require('mri');
const yargs = require('yargs-parser');
const minimist = require('minimist');
const { Suite } = require('benchmark');

const bench = new Suite();
const args = ['--name=xiaoming', '-abc', '10', '--save-dev', '--age', '20'];

bench
	.add('minimist     ', () => minimist(args))
	.add('mri          ', () => mri(args))
	.add('nopt         ', () => nopt(args))
	.add('yargs-parser ', () => yargs(args))
	.on('cycle', e => console.log(String(e.target)))
	.run();
