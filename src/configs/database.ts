import * as mongoose from 'mongoose';
import variables from './variables';

(<any>mongoose).Promise = global.Promise;
mongoose.connect(`mongodb://${variables.database.user}:${variables.database.password}@${variables.database.host}/${variables.database.name}`, {
    useMongoClient: true,
    /* other options */
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('We are connected!');
});