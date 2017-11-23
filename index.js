#!/usr/bin/env node
const program = require('commander');
// Require logic.js file and extract controller functions using JS destructuring assignment
const build = require('./src/commands/build');
const package = require('./package.json');

program
  .version(package.version)
  .usage('[options] <file ...>')
  .description('Update your icon library from icomoon zip file');

program
  .command('build <icomoonZipFile>')
  .alias('b')
  .description('Build icomoon')
  .action((icomoonZipFile) => {
    build(icomoonZipFile);
  });

program.parse(process.argv);

if (program.args.length === 0) program.help();