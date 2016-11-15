require('ts-node').register({ /* options */ });
require('dotenv').load();
require('./src/configure');

require('./src/app')();