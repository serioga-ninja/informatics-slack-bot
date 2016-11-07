var fs = require('fs');

require('ts-node').register({ /* options */ });
require('./src/configure');

require('./src/app')(require('./apps'));