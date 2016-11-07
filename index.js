require('ts-node').register({ /* options */ });
require('./src/app')(process.argv.slice(2));