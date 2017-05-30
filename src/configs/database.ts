import * as mongoose from 'mongoose';
import variables from './variables';

mongoose.connect('mongodb://' + [variables.DB_HOST, variables.DB_NAME].join('/'));

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('We are connected!');
});
