import sequelize = require('./configs/db/db');
import {Posts} from "./models";

Posts.sync();