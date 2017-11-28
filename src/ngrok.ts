import ngrok = require('ngrok');
import variables from './configs/variables';

function startNgrok(port: number) {
    ngrok.connect(port, function (err, url) {
        console.log('ngrok', err, url);

        variables.domainUrl = url.split('https://')[1];
    });
}

export default startNgrok;
