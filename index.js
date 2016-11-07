var fs = require('fs');

require('ts-node').register({ /* options */ });
require('./src/configure');

fs.readFile('./apps.json', 'utf8', function (err, res) {
    require('./src/app')(JSON.parse(res));
});