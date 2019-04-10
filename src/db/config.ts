import * as mongoose from 'mongoose';

import variables from '../configs/variables';

(<any>mongoose).Promise = Promise;
const connectString: string = `mongodb://${variables.DB.user}:${variables.DB.password}@${variables.DB.host}/${variables.DB.name}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`;

mongoose.set('debug', variables.APP.ENVIRONMENT !== 'production');

mongoose.connect(connectString, {
  useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('We are connected!');
});
