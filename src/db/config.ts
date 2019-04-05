import * as mongoose from 'mongoose';

import variables from '../configs/variables';

(<any>mongoose).Promise = Promise;
const connectString: string = `mongodb://${variables.database.user}:${variables.database.password}@${variables.database.host}/${variables.database.name}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`;

mongoose.set('debug', variables.ENVIRONMENT !== 'production');

mongoose.connect(connectString, {
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('We are connected!');
});
