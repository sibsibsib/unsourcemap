#!/usr/bin/env node --harmony --harmony-destructuring
const process = require('process')
const sourceMap = require('source-map');
const fs = require('fs');


const usage = `
  Usage:
  unsourcemap.js <mapfile> <line> <column>
`;


const [filename, line, column] = process.argv.slice(2, 5);
if(!filename) {
  console.log(usage);
  console.error(red('Error: A source map file is required.\n'));
  process.exit(1);
}

if(!line || !column) {
  console.log(usage);
  console.error(red('Error: line and column must be specified.\n'));
  process.exit(1);
}

try {
  const rawmap = fs.readFileSync(filename).toString();
}
catch (e) {
  console.log(usage);
  console.error(red(e.message));
  process.exit(1);
}

const consumer = new sourceMap.SourceMapConsumer(rawmap);
const position = consumer.originalPositionFor({line: parseInt(line, 10), column: parseInt(column, 10)})

console.log(formatPosition(position))



// -- helpers --

function formatPosition(position) {
  return `
    ${position.name || '<unknown>'} in
    \x1b[1m\x1b[32m${position.source}:\x1b[37m${position.line}:${position.column}\x1b[0m
  `
}

function red(message) {
  return `\x1b[31m${message}\x1b[0m`
}
