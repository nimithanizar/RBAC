#!/bin/node

const fs = require('fs');

const environment = process.argv[2];

function sanitize(input) {
  return input.replace(/[^\w.-]/g, '');
}

const envFileContent = require(`./src/env/env-${sanitize(environment)}.json`);

fs.writeFileSync('./src/env/env.json', JSON.stringify(envFileContent, undefined, 2));
